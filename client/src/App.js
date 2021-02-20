import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppHead from './components/AppHead';
import { PreGame } from './components/PreGame'
import { Game } from './components/Game';

const renderGame = (props, nickname) => {
    return (
        <Game {...props} nickname={nickname}/>
    )
}

function App() {

    return (
        <Router>
            
            <AppHead/>
            <Route exact path="/" component={PreGame}/>
            <Route path="/game" render={renderGame}/>
            
        </Router>
    );
}

export default App;
