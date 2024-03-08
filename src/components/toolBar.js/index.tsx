import { Button } from '@mui/material';
import {
    GridToolbarContainer,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { FC } from 'react';
import { FilterStateType } from '../../models/FilterStateType';

interface ToolbarProps {
    filterState: FilterStateType;
    loadMoreBtnAction: () => void;
    hideLoadBtn: boolean;
}

const Toolbar: FC<ToolbarProps> = ({
    filterState,
    loadMoreBtnAction,
    hideLoadBtn,
}) => {
    const LoadMoreButton = () => {
        const { value } = filterState;
        if (!value || hideLoadBtn) {
            return '';
        } else {
            return (
                <Button
                    onClick={loadMoreBtnAction}
                    sx={{ textTransform: 'none' }}
                >
                    Загрузить все товары с таким фильтром
                </Button>
            );
        }
    };

    return (
        <GridToolbarContainer sx={{ margin: '5px' }}>
            <GridToolbarFilterButton />
            <LoadMoreButton />
        </GridToolbarContainer>
    );
};

export default Toolbar;
