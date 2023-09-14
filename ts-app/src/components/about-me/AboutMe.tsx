import React from 'react';

interface IProps {}

export const AboutMe = (props: IProps) => { 
    return(
        <header className="About-me-header">
            <p>
                <b>Hi everyone! I'm Isabel Soares 👋🏻</b>
            </p>
            <p>
                I'm from Portugal. I studied Computer Science and Engineering
                specializing in Artificial Intelligence and Front-end 💻
            </p>
            <p>
                I'm considered a curious person that always wants to learn
                more and more 🤓 Since I was child, I really interested to explore areas to 
                train my brain, such as puzzles, "alphabet soup", training games, among others...
                Probably that is why, I love math, machine learning and robotics 🤭
            </p>
        </header>
    )
}