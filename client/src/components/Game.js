import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { PlayingCard } from "./Card";

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography } from '@material-ui/core';

import io from 'socket.io-client';
const socket = io();

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
}));

export const Game = (props) => {
    const classes = useStyles();
    const nickname = useSelector(state => state.nickname.nickname)

    console.log('redux pls', nickname);

    const [players, setPlayers] = useState([]);
    const [id, setId] = useState('');

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
        socket.on('wee', () => {

            console.log('wee');
        })
        // TODO: add deck and discard functionality

        return function () {
            socket.off('serverToClientPlayers');
            socket.off('wee');
            socket.off('serverToClientId');
        }
    }, [])

    return (
        <div className={classes.root}>
            <h1>Game Screen</h1>
            <Grid container spacing={0}>
                {/* Deck/Garbage */}
                <Grid item xs={2}>
                    <Paper elevation={0} className={classes.defaultHand}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={12}>
                                <Typography variant='h6'>Next Card</Typography>
                                <PlayingCard />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <Typography variant='h6'>Discard</Typography>
                                <PlayingCard />
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
                                            ? player.h.map(card => (
                                                <Grid item xs={6} sm={6}>
                                                    <PlayingCard image={`cards/${card.visVal}${card.suit}.png`} />
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

