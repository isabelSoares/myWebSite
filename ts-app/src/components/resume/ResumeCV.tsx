import React from 'react';
import './ResumeCV.scss';

import { Box, List, Button, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';
import WebSharpIcon from '@mui/icons-material/WebSharp';

interface IProps {}

const redirect_buttons = [
    {name:'Current Job', page:"/resume/currentJob", icon: <WebSharpIcon />},
    {name:'EAI developer', page:"/resume/firstJob", icon: <ComputerIcon />},
    {name:'Teaching', page:"/resume/teaching", icon: <SmartToySharpIcon />},
    {name:'Internship', page:"/resume/internship", icon: <ForumIcon />},
    {name:'Master Degree', page: "/resume/master", icon: <SchoolIcon />},
    {name:'Licenciate Degree', page:"/resume/licenciate", icon: <SchoolIcon />}
];

export const ResumeCV = (props: IProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        ) => {
            setSelectedIndex(index);
            navigate(redirect_buttons[index].page, { replace: true })
    };

    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);  

    return(
        <div className='resume-cv'>
            <p>
                Now if you want to know a little bit more about my education and previous and current job, feel free to take a look:
            </p>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} className='resume-cv-box'>
                <List component="nav" aria-label="main mailbox folders">
                    {
                        redirect_buttons.map((line, index)=> {
                            return (
                                <ListItemButton
                                    selected={selectedIndex === index}
                                    onClick={(event) => handleListItemClick(event, index)}
                                >
                                    <ListItemIcon>
                                        {line.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={line.name} />
                                </ListItemButton>
                            );      
                        })
                    }
                </List>
            </Box>
        </div>
    ) 
}