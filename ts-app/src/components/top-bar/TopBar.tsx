import React from 'react';
import AppBar from '@mui/material/AppBar';
import LocalFloristSharpIcon from '@mui/icons-material/LocalFloristSharp';
import { Box, Button, Container,Toolbar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import './TopBar.scss';

interface IProps {}

const pages = ['About', 'Resume', 'Hobbies', 'Contact'];

export const TopBar = (props: IProps) => {
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const constHandleButtonClick = () => {
        navigate('/contact');
    }

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
                                    onClick={constHandleButtonClick}
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