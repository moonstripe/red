import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router';
import { SocketContext } from '../utils/SocketContext';

// import { io } from 'socket.io-client';
// const socket = io('http://localhost:3001');

const Lobby = ({socket}) => {
    const nickname = useSelector(state => state.nickname.nickname)
    const { id } = useParams();
    const history = useHistory();

    const [players, setPlayers] = useState([]);
    const [failure, setFailure] = useState(false);
    const [readyable, setReadyable] = useState(false);

    const handleReady = () => {
        socket.emit('clientToServerLobbyReady', id)
    }

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

        socket.on('serverToClientLobbyMax', () => {
            console.log('ready up')
            setReadyable(true);
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
        <div sx={{marginTop: 'auto'}}>

            {
                failure ? <p>full lobby :(</p> :
                    <div>
                        <h4>hi, i'm in {id}</h4>
                        <ul>
                            {players.length > 0
                                ? players.map((p) => (
                                    <li>{p.n}</li>
                                )) : 'loading'}
                        </ul>
                    </div>

            }
            {
                readyable ? <button onClick={() => {handleReady()}}>Ready?</button> : null
            }
        </div>
    )
}

export const WrappedLobby = (props) => (
    <SocketContext.Consumer>
        {socket => <Lobby {...props} socket={socket}/>}
    </SocketContext.Consumer>
)