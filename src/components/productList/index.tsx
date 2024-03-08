import { Box, LinearProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { api } from '../../utills/api/api';
import { DataGrid, ruRU } from '@mui/x-data-grid';
import { tableColums, tableScrollStyle } from '../../utills/tableConfig';
import Toolbar from '../toolBar.js';
import { ProductType } from '../../models/ProductType.js';
import { getUniqueItems } from '../../utills/getUniqueItems.js';
import customNoResutOverlay from '../customNoResutOverlay/index.js';
import LoadingBackdrop from '../loadingBackdrop/index.js';
import {
    FilterStateType,
    initFilterState,
} from '../../models/FilterStateType.js';

const ProductList: FC = () => {
    const [products, setProducts] = useState<ProductType[]>([]);

    const [page, setPage] = useState(0);
    const [loadedPage, setLoadedPage] = useState<number>(0);

    const [isLoading, setIsLoading] = useState(false);
    const [isInitLoading, setIsInitLoading] = useState(false);

    const [filterState, setFilterState] =
        useState<FilterStateType>(initFilterState);
    const [lastFilterFetch, setLastFilterFetch] =
        useState<FilterStateType>(initFilterState);

    const [allResultsShown, setAllResultsShown] = useState(false);

    const fetchProductData = async (currentPage: number) => {
        try {
            setIsLoading(true);
            const apiOffset = !currentPage ? 100 : currentPage * 50;
            const idsLimit = !currentPage ? 110 : 60;
            const idsToSlice = !currentPage ? 100 : 50;

            const ids = await api.getItemsIds(apiOffset, idsLimit);

            const fiftyIds = ids.slice(0, idsToSlice) as string[];

            const items = await api.getItems(fiftyIds);

            setProducts((prev) => [...prev, ...items]);
            setLoadedPage(currentPage);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching products:', error);
        }
    };

    const handlePageChange = (params: { page: number }) => {
        const { value } = filterState;
        if (value) return;
        const currentPage = params.page;
        setPage(currentPage);

        if (currentPage > loadedPage) {
            fetchProductData(currentPage);
        }
    };

    const loadMoreProductsByFilter = async () => {
        const { field, value } = filterState;

        try {
            if (!value) return;
            if (lastFilterFetch.value === filterState.value) return;

            setLastFilterFetch(filterState);
            setAllResultsShown(true);

            setIsLoading(true);

            const filterResult = (await api.filterItems(
                field,
                value
            )) as string[];

            const items = await api.getItems(filterResult);

            if (!items.length) return;

            const uniqueItems = getUniqueItems(products.concat(items));

            setProducts(uniqueItems);
        } catch (error) {
            console.error('Error loading more products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterState = (state: {
        filter: { filterModel: { items: FilterStateType[] } };
    }) => {
        const stateOfFilter = state.filter.filterModel.items[0];
        if (!stateOfFilter || filterState === stateOfFilter) return;
        setFilterState(stateOfFilter);
    };

    useEffect(() => {
        if (!products.length) {
            setIsInitLoading(true);
            fetchProductData(page);
        } else {
            setIsInitLoading(false);
        }
    }, [products.length, page]);

    useEffect(() => {
        setAllResultsShown(lastFilterFetch.value === filterState.value);
    }, [filterState]);

    return (
        <section>
            <LoadingBackdrop onOpen={isInitLoading} />
            {!isInitLoading && (
                <Box>
                    <Typography padding='10px 30px' variant='h5' component='h2'>
                        Украшения в наличии
                    </Typography>
                    <div
                        style={{
                            height: '87vh',
                            margin: '0 30px',
                        }}
                    >
                        <DataGrid
                            sx={tableScrollStyle}
                            onStateChange={handleFilterState}
                            rows={products}
                            columns={tableColums}
                            initialState={{
                                pagination: {
                                    paginationModel: {
                                        page: 0,
                                        pageSize: 50,
                                    },
                                },
                            }}
                            localeText={
                                ruRU.components.MuiDataGrid.defaultProps
                                    .localeText
                            }
                            pageSizeOptions={[50]}
                            onPaginationModelChange={handlePageChange}
                            loading={isLoading}
                            slots={{
                                loadingOverlay: LinearProgress,
                                toolbar: () => (
                                    <Toolbar
                                        filterState={filterState}
                                        hideLoadBtn={allResultsShown}
                                        loadMoreBtnAction={
                                            loadMoreProductsByFilter
                                        }
                                    />
                                ),
                                noResultsOverlay: customNoResutOverlay,
                            }}
                        />
                    </div>
                </Box>
            )}
        </section>
    );
};

export default ProductList;
