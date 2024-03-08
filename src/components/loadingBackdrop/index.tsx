import { Backdrop, CircularProgress } from '@mui/material';
import { FC } from 'react';

interface LoadingBackdropProps {
    onOpen: boolean;
}

const LoadingBackdrop: FC<LoadingBackdropProps> = ({ onOpen }) => {
    return (
        <Backdrop open={onOpen}>
            <CircularProgress color='inherit' />
        </Backdrop>
    );
};

export default LoadingBackdrop;
