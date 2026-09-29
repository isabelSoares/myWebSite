import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Box, Button, Container, Toolbar } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useLocation, useNavigate } from 'react-router-dom';

import './TopBar.scss';

interface IProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
}

const redirect_buttons = [
    {name:'About', page: "/"},
    {name:'Experience', page:"/resume"},
    {name:'Off the clock', page:"/hobbies"}
];

export const TopBar = ({ darkMode, onToggleDarkMode }: IProps) => {
    const navigate = useNavigate();

    const location = useLocation();

    return (
        <AppBar position="static" className="top-bar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    
                    <button className="top-bar-mark" aria-label="Go to Isabel's homepage" onClick={() => navigate('/')}>
                        IS<span>.</span>
                    </button>
                    <Box className="top-bar-box">
                            {redirect_buttons.map((button_info) => (
                                <Button
                                    className={'top-bar-button'  + (location.pathname === button_info.page ? ' top-bar-button-selected' : '') }
                                    key={button_info.name}
                                    onClick={() => navigate(button_info.page)}
                                    aria-current={location.pathname === button_info.page ? 'page' : undefined}
                                >
                                    {button_info.name}
                                </Button>     
                            ))}
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
