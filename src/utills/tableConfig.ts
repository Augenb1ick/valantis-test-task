import { GridColDef, getGridStringOperators } from '@mui/x-data-grid';

const filterOperators = getGridStringOperators().filter((op) =>
    ['contains'].includes(op.value)
);

export const tableColums: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Идентификатор',
        minWidth: 80,
        filterable: false,
        flex: 1,
    },
    {
        field: 'product',
        headerName: 'Название',
        minWidth: 250,
        filterOperators,
        flex: 2,
    },
    {
        field: 'price',
        headerName: 'Цена',
        minWidth: 50,
        filterOperators,
        flex: 1,
    },
    {
        field: 'brand',
        headerName: 'Бренд',
        minWidth: 100,
        filterOperators,
        flex: 1,
    },
];

export const tableScrollStyle = {
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
        width: '0.4em',
        height: '0.4em',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
        background: '#f1f1f1',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
    },
    '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
        background: '#555',
    },
};
