import React from 'react';
import AppBar from '@mui/material/AppBar';
import './TopBar.scss';
import LocalFloristSharpIcon from '@mui/icons-material/LocalFloristSharp';
import { Box, Button, Container,Toolbar, Typography } from '@mui/material';


interface IProps {}

const pages = ['About', 'Resume', 'Hobbies', 'Contact'];

export const TopBar = (props: IProps) => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" className="top-bar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <LocalFloristSharpIcon />
                    <Box 
                        sx={{ flexGrow: 1, display: 'flex'}}
                        justifyContent="flex-end"
                        alignItems="flex-end"
                        font-weight="bold"
                        >
                            {pages.map((page) => (
                            <Button
                                className='top-bar-button'
                                key={page}
                                onClick={handleCloseNavMenu}
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