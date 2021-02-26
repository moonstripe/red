import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { PlayingCard } from "./Card";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, Modal } from '@material-ui/core';

import io from 'socket.io-client';
const socket = io();

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
    root: {
        flexGrow: 1,
    },
    defaultHand: {
        padding: theme.spacing(2),
        minHeight: "calc((100vh-30)/2)"
    },
    myHand: {
        padding: theme.spacing(2),
        minHeight: "calc((100vh-30)/2)",
        backgroundColor: '#90EE90'
    },
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export const Game = (props) => {
    const classes = useStyles();
    const nickname = useSelector(state => state.nickname.nickname)

    const [players, setPlayers] = useState([]);
    const [nextCard, setNextCard] = useState({});
    const [id, setId] = useState('');

    // Modal Stuff
    const [open, setOpen] = useState(false);
    const [modalStyle] = useState(getModalStyle);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (event) => {
        setOpen(false);
    };

    const handleCardSwap = (card, i, replacement) => {
        console.log(`${card.visVal+card.suit}, ${i}, ${replacement.visVal+replacement.suit}`)

        socket.emit('clientToServerCardSwap', [card, i, replacement])
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">What card do you want to swap with?</h2>
            {
                    players.map(player => (
                        <Grid item xs={12} sm={12}>
                            <Paper elevation={0} className={player.s === id ? classes.myHand : classes.defaultHand}>
                                <h4>{player.s === id ? player.n : null}</h4>
                                <Grid container spacing={3}>
                                    {/* Hand Map */}
                                    {
                                        player.s === id
                                            ? player.h.map((card, i) => (
                                                <Grid item xs={6} sm={6}>
                                                    <PlayingCard onClick={() => {handleCardSwap(card, i, nextCard)}} image={`cards/${card.visVal}${card.suit}.png`} />
                                                </Grid>
                                            ))
                                            : null
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    )
                    )
                }
        </div>
    );

    useEffect(() => {
        socket.emit('clientToServerWelcome', nickname);

        socket.on('serverToClientPlayers', (players) => {

            // console.log(players[0].h);
            setPlayers(players);

        });

        socket.on('serverToClientId', (id) => {

            // console.log(id);
            setId(id);

        });

        // TODO: add deck and discard functionality
        socket.on('serverToClientGameState', ([nextCard]) => {
            setNextCard(nextCard)

            // console.log('client:', nextCard);
        })

        socket.on('wee', () => {

            console.log('wee');
        })

        return function () {
            socket.off('serverToClientPlayers');
            socket.off('wee');
            socket.off('serverToClientId');
        }
    }, [])

    return (
        <div className={classes.root}>
            <h1>Game Screen</h1>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>
            
            <Grid container spacing={0}>
                {/* Deck/Garbage */}
                <Grid item xs={2}>
                    <Paper elevation={0} className={classes.defaultHand}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant='h6'>Next Card</Typography>
                                <PlayingCard onClick={() => handleOpen()} image={`cards/${nextCard.visVal}${nextCard.suit}.png`}/>
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Typography variant='h6'>Discard</Typography>
                                <PlayingCard image={`cards/red_back.png`}/>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Player Map */}
                {
                    players.map(player => (
                        <Grid item xs={5} sm={5}>
                            <Paper elevation={0} className={player.s === id ? classes.myHand : classes.defaultHand}>
                                <h4>{player.n}</h4>
                                <Grid container spacing={3}>
                                    {/* Hand Map */}
                                    {
                                        player.s === id
                                            ? player.h.map((card, i) => (
                                                <Grid item xs={6} sm={6}>
                                                    <PlayingCard onClick={() => {console.log(`${card.visVal+card.suit}, ${i}`)}} image={`cards/${card.visVal}${card.suit}.png`} />
                                                </Grid>
                                            ))
                                            : player.h.map(card => (
                                                <Grid item xs={6} sm={6}>
                                                    <PlayingCard image={`cards/${card.visVal}${card.suit}.png`} />
                                                </Grid>
                                            ))
                                    }
                                </Grid>
                            </Paper>
                        </Grid>
                    )
                    )
                }


            </Grid>
            <button
                onClick={() => {
                    socket.emit('clientToServerBoop');
                    console.log('boop click');
                }}
            >boop</button>

        </div>
    )
}

