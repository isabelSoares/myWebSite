import React from 'react';
import './ContactMe.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';

interface IProps {}

export const ContactMe = (props: IProps) => { 
    return(
        <div className='contact-me'>
            <h1>
                To contact me, I left below some options:
            </h1>
            <div className='contact-me-linkedin'>
                <FontAwesomeIcon icon={faLinkedin} />
                <a href="https://www.linkedin.com/in/isabel-soares-58116b1a4?original_referer=https%3A%2F%2Fgithub.com%2F">
                    LinkedIn
                </a>
            </div>
        </div>

    ) 
}