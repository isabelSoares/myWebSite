import React from 'react';
import './Licenciate.scss';
import { Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';


interface IProps {}

export const Licenciate = (props: IProps) => {   
    return(
        <div className="licenciate">
              <Typography className='licenciate'>
                <p className='title'><a href="https://tecnico.ulisboa.pt/en/" target="_blank">Instituto Superior Técnico (IST) - ULisboa</a>&emsp; <FontAwesomeIcon icon={faCalendarDays} className="icon-style"/>09/2017 - 06/2020</p>
                <p>
                  I took courses related with Informatics, Mathematics and Physics. I also had a Management course during a semester.
                  During this period, I was also mentor of a couple of first-year students on 2019/2020, welcoming them and helping them have the best experience possible.
                </p>
                <p>
                  With my licenciate degree, I acquired some knowledge about the following <b>tecnologies</b>: Python, HTML, JavaScript, CSS, SQL, C.
                </p>
              </Typography>
        </div>
    )
}