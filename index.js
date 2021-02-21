require('dotenv')
    .config();
const socketio = require('socket.io');
const express = require('express');

const app = express();
const server = require('http').createServer(app);

const PORT = process.env.PORT || 3001;

const io = socketio(server);
const { Deck } = require('./utils/deck.js');

//game logic
// TODO: add deck and discard fucntionality
let players = [];
let turn = '';
let arbnum = 0;
const deck = new Deck;
const discard = [];
deck.reset();
deck.shuffle();
console.log(deck.deck.length)

const dealHand = (deck) => {
    let hand = []
    for (let i = 0; i < 4; i++) {
        let card = deck.deal();
        hand.push(card);
    }
    return hand
}

const dealCard = (deck) => {
    return deck.deal()
}

const addPlayer = (players, nickname, socket) => {
    players.push({
        n: nickname,
        s: socket.id,
        h: dealHand(deck)
    });

    console.log('A player connected: ', nickname, '\n\tid:', socket.id);
    console.log('Number of players now:', '\n\tcount:', players.length)

    io.emit('serverToClientPlayers', players);

    return players
}

io.on('connection', socket => {

    socket.on('clientToServerWelcome', (nname) => {
        // Starts timer on first connection

        // establishes player array for all connected clients
        addPlayer(players, nname, socket);

        // establishes personal identity in connected client
        socket.emit('serverToClientId', socket.id);

        // establishes current gamestate (deck, discard) for all connected clients
        let nextCard = dealCard(deck)
        io.emit('serverToClientGameState', [nextCard])

        console.log(deck.deck.length)

    });

    //    Testing only:
    socket.on('clientToServerBoop', () => {
        console.log(socket.id + ': boop')
    })

    socket.on('disconnect', function () {


        console.log('A player disconnected');
        players = players.filter(el => el.s != socket.id);

        io.emit('serverToClientPlayers', players);
        console.log("A number of players now ", players.length);
    });


});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

// Routing option

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// app.use(routes);

server.listen(PORT, () => {
    console.log('Server started listening on PORT http://localhost:3001')
})
