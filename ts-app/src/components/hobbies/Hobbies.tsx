import React from 'react';
import './Hobbies.scss';
import photoManifest from '../../data/photo-manifest.json';
import { publicPhotoUrl } from '../../data/photo-url';
import { IPhotoAlbum, ImageInformation, PhotoAlbum } from './PhotoAlbum';

const albumsInformation: IPhotoAlbum[] = photoManifest.albums.map((album) => ({
    albumName: album.name,
    dialogImages: album.photos.map((photo): ImageInformation => ({
        description: photo.alt,
        image: publicPhotoUrl(photo.full.src),
        thumbnail: publicPhotoUrl(photo.thumbnail.src),
        width: photo.thumbnail.width,
        height: photo.thumbnail.height,
        fullWidth: photo.full.width,
        fullHeight: photo.full.height,
        rotation: photo.rotation || undefined
    }))
}));

const hero = photoManifest.featured.hero;

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
        <main className='hobbies' id="main-content" tabIndex={-1}>
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
                    <p className="photo-copyright">Photographs © Isabel Soares. Please do not reuse without permission.</p>
                </div>
                {hero && (
                    <img
                        src={publicPhotoUrl(hero.full.src)}
                        alt={hero.alt}
                        width={hero.full.width}
                        height={hero.full.height}
                        className='hobby-photography'
                        loading='lazy'
                        decoding='async'
                    />
                )}
            </section>
            <div className='hobbies-folder'>
                {albumsInformation.filter((item) => item.dialogImages.some((image) => image.image)).map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogImages={item.dialogImages.filter((image) => image.image)} />
                ))}
            </div>
            <aside className="instagram-invite" aria-label="Photography Instagram invitation">
                <p className="section-kicker">ONE LAST FRAME</p>
                <p>If you made it this far, you deserve a reward: follow <a href="https://www.instagram.com/isabel.infilm/" target="_blank" rel="noopener noreferrer">@isabel.infilm <span className="visually-hidden">(opens in a new tab)</span></a> on Instagram. My camera roll needs the emotional support.</p>
            </aside>
        </main>
    )
}
