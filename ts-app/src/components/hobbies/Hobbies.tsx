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
            { description: 'Sliema', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG20230831095211_01.jpg'},
            { description: 'Blue Lagoon', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG_8902.jpg'},
            { description: 'Blue Lagoon', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG_8891.jpg'},
            { description: 'Valetta', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG_8367.jpg'},
            { description: 'Blue Grotto', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG_9148.jpg'},
            { description: 'Gozo', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Malta/IMG_8930.jpg'}
        ]
    },
    {
        albumName: 'Cape Verde, 2023',
        dialogTitle: 'July, 2023',
        dialogImages: [
            { description: 'Santa Maria, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5920.jpg'},
            { description: 'Fishing area, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5427.jpg'},
            { description: 'Salt mines, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5504.jpg'},
            { description: 'Buracona, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5416.jpg'},
            { description: 'Buracona, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5402.jpg'},
            { description: 'Buracona, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5396.jpg'},
            { description: 'Buracona, Sal', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/CapeVerde/IMG_5410.jpg'}
        ]
    },
    {
        albumName: 'Hungary, 2023',
        dialogTitle: 'April, 2023',
        dialogImages: [
            { description: 'Fisherman\'s Bastion, Budapest', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Hungary/IMG_2502.jpg'},
            { description: 'Parlament, Budapest', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Hungary/IMG_2756.jpg'},
            { description: 'Shoes on the Danube Bank, Budapest', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Hungary/Shoes2ndWorldWar.jpg'},
            { description: 'Széchenyi Thermal, Budapest', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Hungary/Termal.jpg'}
        ]
    },
    {
        albumName: 'Spain, 2023',
        dialogTitle: 'March, 2023',
        dialogImages: [
            {description: 'Salamanca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1761.jpg'},
            {description: 'La Alberca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1865.jpg'},
            {description: 'La Alberca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1875.jpg'}
        ]
    },
    {
        albumName: 'Italy, 2022',
        dialogTitle: 'November, 2022',
        dialogImages: [
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9661.JPG'},
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9663.JPG'},
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9689.JPG'},
            {description: 'Rome', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9682.JPG'},
            {description: 'Rome', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9672.JPG'}
        ]
    },
    {
        albumName: 'Republic Dominican, 2022',
        dialogTitle: 'July, 2022',
        dialogImages: [
            {description: 'Isla Sahona, Punta Cana', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/RepublicDominican/IMG_2902.jpg'},
            {description: 'Punta Cana', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/RepublicDominican/IMG_2623.jpg'},
            {description: 'Monkeyland, Punta Cana', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/RepublicDominican/IMG_2B2CD28C5E20-54.jpeg'}
        ]
    },
    {
        albumName: 'Netherlands, 2020 & 2022',
        dialogTitle: 'February, 2020 & 2020',
        dialogImages: [
            {description: 'Den Haag', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Netherlands/IMG_2B2CD28C5E20-7.jpeg'},
            {description: 'Utrecht', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Netherlands/IMG_2B2CD28C5E20-6.jpeg'},
            {description: 'Rotterdam', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Netherlands/IMG_2B2CD28C5E20-10.jpeg'},
            {description: 'Eindhoven', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Netherlands/IMG_2B2CD28C5E20-2.jpeg'},
            {description: 'Eindhoven', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Netherlands/IMG_2B2CD28C5E20-3.jpeg'}
        ]
    },
    {
        albumName: 'Portugal',
        dialogTitle: 'During my life',
        dialogImages: [
            {description: 'Almada', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/1BB3E15D-4298-4C6F-8739-81386C84431E.JPEG'},
            {description: 'Serra da Estrela', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_2B2CD28C5E20-59.jpeg'},
            {description: 'Gêres', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_2B2CD28C5E20-63.jpeg'},
            {description: 'Gêres', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_2B2CD28C5E20-64.jpeg'},
            {description: 'Aveiro', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_2B2CD28C5E20-48.jpeg'},
            {description: 'Lisboa', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_0541.jpg'},
            {description: 'Lisboa', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_9949.jpg'},
            {description: 'Lisboa', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_9902.jpg'},
            {description: 'Lisboa', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_9552.jpg'},
            {description: 'Porto', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Portugal/IMG_2B2CD28C5E20-15.jpeg'}
        ]
    }
]

interface IProps {}

export const Hobbies = (props: IProps) => {   
    return(
        <div className='hobbies'>
            <p>
                As a ordinary teenager, my favorite hobbies are listening to music and watching series and movies.
                However, what I really love is to <br /> take pictures of landscapes, people, buildings and architectural pieces.
                I love travelling around the world, always with a camera in my hands to collect all memories 📷 🎞️ <br />
            </p>
            <img src='https://my-website-gallery.s3.eu-west-2.amazonaws.com/general/IMG_9251.jpg' className='hobby-photography' referrerPolicy="no-referrer"></img>
            <p>Below, you can see some of my favourites pictures taken by me during some of the trips I took with my family and friends:</p>
            <div className='hobbies-folder'>
                {albumsInformation.map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogTitle={item.dialogTitle} dialogImages={item.dialogImages} />
                ))}
            </div>
        </div>
    )
}