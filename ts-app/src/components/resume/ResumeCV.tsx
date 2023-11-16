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
          <p className='resume-me-accordion-title'>Here you can see some information about my academic studies:</p>
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
                  I specialized in Frontend and Artificial Intelligence. Maybe you are wondering <i>why?</i> <br />
                  During my bachelor degree, my favorites courses were related with user interaction,
                  I like to stimulate my brain and strive to understand it as best as possible, how people think, what goes on a subconcious level <FontAwesomeIcon icon={faBrain} className="icon-style"/>
                </p>
                <p>Since in my master's degree I did not have the oppportunity to explore the field of robotics, I decided to do that in my thesis.
                  My master thesis, entitled <b>“”Vibrating Colours”: Crossmodal Correspondences between Haptics, 
                  Colours and Emotions on Inclusive Social Robots”</b>, obtained a final grade of 19/20. During my thesis, I explored the relationship between different senses, such as visual and touch, and the emotions linked
                  with these unusual associations. I carried out experiments with people with and without visual impairments,
                  using a small handmade robot which had the form of a Super Mushroom from Super Mario <FontAwesomeIcon icon={faRobot} className="icon-style"/>, which was controlled by an Arduino.
                  After, I performed some use cases to verify whether my robot had a positive impact on an ongoing conversation, reacting through vibration
                  depending on the voice tone of the mixed-visual impaired groups. For instance, when someone was angry, the robot would
                  react with high frequency vibration.</p>
                <p>
                    During the master, I received two awards: <b>Academic Merit Award</b> and <b><a href='https://tt.tecnico.ulisboa.pt/en/parcerias-empresariais/premios-de-merito-a-alunos/premio-de-merito-deloitte-em-ciencia-de-dados/'   target="_blank">Deloitte/Data Science Award 2020/2021</a></b> <FontAwesomeIcon icon={faAward} className="icon-style"/>
                    The first one, was given to all the students above a given percentile of classifications/grades. The second one was awarded
                    to the student with highest grade on the Data Science course of 2020/2021 at IST. The prize was given by Deloitte.
                </p>
                <p>
                    As a curious person, I always want to learn more, sometimes about totally unexplored knowledge areas! <FontAwesomeIcon icon={faRocket} className="icon-style"/>
                    So in March of 2022, I did an one week course at <a href='https://www.tum.de/en/'  target="_blank">Technical University of Munich (TUM)</a>.
                    The course was about "Vehicular Crashworthiness". It was very interesting to acquire knowledge about mechanics and materials' phisical properties.
                    Additionally, I also took an online course entitled "The Fundamentals of Digital Marketing" provided by Google.
                </p>
                <p>
                With my master degree, I acquired some knowledge about the following <b>tecnologies/tools</b>: Pandas, Python, Google Colab, React.js, SCSS, Typescript, C++.
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
                <p><a href="https://tecnico.ulisboa.pt/en/" target="_blank">Instituto Superior Técnico (IST) - ULisboa</a>&emsp; <FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>09/2017 - 06/2020</p>
                <p>
                  I took courses related with Informatics, Mathematics and Physics. I also had a Management course during a semester.
                  During this period, I was also mentor of a couple of first-year students on 2019/2020, welcoming them and helping them have the best experience possible.
                </p>
                <p>
                  With my licenciate degree, I acquired some knowledge about the following <b>tecnologies</b>: Python, HTML, JavaScript, CSS, SQL, C.
                </p>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <p className='resume-me-accordion-title'>In this section, you can see more information about my profissional work:</p>
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
                      As you can see I always want to learn more and after finishing my master and having successfully defended my master thesis, I was not sure of 
                      which computer science area I really wanted to follow.
                      That is why, I decided to risk and explore a different area, completely out of my confort zone and specialization scope: Enterprise Integration and Middleware.<br />
                      In December of 2022, I started working at <a href='https://www.vodafone.pt/'  target="_blank">Vodafone</a> at Portugal, with the role of <b>Enterprise Application Integration Developer</b>. 
                      My main responsabilities are project development using <a href='https://www.softwareag.com/en_corporate/platform/integration-apis/webmethods-integration.html'  target="_blank">WebMethods Integration server platform</a>  
                      &emsp;and  API virtualization, using <b>API Gateway</b>. <br/>
                  </p>
                  <p>
                      With this job, I have been acquiring some knowledge about the following <b>tecnologies/tools</b>: Software AG WebMethods, Splunk Enterprise, Jira, SoapUI, Postman, WebServices API and WinSCP.
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
                      In the summer of 2021, I did an internship at Primavera Business Software Solutions, nowadays it belongs to the group <a href='https://www.cegid.com/global/'   target="_blank">Cegid</a>.<br />
                      I was part of the Innovation in New Technologies team, focused on Artificial Intelligence. My work consisted on creating a chatbot, 
                      entitled "Primavera ChatBot" for the company using <b>Python</b> and <b>Rasa</b> tool.<br />
                  </p>
                  <p>
                      I wrote an <a href="https://medium.com/@isabel.srsoares/chatbots-uma-tecnologia-do-futuro-cd39635ff7b5"  target="_blank">article</a> for their internal newsletter about my work (written in Portuguese).
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
                      Due to the Deloitte/Data Science Award 2020/2021 award, the professor invited me as an assistant professor. I was responsible for the <b>Data Science laboratory classes</b> at <a href="https://tecnico.ulisboa.pt/en/" target="_blank">IST</a> between November, 2021 and April, 2022. 
                  </p>
                      My responsabilities were to evaluate the projects and lab exercises of the students of this course.
              </Typography>
            </AccordionDetails>
          </Accordion>
       </div>

    ) 
}