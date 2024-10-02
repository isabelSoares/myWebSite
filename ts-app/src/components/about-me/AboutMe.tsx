import React from 'react';
import './AboutMe.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';

interface IProps {}

export const AboutMe = (props: IProps) => {   
    return(
        <div className="about-me">
            <div className="about-me-photo">
                <img src="https://my-website-gallery.s3.eu-west-2.amazonaws.com/general/meMyselfAndI.JPG" alt="MeMyselfAndI"/>
                <div className="contact-me">
                    <div className="contact-me-mail">
                        <a href="mailto:isabel.srsoares@gmail.com">
                            <FontAwesomeIcon icon={faEnvelope} />
                        </a>
                    </div>
                    <div className="contact-me-linkedin">
                        <a href="https://www.linkedin.com/in/isabel-soares-58116b1a4?original_referer=https%3A%2F%2Fgithub.com%2F" target="_blank"  rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                    <div className="contact-me-github">
                        <a href="https://github.com/isabelSoares"  target="_blank"  rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faGithub} />
                        </a>
                    </div>
                </div>
            </div>
            <div className='about-me-text'>
                <h1>
                    Hi everyone!
                    <br/>
                    I'm Isabel Soares 👋🏻
                </h1>
                <p>
                    I'm from Portugal. I studied Computer Science and Engineering
                    specializing in Artificial Intelligence and Front-end 💻
                </p>
                <p>
                    I'm considered a curious person that always wants to learn
                    more and more 🤓 <br /> Since I was child, I was always interested in exploring areas that would 
                    train my brain, such as puzzles, word search games, brain games...<br />
                    Probably that is why, I love math, machine learning and robotics 🤭
                    Right now, I'm a frontend developer passionate about combining AI with human-computer interaction. I love creating intuitive, user-focused interfaces that leverage AI to enhance the user experience.
                </p>
                <p>
                    If you want to know a little bit more about me, explore this website or if you feel lazy today, you can ask the chat bot, on the bottom right corner ➡️
                </p>
            </div>
        </div>
    )
}