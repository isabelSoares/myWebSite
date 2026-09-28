import React from 'react';
import './AI Engineer.scss';
import { Typography } from '@mui/material';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


interface IProps {}



export const AIEngineer = (props: IProps) => {   
    return(
        <Typography className='aiengineer'>
            <p className='title'><FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>10/2025 - Present</p>
            <p>
                
            </p>
            <p>
                With this job, I have been acquiring some knowledge about the following <b>tecnologies/tools</b>: JavaScript, Vue.js, HTML, LESS, BitBucket, Postman, Jenkins, Jira and Agile.
                •
Architected and deployed enterprise LLM features using Azure OpenAI, building end-to-end multi-agent systems and automated pipelines integrated into existing CI/CD workflows.
•
Designed and built DocGen, an AI-driven system automating documentation generation and maintaining consistency across 30+ React components and 100+ microservices.
•
Developed the AI Governance Portal, creating an AI agent system for real-time data validation, automated error correction, and an interactive chatbot UI.
•
Optimized LLM performance & reliability through systematic prompt engineering, evaluation frameworks, and output validation guardrails.
            </p>
        </Typography>
    )
}