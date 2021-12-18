import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { useParams } from 'react-router';
import { PlayingCard } from "./Card";

import { Paper, Grid, Typography, Modal, Box, Button, MenuItem, Select, InputLabel } from '@mui/material';
import { SocketContext } from '../utils/SocketContext';

const Game = ({ socket }) => {
    const nickname = useSelector(state => state.nickname.nickname);
    const { gameId } = useParams();

    const [turnOption, setTurnOption] = useState('');
    const [turnId, setTurnId] = useState('');
    const [players, setPlayers] = useState([]);
    const [nextCard, setNextCard] = useState({});
    const [discard, setDiscard] = useState([]);
    const [id, setId] = useState('');

    const [playerSelect, setPlayerSelect] = useState({})
    const [canLook, setCanLook] = useState(false)
    const [desiredCard, setDesiredCard] = useState(null)
    const [ditchedCard, setDitchedCard] = useState(null)
    const [canConfirm, setCanConfirm] = useState(false)

    const [redCalled, setRedCalled] = useState(false);
    const [scoreboard, setScoreboard] = useState({});
    const [endGame, setEndGame] = useState(false);

    // Modal Stuff
    const [open, setOpen] = useState(false);
    const handleOpen = (selection) => {
        // socket.to(gameId).emit('hello')
        setTurnOption(selection);
        setOpen(true);
    };
    const handleClose = (event) => {
        setTurnOption('');
        setOpen(false);
    };

    // Special Modal Stuff
    const [specialOpen, setSpecialOpen] = useState(false);
    // const handleSpecialOpen = () => {
    //     setSpecialOpen(true);
    // };
    const handleSpecialClose = () => {
        setSpecialOpen(false);
    };

    // Endgame Modal Stuff
    const [endGameOpen, setEndGameOpen] = useState(false)
    const handleEndGameClose = () => {
        setEndGameOpen(false)
    }

    const handleCardSwap = (card, i, newCard) => {
        console.log(`${card.visVal + card.suit}, ${i}, ${newCard.visVal + newCard.suit}`)
        socket.emit('clientToServerTurnSwap', [card, i, newCard, gameId])
        handleClose();
    }

    const handleRed = () => {
        socket.emit('clientToServerRedCalled', [gameId])
        console.log(id, 'called Red')
    }

    const handleCardSlap = (card, i) => {
        // console.log(`card: ${JSON.stringify(card)}, i: ${i}, slappable: ${discard.length === 0 ? false : card.visVal === discard[discard.length - 1].visVal}`)
        if (discard.length > 0) {
            if (card.visVal === discard[discard.length - 1].visVal) {
                console.log('slapping')
                socket.emit('clientToServerCardSlapSuccess', [i, gameId])
            } else {
                console.log('slap fail')
                // socket.emit('clientToServerCardSlapFailure')
            }
        } else {
            console.log('cant slap yet')
            // socket.emit('clientToServerCardSlapFailure')
        }
    }

    const handleCardLook = (event, card) => {
        console.log(event.target)
        console.log(card)
        setCanLook(false)
        setInterval(() => {
            event.target.src = `/cards/red_back.png`
        }, 5000)

        event.target.src = `/cards/${card.visVal}${card.suit}.png`
    }

    const handleSpecialPick = (event, card) => {
        if (nextCard.intVal === 9) {
            setDesiredCard(card)

        } else if (nextCard.intVal === 10) {
            setDesiredCard(card)
            if (canLook) {
                setCanLook(false)
                setInterval(() => {
                    event.target.src = `/cards/red_back.png`
                }, 5000)

                event.target.src = `/cards/${card.visVal}${card.suit}.png`
            }

        }
    }

    const handleConfirmSpecial = (event, card) => {


        if (desiredCard !== null) {
            setDitchedCard(card)
            console.log('handleConfirmSpecial,', event, card, desiredCard)
        }
    }

    const handleSpecialSwap = (event) => {
        setSpecialOpen(false)
        socket.emit('clientToServerSpecialSwap', [ditchedCard, desiredCard, gameId])
    }

    const handlePlayerSelect = (event) => {
        console.log(event.target.value)
        setDesiredCard(null)
        setDitchedCard(null)
        setPlayerSelect(event.target.value);
    }

    const specialBody = (
        <React.Fragment>
            <Modal
                hideBackdrop
                open={specialOpen}
                onClose={handleSpecialClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >

                {/* Rule */}
                {
                    nextCard.intVal === 7 ? (
                        // 7 rule
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            pt: 2,
                            px: 4,
                            pb: 3,
                        }}>
                            <h2 id="child-modal-title">You pulled a {nextCard.visVal}</h2>
                            <Box>
                                {
                                    players.map(player => (
                                        player.s === id ?
                                            <Paper elevation={0} sx={{ padding: 2, backgroundColor: '#28A5A5' }}>
                                                <Typography variant='h4' sx={{ color: 'white' }}>{player.s === id ? player.n : null}</Typography>
                                                <Grid container spacing={3} sx={{ width: '100%' }}>
                                                    {/* Hand Map */}
                                                    {
                                                        player.s === id
                                                            ? player.h.map((card, i) => (
                                                                <Grid item xs={6} sm={6}>
                                                                    {
                                                                        card === 0
                                                                            ? <PlayingCard />
                                                                            // possible place to send feed info to server and then to other clients
                                                                            : <PlayingCard onClick={canLook ? (event) => handleCardLook(event, card) : null} image={i > 1 ? `/cards/${card.visVal}${card.suit}.png` : `/cards/red_back.png`} />
                                                                    }
                                                                </Grid>
                                                            ))
                                                            : null
                                                    }

                                                </Grid>
                                            </Paper>
                                            : null
                                    )
                                    )
                                }
                            </Box>
                            <Button onClick={handleSpecialClose}>Skip</Button>
                        </Box>
                    ) : nextCard.intVal === 8 ? (
                        // 8 rule
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            pt: 2,
                            px: 4,
                            pb: 3,
                        }}>
                            <h2 id="child-modal-title">You pulled an {nextCard.visVal}</h2>
                            <InputLabel>Select a Player's Hand</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={playerSelect}
                                label="Player"
                                onChange={handlePlayerSelect}
                            >
                                {players.filter(player => player.s !== id).map((player) => (
                                    <MenuItem value={player.s}>{player.n}</MenuItem>
                                ))}
                            </Select>
                            {
                                playerSelect ? (
                                    <Box>
                                        {
                                            players.map(player => (
                                                player.s === playerSelect ?
                                                    <Paper elevation={0} sx={{ padding: 2 }}>
                                                        <h4>{player.s === id ? player.n : null}</h4>
                                                        <Grid container spacing={3} sx={{ width: '100%' }}>
                                                            {/* Hand Map */}
                                                            {
                                                                player.s === playerSelect
                                                                    ? player.h.map((card, i) => (
                                                                        <Grid item xs={6} sm={6}>
                                                                            {
                                                                                card === 0
                                                                                    ? <PlayingCard />
                                                                                    // possible place to send feed info to server and then to other clients
                                                                                    : <PlayingCard onClick={canLook ? (event) => handleCardLook(event, card) : null} image={`/cards/red_back.png`} />
                                                                            }
                                                                        </Grid>
                                                                    ))
                                                                    : null
                                                            }

                                                        </Grid>
                                                    </Paper>
                                                    : null
                                            )
                                            )
                                        }
                                    </Box>
                                ) : null
                            }
                            <Button onClick={handleSpecialClose}>Skip</Button>
                        </Box>
                    ) : nextCard.intVal === 9 ? (
                        // 9 rule
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            pt: 2,
                            px: 4,
                            pb: 3,
                        }}>
                            <h2 id="child-modal-title">You pulled a {nextCard.visVal}</h2>
                            <p id="child-modal-description">
                                You can select a player to switch with:
                            </p>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={playerSelect}
                                label="Player"
                                onChange={handlePlayerSelect}
                            >
                                {players.filter(player => player.s !== id).map((player) => (
                                    <MenuItem value={player.s}>{player.n}</MenuItem>
                                ))}
                            </Select>
                            <Box>
                                <Grid container>
                                    <Grid item xs>
                                        {
                                            players.map(player => (
                                                player.s === playerSelect ?
                                                    <Paper elevation={0} sx={{ padding: 2 }}>
                                                        <h4>{player.s === playerSelect ? player.n : null}</h4>
                                                        <Grid container spacing={3} sx={{ width: '100%' }}>
                                                            {/* Hand Map */}
                                                            {
                                                                player.s === playerSelect
                                                                    ? player.h.map((card, i) => (
                                                                        <Grid item xs={6} sm={6}>
                                                                            {
                                                                                card === 0
                                                                                    ? <PlayingCard />
                                                                                    // possible place to send feed info to server and then to other clients
                                                                                    : card === desiredCard ? <PlayingCard selected onClick={(event) => handleSpecialPick(event, card)} image={`/cards/red_back.png`} /> : <PlayingCard onClick={(event) => handleSpecialPick(event, card)} image={`/cards/red_back.png`} />
                                                                            }
                                                                        </Grid>
                                                                    ))
                                                                    : null
                                                            }

                                                        </Grid>
                                                    </Paper>
                                                    : null
                                            )
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs>
                                        {
                                            desiredCard ? players.map(player => (
                                                player.s === id ?
                                                    <Paper elevation={0} sx={{ padding: 2, backgroundColor: '#28A5A5' }}>
                                                        <h4>{player.s === id ? player.n : null}</h4>
                                                        <Grid container spacing={3} sx={{ width: '100%' }}>
                                                            {/* Hand Map */}
                                                            {
                                                                player.s === id
                                                                    ? player.h.map((card, i) => (
                                                                        <Grid item xs={6} sm={6}>
                                                                            {
                                                                                card === 0
                                                                                    ? <PlayingCard />
                                                                                    // possible place to send feed info to server and then to other clients
                                                                                    : card === ditchedCard ? <PlayingCard selected onClick={(event) => handleConfirmSpecial(event, card)} image={`/cards/red_back.png`} /> : <PlayingCard onClick={(event) => handleConfirmSpecial(event, card)} image={`/cards/red_back.png`} />
                                                                            }
                                                                        </Grid>
                                                                    ))
                                                                    : null
                                                            }

                                                        </Grid>
                                                    </Paper>
                                                    : null
                                            )
                                            ) : null
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                            <Button onClick={handleSpecialClose}>Skip</Button>
                            {
                                canConfirm ? <Button onClick={() => handleSpecialSwap()}>Swap</Button> : <Button disabled>Swap</Button>
                            }
                        </Box>
                    ) : nextCard.intVal === 10 ? (
                        // 10 rule
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            border: '2px solid #000',
                            boxShadow: 24,
                            pt: 2,
                            px: 4,
                            pb: 3,
                        }}>
                            <h2 id="child-modal-title">You pulled a {nextCard.visVal}</h2>
                            <p id="child-modal-description">
                                You can select a player to switch with:
                            </p>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={playerSelect}
                                label="Player"
                                onChange={handlePlayerSelect}
                            >
                                {players.filter(player => player.s !== id).map((player) => (
                                    <MenuItem value={player.s}>{player.n}</MenuItem>
                                ))}
                            </Select>
                            <Box>
                                <Grid container>
                                    <Grid item xs>
                                        {
                                            players.map(player => (
                                                player.s === playerSelect ?
                                                    <Paper elevation={0} sx={{ padding: 2 }}>
                                                        <h4>{player.s === playerSelect ? player.n : null}</h4>
                                                        <Grid container spacing={3} sx={{ width: '100%' }}>
                                                            {/* Hand Map */}
                                                            {
                                                                player.s === playerSelect
                                                                    ? player.h.map((card, i) => (
                                                                        <Grid item xs={6} sm={6}>
                                                                            {
                                                                                card === 0
                                                                                    ? <PlayingCard />
                                                                                    // possible place to send feed info to server and then to other clients
                                                                                    : card === desiredCard ? <PlayingCard selected onClick={(event) => handleSpecialPick(event, card)} image={`/cards/red_back.png`} /> : <PlayingCard onClick={(event) => handleSpecialPick(event, card)} image={`/cards/red_back.png`} />
                                                                            }
                                                                        </Grid>
                                                                    ))
                                                                    : null
                                                            }

                                                        </Grid>
                                                    </Paper>
                                                    : null
                                            )
                                            )
                                        }
                                    </Grid>
                                    <Grid item xs>
                                        {
                                            desiredCard ? players.map(player => (
                                                player.s === id ?
                                                    <Paper elevation={0} sx={{ padding: 2, backgroundColor: '#28A5A5' }}>
                                                        <h4>{player.s === id ? player.n : null}</h4>
                                                        <Grid container spacing={3} sx={{ width: '100%' }}>
                                                            {/* Hand Map */}
                                                            {
                                                                player.s === id
                                                                    ? player.h.map((card, i) => (
                                                                        <Grid item xs={6} sm={6}>
                                                                            {
                                                                                card === 0
                                                                                    ? <PlayingCard />
                                                                                    // possible place to send feed info to server and then to other clients
                                                                                    : card === ditchedCard ? <PlayingCard selected onClick={(event) => handleConfirmSpecial(event, card)} image={`/cards/red_back.png`} /> : <PlayingCard onClick={(event) => handleConfirmSpecial(event, card)} image={`/cards/red_back.png`} />
                                                                            }
                                                                        </Grid>
                                                                    ))
                                                                    : null
                                                            }

                                                        </Grid>
                                                    </Paper>
                                                    : null
                                            )
                                            ) : null
                                        }
                                    </Grid>
                                </Grid>
                            </Box>
                            <Button onClick={handleSpecialClose}>Skip</Button>
                            {
                                canConfirm ? <Button onClick={() => handleSpecialSwap()}>Swap</Button> : <Button disabled>Swap</Button>
                            }
                        </Box>
                    ) : null
                }


            </Modal>
        </React.Fragment>
    )

    const body = (
        <Box sx={{
            maxWidth: '25vw',
            backgroundColor: 'white',
            position: 'absolute',
            left: `${33}%`,
            top: `${33}%`,
            transform: `translate(-${33}%, -${33}%)`,
        }}>
            <Typography variant='h4' id="simple-modal-title" sx={{ m: 2 }}>What card do you want to swap with?</Typography>
            {
                players.map(player => (
                    player.s === id ?
                        <Paper elevation={0} sx={{ padding: 2, backgroundColor: '#28A5A5' }}>
                            <h4>{player.s === id ? player.n : null}</h4>
                            <Grid container spacing={3} sx={{ width: '100%' }}>
                                {/* Hand Map */}
                                {
                                    player.s === id
                                        ? player.h.map((card, i) => (
                                            <Grid item xs={6} sm={6}>
                                                {
                                                    card === 0
                                                        ? <PlayingCard />
                                                        // possible place to send feed info to server and then to other clients
                                                        : <PlayingCard onClick={() => { turnOption === 'nextCard' ? handleCardSwap(card, i, nextCard) : handleCardSwap(card, i, discard[discard.length - 1]) }} image={`/cards/${card.visVal}${card.suit}.png`} />
                                                }
                                            </Grid>
                                        ))
                                        : null
                                }

                            </Grid>
                        </Paper>
                        : null
                )
                )
            }
            {specialBody}
        </Box>
    );

    const endGameBody = (
        <Box sx={{
            maxWidth: '25vw',
            backgroundColor: 'white',
            position: 'absolute',
            left: `${33}%`,
            top: `${33}%`,
            transform: `translate(-${33}%, -${33}%)`,
            p: 1
        }}>
            <Typography variant='h2'> Game Over </Typography>
            {
                players.map(p => (
                    <Box>
                        <Typography variant='p'>{p.n} - {p.v}</Typography>
                    </Box>
                ))
            }
        </Box>
    );

    // special card Rule
    useEffect(() => {
        console.log('top', nextCard.intVal)
        switch (nextCard.intVal) {
            case 7:
                setDesiredCard(null)
                setCanLook(true)
                setSpecialOpen(true)
                break;
            case 8:
                setDesiredCard(null)
                setCanLook(true)
                setSpecialOpen(true)
                break;
            case 9:
                setDesiredCard(null)
                setSpecialOpen(true)
                break;
            case 10:
                setDesiredCard(null)
                setCanLook(true)
                setSpecialOpen(true)
                break;
            default:
                setDesiredCard(null)
                setCanLook(false)
                setSpecialOpen(false)
        }
    }, [nextCard.intVal])

    // 9 and 10 rule 
    useEffect(() => {
        desiredCard && ditchedCard ? setCanConfirm(true) : setCanConfirm(false)
    }, [desiredCard, ditchedCard])

    useEffect(() => {

        socket.emit('clientToServerWelcome', [nickname, gameId]);

        socket.on('serverToClientPlayers', (players) => {
            // setSpecialOpen(false)
            setPlayers([...players]);
        });

        socket.on('serverToClientId', (id) => {
            setId(id);
        });

        // TODO: add deck and discard functionality
        socket.on('serverToClientGameState', ([nextCard, discard, turn]) => {
            setTurnId('')
            setTurnId(turn)
            setNextCard(nextCard)
            setDiscard([...discard])
        })

        socket.on('serverToClientRedCalled', () => {
            setRedCalled(true);
        })

        socket.on('serverToClientEndGame', ([scoreboard]) => {
            setEndGame(true)
            setEndGameOpen(true)
        })

        return () => {
            socket.off('serverToClientPlayers');
            socket.off('serverToClientId');
            socket.off('serverToClientGameState');
        }
    }, [gameId, socket, nickname])

    return (
        <Box sx={{ maxHeight: '100vh', mt: 2 }}>
            {/* Turn Modal */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {body}
            </Modal>

            {/* Endgame Modal */}
            <Modal
                hideBackdrop
                open={endGameOpen}
                onClose={handleEndGameClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {endGameBody}
            </Modal>

            <Grid container spacing={2}>
                {/* Info Panel: Includes player list, next and discard piles, info display */}
                <Grid item xs={3}>
                    <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
                        <Box sx={{ marginBottom: 'auto', width: '100%' }}>
                            <Typography variant='h5' sx={{ ml: 2, textAlign: 'left' }}>Player List</Typography>
                            {
                                players.map((player, i) => (
                                    <Box sx={{ ml: 2, textAlign: 'left' }}>
                                        <Typography variant={'h6'} sx={{ ml: 2 }}>{turnId === player.s ? `${player.n}'s turn` : player.n}</Typography>
                                    </Box>
                                ))
                            }

                            {/* coloring maybe
                                players.map((player, i) => (
                                    <Box sx={i%2===0 ? { ml: 2, textAlign: 'left', backgroundColor: "brown" } : { ml: 2, textAlign: 'left' }}>
                                        <Typography variant={'h6'} sx={{ ml: 2 }}>{turnId === player.s ? `${player.n}'s turn` : player.n}</Typography>
                                    </Box>
                                ))
                            */}
                        </Box>
                        <Box sx={{ marginBottom: 'auto', width: '100%', textAlign: 'center' }}>
                            {/* Deck and Discard */}
                            <Grid container>
                                <Grid item xs={6}>
                                    <Box sx={{ ml: 2 }}>
                                        <Typography variant='h5' sx={{ textAlign: 'left' }}>Deck</Typography>
                                        {
                                            turnId === id
                                                ? <PlayingCard onClick={() => handleOpen('nextCard')} image={`/cards/${nextCard.visVal}${nextCard.suit}.png`} />
                                                : <PlayingCard image={`/cards/red_back.png`} />
                                        }
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ ml: 2 }}>
                                        <Typography variant='h5' sx={{ textAlign: 'left' }}>Discard</Typography>
                                        {
                                            turnId === id
                                                ? <PlayingCard
                                                    onClick={discard.length > 0 ? () => handleOpen('discard') : null}
                                                    image={
                                                        discard?.length > 0 ?
                                                            `/cards/${discard[discard.length - 1].visVal}${discard[discard.length - 1].suit}.png` :
                                                            `/cards/red_back.png`
                                                    } />
                                                : <PlayingCard
                                                    image={
                                                        discard?.length > 0 ?
                                                            `/cards/${discard[discard.length - 1].visVal}${discard[discard.length - 1].suit}.png` :
                                                            `/cards/red_back.png`
                                                    } />
                                        }
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>

                        {turnId === id ? (
                            <Box sx={{ ml: 2, mt: 1 }}>
                                <Button variant='outlined' onClick={() => handleCardSwap(nextCard, -1, 'negative')} sx={{ width: '100%', color: 'brown' }}>Skip</Button>
                                {
                                    redCalled ? <Button variant='contained' disabled onClick={handleRed} sx={{ mt: 1, width: '100%' }}>Red</Button> : <Button variant='contained' onClick={handleRed} sx={{ mt: 1, backgroundColor: '#28A5A5', width: '100%', color: 'brown' }}>Red</Button>
                                }

                            </Box>
                        ) : (
                            <Box sx={{ ml: 2, mt: 1 }}>
                                <Button variant='outlined' disabled sx={{ width: '100%' }}>Skip</Button>
                                <Button variant='contained' disabled onClick={handleRed} sx={{ mt: 1, width: '100%' }}>Red</Button>
                            </Box>)
                        }



                    </Box>
                </Grid>
                {/* Inner/Gameboard Grid: Divides each hand from each other */}
                <Grid item xs={9}>
                    <Box sx={{ height: '100%' }}>
                        <Grid container spacing={1}>
                            {
                                players.map(player => (
                                    <Grid item xs={3}>
                                        <Box elevation={0} sx={player.s === id ? { padding: 2, backgroundColor: '#28A5A5' } : { padding: 2 }}>
                                            <h4>{player.n}</h4>
                                            <Grid container spacing={1} alignItems="stretch">
                                                {/* Hand Map */}
                                                {
                                                    player.s === id
                                                        ? player.h.map((card, i) => (
                                                            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                                                {
                                                                    card === 0
                                                                        ? <PlayingCard />
                                                                        : <PlayingCard onClick={() => handleCardSlap(card, i)} image={i > 1 ? `/cards/${card.visVal}${card.suit}.png` : `/cards/red_back.png`} />
                                                                }
                                                            </Grid>
                                                        ))
                                                        : player.h.map((card, i) => (
                                                            <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                {
                                                                    card === 0
                                                                        ? <PlayingCard />
                                                                        : <PlayingCard onClick={() => handleCardSlap(card, i)} image={`/cards/red_back.png`} />
                                                                }
                                                            </Grid>
                                                        ))
                                                }
                                            </Grid>
                                        </Box>
                                    </Grid>
                                )
                                )
                            }
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export const WrappedGame = (props) => (
    <SocketContext.Consumer>
        {socket => <Game {...props} socket={socket} />}
    </SocketContext.Consumer>
)

