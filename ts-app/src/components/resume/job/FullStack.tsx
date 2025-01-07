import React from 'react';
import './FullStack.scss';
import { Typography } from '@mui/material';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {}

export const FullStack = (props: IProps) => {   
    return(
        <div className="fullStack">
            <Typography className='feTOBi'>
                <p className='title'><FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>02/2024 - 10/2024</p>
                <p>
                    With my adventurous spirit, I decided to embark on a new challenge. I started in February 2024, an area rotation for the Vodafone's chatbot team, <a href='https://tobi.vodafone.pt/'  target="_blank">TOBi</a>.<br></br>
                    As a front end developer, my main responsabilities were creating new visual animations to improve the customer experience.
                    For instance, I implemented the red background with extra information on left and visual animations of waiting moments for a better appealing customer experience. 
                </p>
                <p>
                    With this job, I have been acquiring some knowledge about the following <b>tecnologies/tools</b>: JavaScript, Node.js, HTML, CSS, Jenkins, Jira and Agile.
                </p>
            </Typography>
            <Typography className='fullStack'>
                <p className='title'><FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>10/2024 - Present</p>
                <p>
                    After eight months, my job area rotation ended at TOBi squad. So, I started to work at <a href='https://www.vodafone.pt/'  target="_blank">Vodafone's website</a> team, as a Full Stack developer.<br></br>
                    As a full stack developer, I developed visual improvements and some services for the website, without logging.
                    For instance, I implemented visual improvements on the red banner with quicklinks for Vodafone's products on homepage for a better appealing customer experience. 
                </p>
                <p>
                    With this job, I have been acquiring some knowledge about the following <b>tecnologies/tools</b>: JavaScript, Vue.js, HTML, LESS BitBucket, Postman, Jenkins, Jira and Agile.
                </p>
            </Typography>
        </div>
    )
}