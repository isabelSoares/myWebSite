import React from 'react';
import './Internship.scss';
import { Typography } from '@mui/material';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {}

export const Internship = (props: IProps) => {   
    return(
        <div className="internship">
            <Typography className='resume-me-text'>
                <p className='title'><FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>06/2021 - 09/2021</p>
                <p>
                    In the summer of 2021, I did an internship at Primavera Business Software Solutions, nowadays it belongs to the group <a href='https://www.cegid.com/global/'   target="_blank">Cegid</a>.<br />
                    I was part of the Innovation in New Technologies team, focused on Artificial Intelligence. My work consisted on creating a chatbot, 
                    entitled "Primavera ChatBot" for the company using <b>Python</b> and <b>Rasa</b> tool.<br />
                </p>
                <p>
                    I wrote an <a href="https://medium.com/@isabel.srsoares/chatbots-uma-tecnologia-do-futuro-cd39635ff7b5"  target="_blank">article</a> for their internal newsletter about my work (written in Portuguese).
                </p>
              </Typography>
        </div>
    )
}