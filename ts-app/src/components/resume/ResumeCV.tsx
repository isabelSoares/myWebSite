import React from 'react';
import './ResumeCV.scss';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLaptopCode, faBook, faClover, faSchool, faSquarePhone} from '@fortawesome/free-solid-svg-icons';

interface IProps {}

export const ResumeCV = (props: IProps) => { 
    return(
        <div className='resume-me-accordion'>
         <Accordion>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel1a-content"
             id="panel1a-header">
                <FontAwesomeIcon icon={faLaptopCode}  className="icon-style"/>
                <Typography><b>Academic studies</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography>
                <ul>
                    <h2>Master Degree in Computer Science and Engineering </h2>
                        <ul>Instituto Superior Técnico - ULisboa</ul>
                        <li>09/2020 - 11/2022</li>
                        <p> I specialized in Frontend and Artificial Intelligence.</p>
                        <p>
                            During the master, I receive two awards: <b>Academic Merit Award</b> and <b>Deloitte/Data Science Award 2020/2021</b>.
                            The first one, it was for all students of the year with best classifications/grades. The last one award was "GIVEN" 
                            to the student with highest grade on the course of Data Science 2020/2021 at Instituto Superior Técnico. The prize was given by Deloitte.
                        </p>
                        <p>
                            As a curious person, I always want to learn more incluinding different areas!
                            So at March of 2022, I did a week course at Technical University of Munich, unfortunately online due to the COVID-19 restrictions.
                            The course was about "Vehicular Crashworthiness". It was very interesting to acquire knowledge about mechanical skills.<br />
                            Moreover, I also did an online course entitled "The Fundamentals of Digital Marketing" of the Google.
                        </p>
                    <h2>Licenciate Degree in Computer Science and Engineering</h2>
                        <ul>Instituto Superior Técnico - ULisboa,</ul>
                        <li>09/2017 - 06/2020</li>
                        <li>During my Licenciate, I was mentor of the first-year students on 2019/2020.</li>
                </ul>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faBook}  className="icon-style"/>
                <Typography><b>Thesis</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography>
                My master thesis, entitled “”Vibrating Colours”: Crossmodal Correspondences between Haptics, Colours and Emotions on Inclusive Social Robots”, obtaining the final grade of 19/20.
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faSquarePhone}  className="icon-style"/>
                <Typography><b>Currently work</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography>
                <p>
                    At December of 2022, after finishing my master and defending my master thesis, I started working at Vodafone with the role of EAI Developer.
                </p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faClover}  className="icon-style"/>
                <Typography><b>Intership</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography>
                <p>
                    At summer of 2021, I did an internship at Primavera Business Software Solutions, nowadays it belongs to the group "Cegid".<br />
                    I was part of team of Innovation in New Technologies focused on Artificial Intelligence. My work consisted on created a chatbot, 
                    entitled "Primavera ChatBot" for the company using <b>Python</b> and <b>Rasa</b> tool.<br />
                    I wrote an article(TODO hyperlink) for the inner Newsletter of Primavera BSS about my work during the internship (in Portuguese).
                </p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faSchool}  className="icon-style"/>
                <Typography><b>Invited Teaching Assistant</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography>
                <p>
                    Due to the Deloitte/Data Science Award 2020/2021 award, the principal teacher invited me to teach some classes of this course.
                    I was teacher of DataScience at IST between November, 2021 and April, 2022. My responsabilities was evaluated the projects and labs exercises
                    of the students of Data Sience course.
                </p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         
         <Accordion disabled>
           <AccordionSummary
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel3a-content"
             id="panel3a-header"
           >
             <Typography>Disabled Accordion</Typography>
           </AccordionSummary>
         </Accordion>
       </div>

    ) 
}