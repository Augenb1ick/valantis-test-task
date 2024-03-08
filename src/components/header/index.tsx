import { AppBar, Box, Toolbar, Typography } from '@mui/material';

const Header = () => {
    return (
        <header>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static' color='transparent'>
                    <Toolbar>
                        <img
                            src='../favicon.ico'
                            style={{ width: '30px', margin: '10px' }}
                        />
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            Valantis
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
        </header>
    );
};

export default Header;
