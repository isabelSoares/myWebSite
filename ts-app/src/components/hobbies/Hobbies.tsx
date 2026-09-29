import React from 'react';
import './Hobbies.scss';
import { IPhotoAlbum, PhotoAlbum } from './PhotoAlbum';

const albumsInformation: IPhotoAlbum[] = [
    {
        albumName: 'Austria, 2025',
        dialogTitle: 'March, 2025',
        dialogImages: [
            { description: 'Schonbrunn Garden', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/austria/IMG_8550.webp'},
            { description: 'Opera Wiener Staatsoper', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/austria/IMG_7778.webp'},
            { description: 'Hallstatt', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/austria/IMG_1757.webp'},
            { description: 'Top of Innsbruck', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/austria/IMG_0594.webp'},
            { description: 'Innbrucke', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/austria/IMG_8278.webp'}
        ]
    },
    {
        albumName: 'UK, 2024',
        dialogTitle: 'October, 2024',
        dialogImages: [
            { description: 'Hyde Park', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/uk/IMG_1110.webp'},
            { description: 'Tower Bridge', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/uk/IMG_0720.webp'},
            { description: 'Nothing Hill', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/uk/IMG_1237.webp'},
            { description: 'Hampstead Health', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/uk/IMG_0671.webp'},
            { description: 'Vintage markets', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/uk/IMG_0962.webp'}
        ]
    },
    {
        albumName: 'Croatia, 2024',
        dialogTitle: 'June, 2024',
        dialogImages: [
            { description: 'Dubrovnik', image:''},
            { description: 'Dubrovnik', image:''},
            { description: 'Makarska', image:''},
            { description: 'Hvar', image:''},
            { description: 'Bol', image:''},
            { description: 'Krka National Park', image:''},
            { description: 'Krka National Park', image:''}

        ]
    },
    {
        albumName: 'Switzerland, 2024',
        dialogTitle: 'March, 2024',
        dialogImages: [
            { description: 'Zurich', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/switzerland/IMG_5237.webp'},
            { description: 'The top of Zurich', image:'https://raw.githubusercontent.com/isabelSoares/myWebSite/97feda5/photos/switzerland/IMG_5481.webp'}
        ]
    },
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
        albumName: 'Spain, 2023 & 2025',
        dialogTitle: 'March, 2023',
        dialogImages: [
            {description: 'Salamanca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1761.jpg'},
            {description: 'La Alberca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1865.jpg'},
            {description: 'La Alberca', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Spain/IMG_1875.jpg'}
        ]
    },
    {
        albumName: 'Italy, 2022 & 2024',
        dialogTitle: 'November, 2022 and 2024',
        dialogImages: [
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9661.JPG'},
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9663.JPG'},
            {description: 'Vatican', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9689.JPG'},
            {description: 'Rome', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9682.JPG'},
            {description: 'Rome', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9672.JPG'},
            {description: 'Portofino', image:'https://my-website-gallery.s3.eu-west-2.amazonaws.com/Italy/IMG_9672.JPG'}
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

const interests = [
    { name: 'Photography', note: 'mostly on trips' },
    { name: 'Boxing', note: 'still learning the footwork' },
    { name: 'LEGO', note: 'yes, I keep the instructions' },
    { name: 'Running', note: 'sometimes voluntarily' },
    { name: 'Music', note: 'always in the background' },
    { name: 'Pilates', note: 'for balance' }
];

interface IProps {}

export const Hobbies = (props: IProps) => {   
    return(
        <main className='hobbies'>
            <header className="hobbies-heading">
                <p className="section-kicker">03 / OFF THE CLOCK</p>
                <h1>Things I do when I am not at my keyboard.</h1>
                <p className="hobbies-lead">Photography is the main one. The rest are a mix of movement, music, travel, and building things that do not need a deployment pipeline. This is the tab where I am allowed to talk about LEGO.</p>
            </header>
            <section className="interest-list" aria-label="Interests">
                {interests.map((interest, index) => (
                    <div className="interest-item" key={interest.name}>
                        <span>0{index + 1}</span>
                        <div>
                            <strong>{interest.name}</strong>
                            <small>{interest.note}</small>
                        </div>
                    </div>
                ))}
            </section>
            <section className="photography-section">
                <div className="photography-intro">
                    <p className="section-kicker">A VISUAL NOTEBOOK</p>
                    <h2>A few places I have photographed.</h2>
                    <p>Landscapes, people, buildings, and architectural details from trips with family and friends. The albums are not a professional photography portfolio; they are just memories I like.</p>
                </div>
                <img src='https://my-website-gallery.s3.eu-west-2.amazonaws.com/general/IMG_9251.jpg' alt='A landscape photographed by Isabel' className='hobby-photography' referrerPolicy="no-referrer" />
            </section>
            <div className='hobbies-folder'>
                {albumsInformation.filter((item) => item.dialogImages.some((image) => image.image)).map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogTitle={item.dialogTitle} dialogImages={item.dialogImages.filter((image) => image.image)} />
                ))}
            </div>
            <aside className="instagram-invite" aria-label="Photography Instagram invitation">
                <p className="section-kicker">ONE LAST FRAME</p>
                <p>If you made it this far, you deserve a reward: follow <a href="https://www.instagram.com/isabel.infilm/" target="_blank" rel="noopener noreferrer">@isabel.infilm</a> on Instagram. My camera roll needs the emotional support.</p>
            </aside>
        </main>
    )
}
