import React from 'react';
import './PhotoAlbum.scss';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface IPhotoAlbum {
    albumName:string,
    dialogImages:ImageInformation[]
}

export interface ImageInformation {
    description:string,
    image:string,
    rotation?: number
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

export const PhotoAlbum = (props: IPhotoAlbum) => {   
    const [open, setOpen] = React.useState(false);
    const [photoIndex, setPhotoIndex] = React.useState(0);

    const handleClickOpen = (index = 0) => {
      setPhotoIndex(index);
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
    const handleClickPrevious = () => {
      setPhotoIndex((index) => index - 1);
    };
    const handleClickNext = () => {
        setPhotoIndex((index) => index + 1);
    };

    return (
        <div className="photos">
            <div className="film-strip-heading">
                <div>
                    <span className="film-strip-index">{String(props.dialogImages.length).padStart(2, '0')} frames</span>
                    <h3>{props.albumName}</h3>
                </div>
                <span className="film-strip-hint">Scroll to explore</span>
            </div>
            <div className="film-strip" aria-label={`${props.albumName} photo strip`}>
                {props.dialogImages.map((image, index) => (
                    <Button
                        className="film-frame"
                        key={image.image}
                        onClick={() => handleClickOpen(index)}
                        aria-label={`Open ${props.albumName} photo ${index + 1}`}
                    >
                        <span className="film-frame-number">{String(index + 1).padStart(2, '0')}</span>
                        <span className="film-frame-photo">
                            <img className={`rotation-${image.rotation || 0}`} src={image.image} alt={image.description} />
                        </span>
                    </Button>
                ))}
            </div>
            <BootstrapDialog
                className='teste'
                onClose={handleClose}
                 open={open}
                 >
                 <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
                >
                <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <div className='content-dialog'>
                        <div className='photos-dialog'>
                            <img
                                src={props.dialogImages[photoIndex].image}
                                alt={props.dialogImages[photoIndex].description}
                                className={`photo-dialog rotation-${props.dialogImages[photoIndex].rotation || 0}`}
                            />
                        </div>
                    </div>
                    <div className='buttons-dialog'>
                        <Button className="photo-navigation-button" variant="contained" disabled={photoIndex === 0} onClick={handleClickPrevious}>Previous</Button>
                        <Button className="photo-navigation-button" variant="contained" disabled={photoIndex ===  props.dialogImages.length - 1} onClick={handleClickNext}>Next</Button>
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )

}
