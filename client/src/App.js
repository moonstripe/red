import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { AppHead, WrappedGame, PreGame, WrappedLobby } from './components'
import { SocketContext } from './utils/SocketContext';

import { Box } from '@mui/material';

import { io } from 'socket.io-client';
const socket = io('localhost:3001');

function App() {

    return (
        <SocketContext.Provider value={socket}>
            <Router>
                <Box sx={{ display: 'flex', flexDirection: "column", height: '100vh' }}>
                    <AppHead />
                    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '90vh'}}>
                        <Route exact path="/" component={PreGame} />
                        <Route path='/lobby/:id' component={WrappedLobby} />
                        <Route path="/game/:gameId" component={WrappedGame} />
                    </Box>
                </Box>
            </Router>
        </SocketContext.Provider>
    );
}

export default App;
