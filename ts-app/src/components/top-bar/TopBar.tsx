import React from 'react';
import AppBar from '@mui/material/AppBar';
import LocalFloristSharpIcon from '@mui/icons-material/LocalFloristSharp';
import { Box, Button, Container,Toolbar } from '@mui/material';
import { Link, useNavigate} from 'react-router-dom';

import './TopBar.scss';

interface IProps {}

const redirect_buttons = [
    {name:'About', page: "/"},
    {name:'Resume', page:"/resume"},
    {name:'Hobbies', page:"/hobbies"}
];

export const TopBar = (props: IProps) => {
    const navigate = useNavigate();

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
                            {redirect_buttons.map((button_info) => (
                                <Button
                                    className='top-bar-button'
                                    key={button_info.name}
                                    onClick={() => navigate(button_info.page)}
                                >
                                    {button_info.name}
                                </Button>     
                            ))}
                    </Box>
                </Toolbar>
            </Container>    
        </AppBar>
    )
}