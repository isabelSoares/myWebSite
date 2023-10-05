import React from 'react';
import './Hobbies.scss';
import { PhotoAlbum } from './PhotoAlbum';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCameraRetro, faFolder} from '@fortawesome/free-solid-svg-icons';

interface IProps {}



export const Hobbies = (props: IProps) => {   
    return(
        <div className='hobbies'>
            <p>
                As a ordinary teenager, my favorite hobbies are always listening to music and watching series and movies.
                But, moreover I really love to  <br /> take pictures to landscapes, people, building architecture.
                I love travelling around the world however never without a camera in my hands to collect all memories <FontAwesomeIcon icon={faCameraRetro} className="icon-style"/> <br />
            </p>
            <img src='https://drive.google.com/uc?id=1fsD6tf-XtOEIiIKvHZ1p_fdx4Q0A46lD' alt='Isabel is photographing' className='hobby-photography'></img>
            <p>Below, you could see some of my favourites pictures taken for me during some trips that I did with my family and friends:</p>
            <div className='hobbies-folder'>
                <PhotoAlbum />
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
            </div>
        </div>
    )
}