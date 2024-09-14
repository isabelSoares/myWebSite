import React from 'react';
import AppBar from '@mui/material/AppBar';
import LocalFloristSharpIcon from '@mui/icons-material/LocalFloristSharp';
import { Box, Button, Container,Toolbar } from '@mui/material';
import { Link, useLocation, useNavigate} from 'react-router-dom';

import './TopBar.scss';

interface IProps {}

const redirect_buttons = [
    {name:'About', page: "/", morePages: false},
    {name:'Resume', page:"/resume", morePages: true},
    {name:'Hobbies', page:"/hobbies", morePages: false}
];

export const TopBar = (props: IProps) => {
    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);  

    return (
        <AppBar position="static" className="top-bar">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    
                    <img src='https://my-website-gallery.s3.eu-west-2.amazonaws.com/general/flower.png' alt='flower' width="35px"></img>
                    <Box className="top-bar-box"
                        >
                            {redirect_buttons.map((button_info) => (
                                <Button
                                    className={'top-bar-button'  + (location.pathname === button_info.page || (button_info.morePages && location.pathname.startsWith(button_info.page))   ? ' top-bar-button-selected' : '') }
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