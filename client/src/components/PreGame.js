import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setNickname } from '../redux/NicknameReducer';


const getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export const PreGame = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = useState(getModalStyle);
    const [open, setOpen] = useState(true);
    const [roomId, setRoomId] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMakeRoom = () => {
        const newName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        history.push(`/lobby/${newName}`)
    }

    const handleJoinRoom = () => {
        history.push(`/lobby/${roomId}`)
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Welcome To Red</h2>
            <form onSubmit={handleClose} to="/game">
                <p id="simple-modal-description">What's your nickname?</p>
                <input type='text' onChange={(e) => dispatch(setNickname(e.target.value))} />
                <button type='submit' onClick={() => { handleMakeRoom() }}>New Game</button>
                <p id="simple-modal-description2">Name of joined game?</p>
                <input type='text' onChange={(e) => setRoomId(e.target.value)} />
                <button type='submit' onClick={() => { handleJoinRoom() }}>Join Game</button>
            </form>

        </div>
    );

    return (
        <div sx={{marginTop: 'auto'}}>
            <button type="button" onClick={handleOpen}>
                Set your nickname to join the game!
            </button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
        </div>
    );
}
