import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { setNickname } from '../redux/NicknameReducer';
import { Box, Button, Grid, TextField } from '@mui/material';

export const PreGame = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [roomId, setRoomId] = useState('');
    const [protoname, setProtoname] = useState('')
    const [isTouched, setIsTouched] = useState(false);

    const handleNickname = (e) => {

        console.log(e.target.value.length)
        if (e.target.value.length > 0) {
            setProtoname(e.target.value)
            setIsTouched(true)
        } else {
            setIsTouched(false)
        }
    }

    const handleLobbyCode = (e) => {
        setRoomId(e.target.value)
    }

    // dispatch(setNickname(protoname))

    const handleMakeRoom = () => {
        dispatch(setNickname(protoname))
        const newName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        history.push(`/lobby/${newName}`)
    }

    const handleJoinRoom = () => {
        dispatch(setNickname(protoname))
        history.push(`/lobby/${roomId}`)
    }


    return (
        <Grid container>
            <Grid item xs={4.5}></Grid>
            <Grid item xs>
                <Box sx={{ px: 2, py: 10 }}>
                    <Box component='img' sx={{ width: '100%' }} alt="red logo featuring cards that are used in the fun and interesting family game called red." src='/redlogo.png' />
                    <TextField color='warning' label="Enter your nickname" variant="outlined" sx={{ mt: 2, width: '100%', color: 'brown' }} onChange={(e) => handleNickname(e)} />
                    {
                        isTouched
                            ? <Button variant='outlined' sx={{ mt: 2, width: '100%' }} onClick={handleMakeRoom}>New Game</Button>
                            : <Button disabled variant='outlined' sx={{ mt: 2, width: '100%' }}>New Game</Button>
                    }
                    {
                        isTouched
                            ? (
                                <Box>
                                    <TextField color='warning' label="Enter your lobby code" variant="outlined" sx={{ mt: 2, width: '100%', color: 'brown' }} onChange={(e) => handleLobbyCode(e)} />
                                    {
                                        roomId.length > 0
                                            ? <Button variant='outlined' sx={{ mt: 2, width: '100%' }} onClick={handleJoinRoom}>Join Game</Button>
                                            : <Button disabled variant='outlined' sx={{ mt: 2, width: '100%' }}>Join Game</Button>
                                    }
                                </Box>
                            )
                            : null
                    }

                </Box>
            </Grid>
            <Grid item xs={4.5}></Grid>
        </Grid>
    );
}
