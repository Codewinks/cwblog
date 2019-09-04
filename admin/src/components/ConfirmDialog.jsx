import React from "react";

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const ConfirmDialog = (props) => {
    const confirm = () => {
        props.callback();
        props.onClose();
    }

    return (
        <>           
           <Dialog
                open={Boolean(props.open)}
                onClose={props.onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.content}
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={props.onClose} color="primary" autoFocus>
                    Cancel
                </Button>
                <Button onClick={confirm} color="secondary">
                    {props.action}
                </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ConfirmDialog;