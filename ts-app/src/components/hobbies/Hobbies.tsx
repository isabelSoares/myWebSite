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
            { description: 'Sliema', image:'https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl'},
            { description: 'Blue Lagoon', image:'https://drive.google.com/uc?id=14ipADLlKyckQP_Ck99xwopmIdUPY9nql'},
            { description: 'Blue Lagoon', image:'https://drive.google.com/uc?id=1xPx_NoDa7eDHBpyjFIvF6gD4jTKPQBMZ'},
            { description: 'Blue Lagoon', image:'https://drive.google.com/uc?id=1Uy1ekKazIngNRDOj3vGEMXF98-pw9_8c'},
            { description: 'Valetta', image:'https://drive.google.com/uc?id=13Rq_ayr-kqGkI_uEWJcSbYGLN9DGzmY-'},
            { description: 'Valetta', image:'https://drive.google.com/uc?id=1EwtRxEsviAwVnxSiH9kzWy9hmbFvE0Us'},
            { description: 'Blue Grotto', image:'https://drive.google.com/uc?id=1CeXlmcyaiE6r3iUDHHCZkgYXY-FhJwNM'},
            { description: 'Gozo', image:'https://drive.google.com/uc?id=1yUO-EsE8hQT2y6yN9JUoLzs0xTPhjvpK'}
        ]
    },
    {
        albumName: 'Cape Verde, 2023',
        dialogTitle: 'July, 2023',
        dialogImages: [
            { description: 'Santa Maria, Sal', image:'https://drive.google.com/uc?id=1172-iFs_nS6LGu2oZcOPuBThr_1Lw3Q8'},
            { description: 'Fishing area, Sal', image:'https://drive.google.com/uc?id=1k2-rezin27ayVEKQmr2Nmco-02Tx0irZ'},
            { description: 'Salt mines, Sal', image:'https://drive.google.com/uc?id=1MAaaGOds89MmcIlVExgsIILqx7jKpMoC'},
            { description: 'Buracona, Sal', image:'https://drive.google.com/uc?id=1Zg9Jy_L7dnJRQdJb6OhwHCj6izt7RdtA'},
            { description: 'Buracona, Sal', image:'https://drive.google.com/uc?id=1E5EgacGQ0Uumn3InvUEhviJqjVJ-bl-H'},
            { description: 'Buracona, Sal', image:'https://drive.google.com/uc?id=1xtpxtWj-7qrlvQJn-m93V_Gu26903-r0'}
        ]
    },
    {
        albumName: 'Hungary, 2023',
        dialogTitle: 'April, 2023',
        dialogImages: [
            { description: 'Fisherman\'s Bastion, Budapest', image:'https://drive.google.com/uc?id=1cEgsnqSoqDdWAY8hB9GmB_qa7HKMCKu3'},
            { description: 'Parlament, Budapest', image:'https://drive.google.com/uc?id=1eOyDzyF30LPNREtkbSN88LcWTDfNRXs7'},
            { description: 'Shoes on the Danube Bank, Budapest', image:'https://drive.google.com/uc?id=1JNfiSJ7QLRRdAh4UDGzKDoNRA4-Zupa3'},
            { description: 'Széchenyi Thermal, Budapest', image:'https://drive.google.com/uc?id=1xeIwmLkBQa9mi6OtKQhtWj67ahZ1v5tA'}
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
            {description: 'Vatican', image:'https://drive.google.com/uc?id=1krrz8xaU_V9iw3fVah42gh8-IMdzBakd'},
            {description: 'Vatican', image:'https://drive.google.com/uc?id=1LfAgJA9uLwX3_IAG88XDEzVZUKcc6Hm2'},
            {description: 'Vatican', image:'https://drive.google.com/uc?id=1DFMt5y3IST7k6_6Lsh48rVmfD6VXlU8M'},
            {description: 'Rome', image:'https://drive.google.com/uc?id=1Oghta8pl0fo40aXDX5icPhfOwG6Mvaav'},
            {description: 'Rome', image:'https://drive.google.com/uc?id=13BP7u-IJCrk1e5oEWWFQ0Ku2HPehyk0H'}
        ]
    },
    {
        albumName: 'Republic Dominican, 2022',
        dialogTitle: 'July, 2022',
        dialogImages: [
            {description: 'Isla Sahona, Punta Cana', image:'https://drive.google.com/uc?id=1k8e6JxZonWG9pkwUhgQygziwELxnOQ4S'},
            {description: 'Punta Cana', image:'https://drive.google.com/uc?id=11ivFSAoeConRmlN0yr8ThbcLcpO95WfK'},
            {description: 'Monkeyland, Punta Cana', image:'https://drive.google.com/uc?id=1bXfNZ_SwQ61Cb_-RoeRwwOtzl68oSa4g'},
            {description: 'Monkeyland, Punta Cana', image:'https://drive.google.com/uc?id=1flS2UaZGA-ghBy5e_y2wiMgV78C47FQd'}
        ]
    },
    {
        albumName: 'Netherlands, 2020 & 2022',
        dialogTitle: 'February, 2020 & 2020',
        dialogImages: [
            {description: 'Den Haag', image:'https://drive.google.com/uc?id=1giLlDjwiZSNVNVt-rbIKktc2b-PlJbEv'},
            {description: 'Utrecht', image:'https://drive.google.com/uc?id=1jdLOGOYQ5AzHMWqFzhr-2p6X88bIBPfK'},
            {description: 'Rotterdam', image:'https://drive.google.com/uc?id=1FxwGXz-pp0-yMLAiMkW_QRvVflbpdxly'},
            {description: 'Eindhoven', image:'https://drive.google.com/uc?id=12VGHGx-iwlQhCMT_Fn-Eax7PgxEliCra'},
            {description: 'Eindhoven', image:'https://drive.google.com/uc?id=1yhmDZ6c85Ue04Fpm2ZVFHDys0yhqTIRG'}
        ]
    },
    {
        albumName: 'Portugal',
        dialogTitle: 'During my life',
        dialogImages: [
            {description: 'Almada', image:'https://drive.google.com/uc?id=1mNjFICGvNTUD3wZ6O2Bc9HUpUNMoJ7wr'},
            {description: 'Serra da Estrela', image:'https://drive.google.com/uc?id=1dcWgoflybCu3_S_kSt4SHo5Ea0G5R81T'},
            {description: 'Gêres', image:'https://drive.google.com/uc?id=13NJvx4SGbI9QiLzUr5OxRmQ-igPK-5SJ'},
            {description: 'Gêres', image:'https://drive.google.com/uc?id=13UEbG2v-ndkHeJDOjY4vhJj8-nFYrzZw'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=1Uvj0itkQ14PhjR5E0ORemOAXviPXodNf'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=1-jEvC9bCGAkmuXsnGLHPHiYyBcRNJJjW'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=1q2BrOKZb3k5UJ8stcNG-fW4mnqtqEkHk'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=1RpBAY7zhyxcCJIa_xaVknXDFWJCZggFR'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=198Uv8UBoZUq3tXGyk8x8E_F4k2N0V4Dl'},
            {description: 'Lisboa', image:'https://drive.google.com/uc?id=1pKrysmFLQXNDSeYTNnyqKT_AT_UdZw1i'},
            {description: 'Porto', image:'https://drive.google.com/uc?id=18QltN7BkP6KTGqbqDqv6hjlDdxehRZKs'},
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
            <img src='https://drive.google.com/uc?id=1fsD6tf-XtOEIiIKvHZ1p_fdx4Q0A46lD' alt='Isabel is photographing' className='hobby-photography'></img>
            <p>Below, you can see some of my favourites pictures taken by me during some of the trips I took with my family and friends:</p>
            <div className='hobbies-folder'>
                {albumsInformation.map((item) => (
                    <PhotoAlbum key={item.albumName} albumName={item.albumName} dialogTitle={item.dialogTitle} dialogImages={item.dialogImages} />
                ))}
            </div>
        </div>
    )
}