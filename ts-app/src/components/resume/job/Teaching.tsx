import React from 'react';
import './Teaching.scss';
import { Typography } from '@mui/material';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {}

export const Teaching = (props: IProps) => {   
    return(
        <div className="teaching">
            <Typography  className='teaching'>
                <p className='title'><FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>11/2021 - 04/2022</p>
                <p>
                    Due to the Deloitte/Data Science Award 2020/2021 award, the professor invited me as an assistant professor. I was responsible for the <b>Data Science laboratory classes</b> at <a href="https://tecnico.ulisboa.pt/en/" target="_blank">IST</a>. 
                </p>
                <p>My responsabilities were to evaluate the projects and lab exercises of the students of this course.</p>
              </Typography>
        </div>
    )
}