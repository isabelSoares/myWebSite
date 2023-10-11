import React from 'react';
import './ResumeCV.scss';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faLaptopCode, faBook, faDatabase, faRobot, faCalendarDays, faBrain, faAward, faRocket} from '@fortawesome/free-solid-svg-icons';

interface IProps {}

export const ResumeCV = (props: IProps) => { 
    return(
        <div className='resume-me-accordion'>
          <p className='resume-me-accordion-title'>Here you could see some information about my academic studies:</p>
          <Accordion>
            <AccordionSummary
              className='summary'
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
                  <FontAwesomeIcon icon={faBook}  className="icon-style"/>
                  <Typography><b>Master Degree in Computer Science and Engineering</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className='resume-me-text'>
                <p><a href="https://tecnico.ulisboa.pt/en/"  target="_blank">Instituto Superior Técnico (IST) - ULisboa</a> &emsp; <FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>09/2020 - 11/2022</p>
                <p>
                  I specialized in Frontend and Artificial Intelligence. You maybe are wondering <i>why?</i> <br />
                  Because during my bachelor degree, my favorites courses were related with the user interaction and as I said in ABOUT section, 
                  I always find interesting something that estimulates my brain and I consider astonishing the neuroscience...(Não sei dizer bonito) <FontAwesomeIcon icon={faBrain} className="icon-style"/>
                </p>
                <p>Since during my master's degree I did not have the oppportunity to explore the robotics area, so I decided to do that in my thesis.
                  My master thesis, entitled <b>“”Vibrating Colours”: Crossmodal Correspondences between Haptics, 
                  Colours and Emotions on Inclusive Social Robots”</b>, obtaining the final grade of 19/20. During the thesis, I explore relationship between different uncommon senses, such as visual and touch and which emotions were
                  caused due to these unsual associations. I tested that with people with and without visual impairment,
                  using a small handmade Super Mushroom Super Mario form robot. <FontAwesomeIcon icon={faRobot} className="icon-style"/>;
                  After, I performed some use cases to testify whether my robot could have a positive impact on conversation, reacting through vibration
                  depending on the voice tone of the mixed-visual impairment participants. For instance, when someone was angry, the robot would
                  react with high frequency vibration.</p>
                <p>
                    During the master, I receive two awards: <b>Academic Merit Award</b> and <b><a href='https://tt.tecnico.ulisboa.pt/en/parcerias-empresariais/premios-de-merito-a-alunos/premio-de-merito-deloitte-em-ciencia-de-dados/'   target="_blank">Deloitte/Data Science Award 2020/2021</a></b>. <FontAwesomeIcon icon={faAward} className="icon-style"/>
                    The first one, it was for all students of the year with best classifications/grades. The last one was awarded
                    to the student with highest grade on the course of Data Science 2020/2021 at Instituto Superior Técnico. The prize was given by Deloitte.
                </p>
                <p>
                    As a curious person, I always want to learn more incluinding different areas! <FontAwesomeIcon icon={faRocket} className="icon-style"/>
                    So at March of 2022, I did a week course at <a href='https://www.tum.de/en/'  target="_blank">Technical University of Munich (TUM)</a>, unfortunately online due to the COVID-19 restrictions.
                    The course was about "Vehicular Crashworthiness". It was very interesting to acquire knowledge about mechanical skills.
                    Moreover, I also did an online course entitled "The Fundamentals of Digital Marketing" of the Google.
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              className='summary'
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
                  <FontAwesomeIcon icon={faBook}  className="icon-style"/>
                  <Typography><b>Licenciate Degree in Computer Science and Engineering</b></Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className='resume-me-text'>
                <p><a href="https://tecnico.ulisboa.pt/en/" target="_blank">Instituto Superior Técnico (IST) - ULisboa</a>&emsp; <FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>09/2020 - 11/2022</p>
                <p>
                  I did courses related with Mathematics, Physics and Informatics. I also did a Management course during a semester.
                  During this period, I was mentor of the first-year students on 2019/2020, helping them to have best enjoyable welcome period.</p>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <p className='resume-me-accordion-title'>In this section, you could see more information about my profissional work:</p>
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
                      That is why, I decided to risk in different area, completely out of my specialization scope: the Enterprise Integration and Middleware.<br />
                      At December of 2022, I started working at <a href='https://www.vodafone.pt/'  target="_blank">Vodafone</a> with the role of EAI Developer. 
                      My main responsabilities are integration of multiple services, using <a href='https://www.softwareag.com/en_corporate/platform/integration-apis/webmethods-integration.html'  target="_blank">WebMethods Integration server platform</a>  
                      &emsp;and improvements the security of APIs, using <b>API Gateway</b>. 
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
                      At summer of 2021, I did an internship at Primavera Business Software Solutions, nowadays it belongs to the group <a href='https://www.cegid.com/global/'   target="_blank">Cegid</a>.<br />
                      I was part of team of Innovation in New Technologies focused on Artificial Intelligence. My work consisted on created a chatbot, 
                      entitled "Primavera ChatBot" for the company using <b>Python</b> and <b>Rasa</b> tool.<br />
                      I wrote an <a href="https://medium.com/@isabel.srsoares/chatbots-uma-tecnologia-do-futuro-cd39635ff7b5"  target="_blank">article</a> for the inner Newsletter of Primavera BSS about my work (in Portuguese).
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
                      Due to the Deloitte/Data Science Award 2020/2021 award, the principal teacher invited me to teach the laboratory classes of this course.
                      I was teacher of DataScience at <a href="https://tecnico.ulisboa.pt/en/" target="_blank">IST</a> between November, 2021 and April, 2022. My responsabilities was evaluated the projects and labs exercises
                      of the students of Data Science course.
                  </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
       </div>

    ) 
}