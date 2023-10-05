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

interface IProps {}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

export const PhotoAlbum = (props: IProps) => {   
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
        <div className="photos">
            <Button variant="outlined" onClick={handleClickOpen}>
                <div className='photos-album-box'>
                    <FontAwesomeIcon icon={faFolder}  className="icon-style"/>
                    <p>Malta,2023</p>
                </div>
            </Button>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Malta, September 2023
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
                    <p>Sliema, Malta</p>
                    <div className='photos-dialog'>
                        <img src='https://drive.google.com/uc?id=15EX34FKkK7_AuZeqehqnD4C6o14zpHKl' className='photo-dialog'></img>
                    </div>
                    <div className='buttons-dialog'>
                        <Button variant="contained">Previous</Button>
                        <Button variant="contained">Next</Button>
                    </div>
                </DialogContent>
            </BootstrapDialog>
        </div>
    )

}