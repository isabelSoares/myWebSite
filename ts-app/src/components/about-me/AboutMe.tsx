import React from 'react';
import './AboutMe.scss';

import image from './../../resources/meMyselfAndI.JPG';

interface IProps {}

export const AboutMe = (props: IProps) => { 
    return(
        <div className="about-me">
            <div className="about-me-photo">
                <img src={image} alt="MeMyselfAndI"/>
            </div>
            <div className='about-me-text'>
                <h1>
                    <b>Hi everyone! <br /> I'm Isabel Soares 👋🏻</b>
                </h1>
                <p>
                    I'm from Portugal. I studied Computer Science and Engineering
                    specializing in Artificial Intelligence and Front-end 💻
                </p>
                <p>
                    I'm considered a curious person that always wants to learn
                    more and more 🤓 <br /> Since I was child, I really interested to explore areas to 
                    train my brain, such as puzzles, "alphabet soup", brain games...<br />
                    Probably that is why, I love math, machine learning and robotics 🤭
                </p>
            </div>
        </div>
    )
}