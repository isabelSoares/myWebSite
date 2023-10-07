import React from 'react';
import './Hobbies.scss';
import { IPhotoAlbum, PhotoAlbum } from './PhotoAlbum';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCameraRetro} from '@fortawesome/free-solid-svg-icons';

const albumsInformation: IPhotoAlbum[] = [
    {
        albumName: 'Malta, 2023',
        dialogTitle: 'September, 2023',
        dialogImages: [
            { description: 'Sliema, Malta', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'},
            { description: 'Valetta, Malta', image:'https://drive.google.com/uc?id=13Rq_ayr-kqGkI_uEWJcSbYGLN9DGzmY-'},
            { description: 'Blue Lagoon, Malta', image:'https://drive.google.com/uc?id=1Uy1ekKazIngNRDOj3vGEMXF98-pw9_8c'}
        ]
    },
    {
        albumName: 'Cape Verde, 2023',
        dialogTitle: 'July, 2023',
        dialogImages: [
            { description: 'Salt mines, Sal Island', image:'https://drive.google.com/uc?id=1MAaaGOds89MmcIlVExgsIILqx7jKpMoC'},
            { description: 'Buracona, Sal Island', image:'https://drive.google.com/uc?id=1Zg9Jy_L7dnJRQdJb6OhwHCj6izt7RdtA'},
            { description: 'Buracona, Sal Island', image:'https://drive.google.com/uc?id=1xtpxtWj-7qrlvQJn-m93V_Gu26903-r0'}
        ]
    },
    {
        albumName: 'Hungary, 2023',
        dialogTitle: 'April, 2023',
        dialogImages: [
            { description: 'Fisherman\'s Bastion, Budapest', image:'https://drive.google.com/uc?id=1cEgsnqSoqDdWAY8hB9GmB_qa7HKMCKu3'},
            { description: 'Parlament, Budapest', image:'https://drive.google.com/uc?id=1eOyDzyF30LPNREtkbSN88LcWTDfNRXs7'},
            { description: 'Shoes on the Danube Bank, Budapest', image:'https://drive.google.com/uc?id=1JNfiSJ7QLRRdAh4UDGzKDoNRA4-Zupa3'}
        ]
    },
    {
        albumName: 'Spain, 2023',
        dialogTitle: 'March, 2023',
        dialogImages: [
            {description: 'Salamanca', image:'https://drive.google.com/uc?id=1WCWYNYl9JDaG34HHFVVJFhwtOTvSrNb2'},
            {description: 'La Alberca', image:'https://drive.google.com/uc?id=1k0OwJFkP2swlVE-mkjFvRA303M24DEiJ'},
            {description: 'La Alberca', image:'https://drive.google.com/uc?id=1A4lrxBw1tJkOr3O-Kg-VlQGhQpMEBhxK'}
        ]
    },
    {
        albumName: 'Italy, 2022',
        dialogTitle: 'November, 2022',
        dialogImages: [
            {description: 'Roma', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'}
        ]
    },
    {
        albumName: 'Republic Dominican, 2022',
        dialogTitle: 'July, 2022',
        dialogImages: [
            {description: 'Punta Cana', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'}
        ]
    },
    {
        albumName: 'Netherlands,2022 & 2020',
        dialogTitle: 'Malta September,2023',
        dialogImages: [
            {description: 'Sliema,Malta', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'}
        ]
    },
    {
        albumName: 'Portugal',
        dialogTitle: 'During my life',
        dialogImages: [
            {description: 'Serra da Estrela', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'}
        ]
    }
]

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
                {albumsInformation.map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogTitle={item.dialogTitle} dialogImages={item.dialogImages} />
                ))}
            </div>
        </div>
    )
}