import React from 'react';
import './ResumeCV.scss';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLaptopCode, faBook, faDatabase, faRobot} from '@fortawesome/free-solid-svg-icons';

interface IProps {}

export const ResumeCV = (props: IProps) => { 
    return(
        <div className='resume-me-accordion'>
         <Accordion>
           <AccordionSummary
             className='summary'
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel1a-content"
             id="panel1a-header">
                <FontAwesomeIcon icon={faBook}  className="icon-style"/>
                <Typography><b>Academic studies</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography className='resume-me-text'>
                    <h2>Master Degree in Computer Science and Engineering </h2>
                        <p>Instituto Superior Técnico - ULisboa &emsp; 09/2020 - 11/2022</p>
                        <p>
                          I specialized in Frontend and Artificial Intelligence. You maybe are wondering <i>why?</i> <br />
                          Because during my bachelor degree, my favorites courses are related with the user interaction and as I said in ABOUT, 
                          I always find interesting something that estimulates the brain and I considered ashtoning the neuroscience...(Não sei dizer bonito) 
                        </p>
                        <p>Since during my master's degree I did not have the oppportunity to explore the robotics area, so I decided to do that in my theis.
                          My master thesis, entitled <b>“”Vibrating Colours”: Crossmodal Correspondences between Haptics, 
                          Colours and Emotions on Inclusive Social Robots”</b>, obtaining the final grade of 19/20. The thesis subdivided in two user tests: 
                          The first one to explore relations between different uncommon senses, such as visual and touch and which emotions were
                          caused due to these unsual associations. I tested with different two people groups, people with and without visual impairment,
                          using a Super Mushroom Super Mario form robot. This robot contained a vibrator motor with a neutral color (all made by myself);
                          The last one, I did some use cases to test whether my robot could have a positive impact on conversation, reacting through vibration
                          depending on the voice tone of the mixed-visual impairment participants. For instance, when someone was angry, the robot would
                          react with high frequency vibration.</p>
                        <p>
                            During the master, I receive two awards: <b>Academic Merit Award</b> and <b>Deloitte/Data Science Award 2020/2021</b>.
                            The first one, it was for all students of the year with best classifications/grades. The last one was awarded
                            to the student with highest grade on the course of Data Science 2020/2021 at Instituto Superior Técnico. The prize was given by Deloitte.
                        </p>
                        <p>
                            As a curious person, I always want to learn more incluinding different areas!
                            So at March of 2022, I did a week course at Technical University of Munich, unfortunately online due to the COVID-19 restrictions.
                            The course was about "Vehicular Crashworthiness". It was very interesting to acquire knowledge about mechanical skills.<br />
                            Moreover, I also did an online course entitled "The Fundamentals of Digital Marketing" of the Google.
                        </p>
                    <h2>Licenciate Degree in Computer Science and Engineering</h2>
                        <p>Instituto Superior Técnico - ULisboa  &emsp; 09/2017 - 06/2020</p>
                        <p>
                          COURSES???
                          During my Licenciate, I was mentor of the first-year students on 2019/2020.</p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             className='summary'
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faLaptopCode}  className="icon-style"/>
                <Typography><b>Currently work</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography className='resume-me-text'>
                <p>
                    As you could see I always want to learn more and after finishing my master and defending my master thesis, I did not know sure 
                    which informatics areas I really wanted to work.
                    That is why, I decided to start in different area, completely out of my specialization scope: the Enterprise Integration and Middleware.<br />
                    At December of 2022, I started working at Vodafone with the role of EAI Developer. 
                    My main responsabilities are integration of multiple services, using <b>WebMethods Integration</b> language 
                    and improving the secure of APIs, using <b>API Gateway</b>. 
                </p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             className='summary'
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faRobot}  className="icon-style"/>
                <Typography><b>Intership</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography className='resume-me-text'>
                <p>
                    At summer of 2021, I did an internship at Primavera Business Software Solutions, nowadays it belongs to the group "Cegid".<br />
                    I was part of team of Innovation in New Technologies focused on Artificial Intelligence. My work consisted on created a chatbot, 
                    entitled "Primavera ChatBot" for the company using <b>Python</b> and <b>Rasa</b> tool.<br />
                    I wrote an <a href="https://medium.com/@isabel.srsoares/chatbots-uma-tecnologia-do-futuro-cd39635ff7b5"  target="_blank">article</a> for the inner Newsletter of Primavera BSS about my work during the internship (in Portuguese).
                </p>
             </Typography>
           </AccordionDetails>
         </Accordion>
         <Accordion>
           <AccordionSummary
             className='summary'
             expandIcon={<ExpandMoreIcon />}
             aria-controls="panel2a-content"
             id="panel2a-header">
                <FontAwesomeIcon icon={faDatabase}  className="icon-style"/>
                <Typography><b>Invited Teaching Assistant</b></Typography>
           </AccordionSummary>
           <AccordionDetails>
             <Typography  className='resume-me-text'>
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
             className='summary'
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