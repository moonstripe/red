require('dotenv')
    .config();
const socketio = require('socket.io');
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

const PORT = process.env.PORT || 8080;

const io = socketio(server, {
    cors: {
        origin: "https://kojinglick-aq2wgmt6ca-uc.a.run.app/"
    }
});
const { Deck } = require('./utils/deck.js');
const { isObject } = require('util');

app.get('/testBackend', async (req, res) => {
    res.send(`hello world, port: ${process.env.PORT}`)
})

//game logic
// TODO: add deck and discard fucntionality
let rooms = {}
const playerLimit = 3;

const dealHand = (deck) => {
    let hand = [];
    for (let i = 0; i < 4; i++) {
        let card = deck.deal();
        hand.push(card);
    }
    return hand
}

const dealCard = (deck) => {
    return deck.deal()
}


io.on('connection', socket => {
    //  Lobby Relevant
    socket.on('clientToServerJoinLobby', ([nname, id]) => {
        console.log(`lobby id: ${id}, new player id: ${socket.id}, nn: ${nname}`);

        // join room
        if (!rooms[id]) {

            // SUCCESS no room with same id
            console.log('lobby creation')

            // initialize room
            rooms[id] = {
                d: new Deck().reset().shuffle(),
                t: 0,
                p: [{
                    n: nname,
                    s: socket.id,
                }],
                nC: {},
                g: []
            }

            // set deck and hand

            console.log(`newplayer: ${JSON.stringify(rooms[id].p[0])}`)

            socket.join(id);
            io.to(id).emit('serverToClientLobbyJoinSuccess', rooms[id])

        } else {

            // room with same id

            if (rooms[id].p.length > playerLimit) {

                // FAIL room with same id has 2 people
                console.log('lobby full')
                socket.emit('serverToClientLobbyJoinFailure')

            } else {

                // SUCCESS room with same id has less than 2 people
                console.log('lobby addition')
                rooms[id].p.push({
                    n: nname,
                    s: socket.id,
                })

                console.log(`addplayer: ${JSON.stringify(rooms[id].p[rooms[id].p.length - 1])}`)
                socket.join(id);
                io.to(id).emit('serverToClientLobbyJoinSuccess', rooms[id])

                if (rooms[id].p.length === playerLimit) {
                    io.to(id).emit('serverToClientLobbyMax')
                }

            }

        }
    })

    socket.on('clientToServerLobbyReady', id => {
        console.log(`ready: ${rooms[id].p.length}`)

        io.to(id).emit('serverToClientGameStart')
    })

    // Game Relevant

    socket.on('clientToServerWelcome', ([nname, id]) => {

        // room specific way
        console.log(`new: ${JSON.stringify(rooms[id].p)}, socket: ${socket.id}`)



        if (Object.keys(rooms[id].nC).length === 0) {
            rooms[id].d = new Deck().reset().shuffle();

            console.log(`deck initialized, deck length: ${rooms[id].d.deck.length}`)

            for (let i = 0; i < rooms[id].p.length; i++) {
                rooms[id].p[i].h = dealHand(rooms[id].d);
            }

            rooms[id].nC = dealCard(rooms[id].d)
            console.log(`card dealt, deck length: ${rooms[id].d.deck.length}, player hands: ${JSON.stringify(rooms[id].p)}`)
        } else {
            console.log('players initialized')
        }

        console.log(`A player connected in: ${rooms[id]} \n\tname: ${nname} \n\tid: ${socket.id}`);
        console.log('Number of players now:', '\n\tcount:', rooms[id].p.length);

        // establishes current gamestate (deck, discard) for all connected clients

        socket.emit('serverToClientId', socket.id)
        io.to(id).emit('serverToClientPlayers', rooms[id].p);
        io.to(id).emit('serverToClientGameState', [rooms[id].nC, rooms[id].g, rooms[id].p[rooms[id].t % rooms[id].p.length].s])
    });

    // implement gameId handshake for each event

    socket.on('clientToServerTurnSwap', ([card, i, newCard, gameId]) => {

        const relevantGame = rooms[gameId]



        const relevantPlayer = relevantGame.p.filter(p => p.s === socket.id)[0]

        if (i >= 0) {
            relevantPlayer.h[i] = newCard;

            relevantGame.g.push(card)
        } else {
            relevantGame.g.push(card)
        }

        relevantGame.nC = dealCard(rooms[gameId].d);

        // console.log(`deck: ${deck.deck.length}, discard: ${JSON.stringify(discard)}`)

        if (relevantGame.tC > 0) {
            console.log(relevantGame.tC)
            relevantGame.tC--;
            relevantGame.t++;
        } else if (relevantGame.tC === 0) {
            console.log('game over')
            // send end game trigger
            let scoreboard = {};

            let winner = ''

            for (let i = 0; i < relevantGame.p.length; i++) {
                const player = relevantGame.p[i];

                let score = 0

                for (let j = 0; j < player.h.length; j++) {
                    const card = player.h[j];
                    score = score + card.intVal
                    if (!winner) {
                        winner = player.s
                    } else {
                        if (scoreboard[winner] > score) {
                            winner = player.s
                        }
                    }
                    score = score + card.intVal
                }

                player.v = score

                scoreboard[player.s] = score
            }

            io.to(gameId).emit('serverToClientPlayers', relevantGame.p)
            io.to(gameId).emit('serverToClientEndGame', ([scoreboard]))
        } else {
            console.log('hello')
            relevantGame.t++;
        }


        io.to(gameId).emit('serverToClientPlayers', relevantGame.p)
        io.to(gameId).emit('serverToClientGameState', [relevantGame.nC, relevantGame.g, relevantGame.p[relevantGame.t % relevantGame.p.length].s])



    })

    socket.on('clientToServerSpecialSwap', ([ditchedCard, desiredCard, gameId]) => {
        console.log(`special swap: ${ditchedCard} ${desiredCard} ${gameId}`)
        const relevantGame = rooms[gameId]

        console.log(JSON.stringify(ditchedCard))
        for (let i = 0; i < relevantGame.p.length; i++) {
            for (let j = 0; j < relevantGame.p[i].h.length; j++) {
                if (JSON.stringify(relevantGame.p[i].h[j]) === JSON.stringify(ditchedCard)) {

                    // desiredCard placed into ditcher's hand
                    relevantGame.p[i].h[j] = desiredCard;

                } else if (JSON.stringify(relevantGame.p[i].h[j]) === JSON.stringify(desiredCard)) {
                    // ditchedCard placed into desired's hand
                    relevantGame.p[i].h[j] = ditchedCard;
                }

            }

        }


        io.to(gameId).emit('serverToClientPlayers', relevantGame.p)

    })

    socket.on('clientToServerCardSlapSuccess', ([i, gameId]) => {
        const relevantGame = rooms[gameId]
        const relevantPlayer = relevantGame.p.filter(p => p.s === socket.id)[0]

        relevantGame.g.push(relevantPlayer.h[i])

        relevantPlayer.h[i] = 0;

        // console.log(`players: ${JSON.stringify(players)}`)

        io.to(gameId).emit('serverToClientPlayers', relevantGame.p)
        io.to(gameId).emit('serverToClientGameState', [relevantGame.nC, relevantGame.g, relevantGame.p[relevantGame.t % relevantGame.p.length].s])

    })

    socket.on('clientToServerRedCalled', ([gameId]) => {
        console.log(socket.id, 'called Red')
        io.to(gameId).emit('serverToClientRedCalled')
        rooms[gameId].tC = rooms[gameId].p.length - 1
    })

    socket.on('disconnect', function () {

        let gameId = '';
        let departureSocket = socket.id;

        for (const key in rooms) {
            gameId = key
            let hasPlayerSocket = rooms[gameId].p.some(player => player.s === departureSocket);

            if (hasPlayerSocket) {
                let turnPlayer = rooms[gameId].p[rooms[gameId].t % rooms[gameId].p.length]

                let newTurnNum = rooms[gameId].p.indexOf(turnPlayer);

                console.log(`turnPlayer: ${JSON.stringify(turnPlayer)}, turnNum: ${rooms[gameId].t}, length of players: ${rooms[gameId].p.length}`)

                rooms[gameId].p = rooms[gameId].p.filter(player => player.s != departureSocket);

                if (rooms[gameId].p.length === 0) {
                    delete rooms[gameId]
                    console.log(rooms)
                } else {
                    if (turnPlayer.s === socket.id) {

                        // code is returning a client side error, probably because the turn number is out of range as an index

                        rooms[gameId].t = newTurnNum
                        io.to(gameId).emit('serverToClientPlayers', rooms[gameId].p)
                        console.log(`new length of players: ${rooms[gameId].p.length}, new turnNum: ${rooms[gameId].t}, sending turn: ${rooms[gameId].p[rooms[gameId].t].s}`)
                        io.to(gameId).emit('serverToClientGameState', [rooms[gameId].nC, rooms[gameId].g, rooms[gameId].p[rooms[gameId].t].s])
                        console.log(`new turnNum: ${rooms[gameId].t}`)
                    } else {
                        rooms[gameId].t = newTurnNum
                        io.to(gameId).emit('serverToClientPlayers', rooms[gameId].p)
                        console.log(`new length of players: ${rooms[gameId].p.length}`)
                        io.to(gameId).emit('serverToClientGameState', [rooms[gameId].nC, rooms[gameId].g, rooms[gameId].p[rooms[gameId].t].s])
                        console.log(`new turnNum: ${rooms[gameId].t}`)
                    }


                    console.log('Number of players now:', '\n\tcount:', rooms[gameId].p.length);
                }

            }

        }
        console.log(`All players disconnected: ${gameId}`);
    });


});

if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(__dirname, "client/build")));
    app.use(express.static("public"));

    // app.use((req, res, next) => {
    //     res.sendFile(path.join(__dirname, "client/build", "index.html"));
    // });
}

// Routing option

// app.use(express.urlencoded({extended: true}));
// app.use(express.json());
// app.use(routes);

server.listen(PORT, () => {
    console.log(`Server started listening on PORT ${PORT}`)
})
