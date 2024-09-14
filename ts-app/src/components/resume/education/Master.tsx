import React from 'react';
import './Master.scss';

import { Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faBrain, faCalendarDays, faRobot, faRocket } from '@fortawesome/free-solid-svg-icons';


interface IProps {}

export const Master = (props: IProps) => {   
    return(
        <div className="master">
            <Typography className='resume-me-text'>
                <p><a href="https://tecnico.ulisboa.pt/en/"  target="_blank">Instituto Superior Técnico (IST) - ULisboa</a> &emsp; <FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>09/2020 - 11/2022</p>
                <p>
                  I specialized in Frontend and Artificial Intelligence. Maybe you are wondering <i>why?</i> <br />
                  During my bachelor degree, my favorites courses were related with user interaction and as mentioned in the ABOUT section,
                  I like to stimulate my brain and strive to understand it as best as possible, how people think, what goes on a subconcious level <FontAwesomeIcon icon={faBrain} className="icon-style"/>
                </p>
                <p>Since in my master's degree I did not have the oppportunity to explore the field of robotics, I decided to do that in my thesis.
                  My master thesis, entitled <b>“”Vibrating Colours”: Crossmodal Correspondences between Haptics, 
                  Colours and Emotions on Inclusive Social Robots”</b>, obtained a final grade of 19/20. During my thesis, I explored the relationship between different senses, such as visual and touch, and the emotions linked
                  with these unusual associations. I carried out experiments with people with and without visual impairments,
                  using a small handmade robot which had the form of a Super Mushroom from Super Mario <FontAwesomeIcon icon={faRobot} className="icon-style"/>
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
                    So in March of 2022, I did a one week course at <a href='https://www.tum.de/en/'  target="_blank">Technical University of Munich (TUM)</a>.
                    The course was about "Vehicular Crashworthiness". It was very interesting to acquire knowledge about mechanics and materials' phisical properties.
                    Additionally, I also took an online course entitled "The Fundamentals of Digital Marketing" provided by Google.
                </p>
              </Typography>
        </div>
    )
}