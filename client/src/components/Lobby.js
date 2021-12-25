import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router';
import { SocketContext } from '../utils/SocketContext';

import { Box, Grid, Typography, List, ListItem, ListItemText, ListItemIcon, Button } from '@mui/material'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const Lobby = ({ socket }) => {
    const nickname = useSelector(state => state.nickname.nickname)
    const { id } = useParams();
    const history = useHistory();

    const [players, setPlayers] = useState([]);
    const [failure, setFailure] = useState(false);
    const [playable, setPlayable] = useState(false);
    const [disable, setDisable] = useState(false)

    const handlePlay = () => {
        socket.emit('clientToServerLobbyPlay', id)
    }

    const handleReady = () => {
        console.log('ready')
        setDisable(true)
        socket.emit('clientToServerLobbyReady', id)
    }

    useEffect(() => {
        let ready = false;
        if (players.length > 1) {
            for (let i = 0; i < players.length; i++) {
                if (!!players[i].r) {
                    ready = true
                } else {
                    ready = false
                    break
                }
            }
        }
        setPlayable(ready)
    }, [players])

    useEffect(() => {
        socket.emit('clientToServerJoinLobby', [nickname, id]);

        socket.on('serverToClientLobbyJoinSuccess', room => {
            console.log(room)
            setPlayers([...room.p])
        })

        socket.on('serverToClientLobbyJoinFailure', () => {
            console.log('full lobby')
            setFailure(true);

        })

        socket.on('serverToClientPlayers', (players) => {
            console.log(players)
            setPlayers([...players]);
        });

        socket.on('serverToClientLobbyMax', () => {
            console.log('ready up')
        })

        socket.on('serverToClientGameStart', () => {
            history.push(`/game/${id}`)
        })

        return () => {
            socket.off('serverToClientLobbyJoinSuccess');
            socket.off('serverToClientLobbyJoinFailure');
            socket.off('serverToClientLobbyMax');
            socket.off('serverToClientGameStart');
        }

    }, [])

    return (
        <Box sx={{ mt: 3 }}>
            <Grid container>
                <Grid item xs={4.5}>

                </Grid>

                <Grid item xs>
                    <Box>
                        {
                            failure ? <p>full lobby :(</p> :
                                <Box sx={{ alignItems: 'center', my: 12 }}>
                                    <Typography variant='h4'>Lobby: <code sx={{borderRadius: "3px", borderStyle: "solid", borderWidth: '1px'}}>{id}</code></Typography>
                                    <List>
                                        {players.length > 0
                                            ? players.map((p, i) => (
                                                <ListItem key={i}>
                                                    <ListItemIcon>
                                                        {p.r ? <CheckBoxIcon/> : <CheckBoxOutlineBlankIcon onClick={handleReady}/> }
                                                    </ListItemIcon>
                                                    <ListItemText>
                                                        {p.n}
                                                    </ListItemText>
                                                </ListItem>
                                            )) : 'loading'
                                        }
                                        {players.length < 4
                                            ? [...Array(4 - players.length)].map((p, i) => (
                                                <ListItem key={i}><ListItemText>waiting for player...</ListItemText></ListItem>
                                            )) : null
                                        }
                                    </List>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            {
                                                disable ? <Button variant='filled' sx={{ backgroundColor: 'green', color: 'white', mt: 3, width: '100%' }} >Ready</Button> : <Button variant='outlined' sx={{ mt: 3, width: '100%' }} onClick={handleReady}>Ready</Button>
                                            }

                                        </Grid>
                                        <Grid item xs={6}>
                                            {
                                                playable ? (
                                                    <Button variant='outlined' sx={{ mt: 3, width: '100%' }} onClick={handlePlay}>Play</Button>
                                                ) : <Button disabled variant='outlined' sx={{ mt: 3, width: '100%' }}>Play</Button>
                                            }

                                        </Grid>
                                    </Grid>

                                </Box>

                        }
                    </Box>

                </Grid>
                <Grid item xs={4.5}>

                </Grid>
            </Grid>
        </Box >
    )
}

export const WrappedLobby = (props) => (
    <SocketContext.Consumer>
        {socket => <Lobby {...props} socket={socket} />}
    </SocketContext.Consumer>
)