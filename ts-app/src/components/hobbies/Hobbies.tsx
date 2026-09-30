import React from 'react';
import './Hobbies.scss';
import { IPhotoAlbum, ImageInformation, PhotoAlbum } from './PhotoAlbum';

const photoBaseUrl = 'https://raw.githubusercontent.com/isabelSoares/myWebSite/main/photos';

const albumPhotos = (country: string, files: string[]): ImageInformation[] => files.map((file, index) => ({
    description: `${country} photo ${index + 1}`,
    image: `${photoBaseUrl}/${encodeURIComponent(country)}/${file}`
}));

const albumsInformation: IPhotoAlbum[] = [
    {
        albumName: 'Austria',
        dialogImages: albumPhotos('austria', ['IMG_0021.webp', 'IMG_0457.webp', 'IMG_0594.webp', 'IMG_1098.webp', 'IMG_1133.webp', 'IMG_1159.webp', 'IMG_1470.webp', 'IMG_1512.webp', 'IMG_1561.webp', 'IMG_1757.webp', 'IMG_2402.webp', 'IMG_9665.webp'])
    },
    {
        albumName: 'UK',
        dialogImages: albumPhotos('uk', ['IMG_1110.webp', 'IMG_0720.webp', 'IMG_0671.webp', 'IMG_0962.webp', 'IMG_0503.webp', 'IMG_5458.webp'])
    },
    {
        albumName: 'Croatia',
        dialogImages: albumPhotos('croatia', ['IMG_8278.webp', 'IMG_8287.webp', 'IMG_8442.webp', 'IMG_8550.webp', 'IMG_9141.webp', 'IMG_9922.webp'])
    },
    {
        albumName: 'Switzerland',
        dialogImages: albumPhotos('switzerland', ['2024-03-13 16.46.48.webp', 'IMG_5237.webp', 'IMG_5481.webp'])
    },
    {
        albumName: 'Malta',
        dialogImages: albumPhotos('malta', ['IMG20230831095211_01.webp', 'IMG_9248.webp', 'IMG_8686.webp'])
    },
    {
        albumName: 'Spain',
        dialogImages: albumPhotos('spain', ['IMG_1750.webp', 'IMG_1838.webp', 'IMG_1872.webp', 'IMG_4933.webp', 'IMG_5487.webp', 'IMG_5534.webp', 'IMG_7942.webp', 'IMG_7966.webp', 'IMG_7973.webp', 'IMG_8246.webp', 'IMG_8572.webp', 'IMG_8673.webp', 'IMG_8677.webp'])
    },
    {
        albumName: 'Italy',
        dialogImages: albumPhotos('italy', ['IMG_0950.webp', 'IMG_1096.webp', 'IMG_1130.webp', 'IMG_3161.webp', 'IMG_1015.webp', 'IMG_1016.webp', 'IMG_0986.webp'])
    },
    {
        albumName: 'Republic Dominican',
        dialogImages: albumPhotos('republic dominican', ['IMG_2902.webp'])
    },
    {
        albumName: 'Netherlands',
        dialogImages: albumPhotos('netherlands', ['IMG_4420.webp', 'IMG_4436.webp', 'IMG_4712.webp', 'IMG_4401.webp', 'IMG_4266.webp', 'DSCF8321.webp', 'IMG_4646.webp', 'IMG_4187.webp', 'IMG_3877.webp', 'IMG_4366.webp', 'IMG_3821.webp', 'IMG_3867.webp', 'IMG_4377.webp', 'IMG_4252.webp', 'IMG_4340.webp', 'IMG_4419.webp'])
    },
    {
        albumName: 'Brazil',
        dialogImages: albumPhotos('brazil', ['IMG_7670.webp', 'IMG_7305.webp', 'IMG_6871.webp', 'IMG_6864.webp', 'IMG_7829.webp', 'IMG_7034.webp'])
    },
    {
        albumName: 'Canada',
        dialogImages: albumPhotos('canada', ['IMG_7416.webp', 'IMG_7490.webp', 'IMG_7519.webp', 'IMG_8954.webp'])
    },
    {
        albumName: 'France',
        dialogImages: albumPhotos('france', ['IMG_1176.webp', 'IMG_1583.webp', 'IMG_1624.webp', 'IMG_1632.webp', 'IMG_1609.webp'])
    },
    {
        albumName: 'USA',
        dialogImages: albumPhotos('usa', [
            'IMG_4709.webp', 'IMG_5159.webp', 'IMG_4898.webp', 'IMG_2624.webp', 'IMG_5179.webp', 'IMG_2079.webp',
            'IMG_2901.webp', 'IMG_2015.webp', 'IMG_4895.webp', 'IMG_5379.webp', 'IMG_5528.webp', 'IMG_8101.webp',
            'IMG_3063.webp', 'IMG_3327.webp', 'IMG_4661.webp', 'IMG_7683.webp', 'IMG_2090.webp', 'IMG_1976.webp',
            'IMG_4959.webp', 'IMG_7965.webp', 'IMG_8106.webp', 'IMG_8015.webp', 'IMG_4759.webp', 'IMG_5236.webp',
            'IMG_7698.webp', 'IMG_8035.webp', 'IMG_2856.webp', 'IMG_4691.webp', 'IMG_5433.webp', 'IMG_2898.webp',
            'IMG_5536.webp', 'IMG_4999.webp', 'IMG_5008.webp', 'IMG_8114.webp', 'IMG_3001.webp', 'IMG_4966.webp'
        ])
    },
    {
        albumName: 'Portugal',
        dialogImages: albumPhotos('portugal', [
            'IMG_0265.webp', 'IMG_1931.webp', 'IMG_5860.webp', 'IMG_1858.webp',
            'IMG_1706.webp', 'IMG_1839.webp', 'IMG_6647.webp', 'IMG_9770.webp', 'IMG_7200.webp',
            'IMG_5143.webp', 'IMG_7538.webp', 'DSCF8480.webp', 'IMG_1843.webp', 'IMG_1681.webp',
            'IMG_1785.webp', 'IMG_7738.webp', 'IMG_3501.webp', 'IMG_0073.webp', 'IMG_3649.webp',
            'IMG_6298.webp', 'IMG_5965.webp', 'IMG_3678.webp', 'IMG_0541.webp', 'IMG_0384.webp',
            'IMG_1080.webp', 'IMG_1852.webp', 'IMG_4754.webp', 'IMG_1608.webp', 'IMG_9351.webp',
            'IMG_7498.webp', 'IMG_1848.webp', 'IMG_1845.webp', 'IMG_7180.webp', 'IMG_1853.webp',
            'IMG_1081.webp', 'IMG_9777.webp', 'IMG_1255.webp', 'IMG_1097.webp', 'IMG_1644.webp',
            'IMG_1846.webp', 'IMG_9762.webp', 'IMG_1149.webp', 'IMG_2266.webp', 'IMG_9902.webp',
            'IMG_3363.webp', 'IMG_6567.webp', 'IMG_3499.webp', 'IMG_0098.webp', 'IMG_9558.webp',
            'c7be799f-a549-42b3-b4e1-bb8c9f6266f5.webp', 'IMG_0743.webp', 'IMG_7182.webp', 'IMG_7497.webp',
            'IMG_1902.webp', 'IMG_1899.webp', 'IMG_1933.webp', 'IMG_0322.webp', 'IMG_1358.webp',
            'IMG_1768_SnapseedCopy.webp', 'IMG_1905.webp', 'IMG_0247.webp', 'IMG_1006.webp',
            'IMG_1856.webp', 'IMG_9949.webp', 'IMG_0379.webp', 'IMG_2938.webp', 'IMG_3329.webp',
            'IMG_0339.webp', 'IMG_7700.webp', 'IMG_1861.webp', 'IMG_7960.webp', 'IMG_5859.webp'
        ])
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
                <img src={`${process.env.PUBLIC_URL}/photos/1BB3E15D-4298-4C6F-8739-81386C84431E.webp`} alt='sunset and a person jump' className='hobby-photography' />
            </section>
            <div className='hobbies-folder'>
                {albumsInformation.filter((item) => item.dialogImages.some((image) => image.image)).map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogImages={item.dialogImages.filter((image) => image.image)} />
                ))}
            </div>
            <aside className="instagram-invite" aria-label="Photography Instagram invitation">
                <p className="section-kicker">ONE LAST FRAME</p>
                <p>If you made it this far, you deserve a reward: follow <a href="https://www.instagram.com/isabel.infilm/" target="_blank" rel="noopener noreferrer">@isabel.infilm</a> on Instagram. My camera roll needs the emotional support.</p>
            </aside>
        </main>
    )
}
