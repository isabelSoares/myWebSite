import React from 'react';
import AppBar from '@mui/material/AppBar';
import ForestIcon from '@mui/icons-material/Forest';
import { Box, Button, Container,Toolbar, Typography } from '@mui/material';


interface IProps {}

const pages = ['About', 'Resume', 'Hobbies', 'Contact'];

export const TopBar = (props: IProps) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={{ background: "#aaf6f5"}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        display: 'flex',
                        flexGrow: 1,
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'black',
                        textDecoration: 'none',
                        }}
                    >
                        <ForestIcon />
                    </Typography>
                    <Box 
                        sx={{ flexGrow: 1, display: 'flex'}}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        font-weight="bold"
                        >
                            {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'black', display: 'block' }}
                            >
                                {page}
                            </Button>
                            ))}
                    </Box>
                </Toolbar>
            </Container>    
        </AppBar>
    )
}