import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setNickname } from '../redux/NicknameReducer';

function getModalStyle() {
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
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        setOpen(false);
        // event.preventDefault();
    };

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Start A New Game</h2>
            <p id="simple-modal-description">
                What's your nickname?
            </p>
            <form onSubmit={handleClose} to="/game">
                <input type='text' onChange={(e) => dispatch(setNickname(e.target.value))} />
                <Link to="/game" style={{ textDecoration: 'none' }}><button type='submit'>Submit</button></Link>
            </form>

        </div>
    );

    return (
        <div>
            <button type="button" onClick={handleOpen}>
                Open Modal
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
