import React from 'react';
import './PhotoAlbum.scss';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFolder} from '@fortawesome/free-solid-svg-icons';

export interface IPhotoAlbum {
    albumName:string,
    dialogTitle:string,
    dialogImages:ImageInformation[]
}

export interface ImageInformation {
    description:string,
    image:string
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

    const handleClickOpen = () => {
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
            <Button variant="outlined" onClick={handleClickOpen}>
                <div className='photos-album-box'>
                    <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                    <p>{props.albumName}</p>
                </div>
            </Button>
            <BootstrapDialog
                className='teste'
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    {props.dialogTitle}
                </DialogTitle>
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
                        <p>{props.dialogImages[photoIndex].description}</p>
                        <div className='photos-dialog'>
                            <img src={props.dialogImages[photoIndex].image} alt={props.dialogImages[photoIndex].description} className='photo-dialog' />
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
