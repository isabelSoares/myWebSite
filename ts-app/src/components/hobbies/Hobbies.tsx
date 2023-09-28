import React from 'react';
import './Hobbies.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCameraRetro} from '@fortawesome/free-solid-svg-icons';

interface IProps {}

export const Hobbies = (props: IProps) => {   
    return(
        <div className='hobbies'>
            <h1>
                As a ordinary teenager, my favorite hobbies are always listening to music and watching series and movies.<br />
            </h1>
            <h2>
                But, moreover I really love to take pictures to sightseeing, people, building architecture. <br />
                I love to travel around the world however never without a camera in my hands <FontAwesomeIcon icon={faCameraRetro}  className="icon-style"/>
            </h2>
        </div>
    )
}