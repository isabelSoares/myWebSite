import React from 'react';
import './ResumeCV.scss';

import { Box, List, Button, ListItemButton, ListItemIcon, ListItemText} from '@mui/material';
import { Link, useLocation, useNavigate} from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import ComputerIcon from '@mui/icons-material/Computer';
import SmartToySharpIcon from '@mui/icons-material/SmartToySharp';

interface IProps {}

const redirect_buttons = [
  {name:'Master Degree', page: "/master"},
  {name:'Licenciate Degree', page:"/licenciate"},
  {name:'Current Job', page:"/currentJob"},
  {name:'EAI developer', page:"/firstJob"},
  {name:'Internship', page:"/internship"},
  {name:'Teaching', page:"/teaching"}
];

export const ResumeCV = (props: IProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
        ) => {
            setSelectedIndex(index);
    };

    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);  

    return(
        <div className='resume-cv'>
            <p>
                Now if you want to know a little bit more about my education and previous and current job, feel free to take a look:
            </p>
            <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                <List component="nav" aria-label="main mailbox folders">
                    <ListItemButton
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0)}
                    >
                        <ListItemIcon>
                        <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Current job" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1)}
                    >
                        <ListItemIcon>
                        <ComputerIcon />
                        </ListItemIcon>
                        <ListItemText primary="EAI developer" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemIcon>
                        <SmartToySharpIcon />
                        </ListItemIcon>
                        <ListItemText primary="Teaching assistant" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemIcon>
                        <ForumIcon />
                        </ListItemIcon>
                        <ListItemText primary="Internship" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 4}
                        onClick={(event) => handleListItemClick(event, 4)}
                    >
                        <ListItemIcon>
                        <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Master Degree Computer Science and Engineering" />
                    </ListItemButton>
                    <ListItemButton
                        selected={selectedIndex === 5}
                        onClick={(event) => handleListItemClick(event, 5)}
                    >
                        <ListItemIcon>
                        <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary="Licenciate Degree Computer Science and Engineering" />
                    </ListItemButton>
                </List>
            </Box>
        </div>
    ) 
}