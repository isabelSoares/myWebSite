import React from 'react';
import AppBar from '@mui/material/AppBar';
import { Container, Toolbar, Typography } from '@mui/material';


interface IProps {
    info: string
}

export const TopBar = (props: IProps) => {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                     🐼   
                    </Typography>
                </Toolbar>
            </Container>    
        </AppBar>


    )
}