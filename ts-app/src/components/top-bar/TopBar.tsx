import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Button, Container, Toolbar } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useLocation } from 'react-router-dom';

import './TopBar.scss';

interface IProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

const redirect_buttons = [
    {name:'About', page: "/"},
    {name:'Experience', page:"/resume"},
    {name:'Projects', page:"/projects"},
    {name:'Hobbies', page:"/hobbies"}
];

export const TopBar = ({ darkMode, onToggleDarkMode }: IProps) => {
    const location = useLocation();

    return (
        <AppBar position="static" className="top-bar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Link className="top-bar-mark" to="/" aria-label="Go to Isabel's homepage">
                        IS<span>.</span>
                    </Link>
                    <Box className="top-bar-box">
                        <nav className="top-bar-nav" aria-label="Primary">
                            {redirect_buttons.map((button_info) => (
                                <Button
                                    component={Link}
                                    to={button_info.page}
                                    className={'top-bar-button'  + (location.pathname === button_info.page ? ' top-bar-button-selected' : '') }
                                    key={button_info.name}
                                    aria-current={location.pathname === button_info.page ? 'page' : undefined}
                                >
                                    {button_info.name}
                                </Button>     
                            ))}
                        </nav>
                        <button
                            className="theme-toggle"
                            type="button"
                            onClick={onToggleDarkMode}
                            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </button>
                    </Box>
                </Toolbar>
            </Container>    
        </AppBar>
    )
}
