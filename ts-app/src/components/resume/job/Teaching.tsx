import React from 'react';
import './Teaching.scss';
import { Typography } from '@mui/material';


interface IProps {}

export const Teaching = (props: IProps) => {   
    return(
        <div className="teaching">
            <Typography  className='resume-me-text'>
                  <p>
                      Due to the Deloitte/Data Science Award 2020/2021 award, the professor invited me as an assistant professor. I was responsible for the <b>Data Science laboratory classes</b> at <a href="https://tecnico.ulisboa.pt/en/" target="_blank">IST</a> between November, 2021 and April, 2022. 
                  </p>
                      My responsabilities were to evaluate the projects and lab exercises of the students of this course.
              </Typography>
        </div>
    )
}