import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Lobby from './components/Lobby';
import Board from './components/Board';
import Leaderboard from './components/Leaderboard';
import './index.css';

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, queue, playing, finished
  const [board, setBoard] = useState(Array(6).fill().map(() => Array(7).fill(0)));
  const [gameId, setGameId] = useState(null);
  const [myPlayerNum, setMyPlayerNum] = useState(null);
  const [turn, setTurn] = useState(1);
  const [winner, setWinner] = useState(null);
  const [opponent, setOpponent] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('game_start', (data) => {
      setGameId(data.gameId);
      setOpponent(data.opponent);
      setMyPlayerNum(data.youAre);
      setGameState('playing');
      setBoard(Array(6).fill().map(() => Array(7).fill(0)));
      setTurn(1);
      setWinner(null);
    });

    socket.on('move_made', (data) => {
      const { col, player } = data;
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
        // Apply move from bottom up
        for (let r = 5; r >= 0; r--) {
          if (newBoard[r][col] === 0) {
            newBoard[r][col] = player;
            break;
          }
        }
        return newBoard;
      });
      setTurn(prev => prev === 1 ? 2 : 1);
    });

    socket.on('game_over', ({ winner }) => {
      setWinner(winner);
      setGameState('finished');
    });

    return () => {
      socket.off('connect');
      socket.off('game_start');
      socket.off('move_made');
      socket.off('game_over');
    };
  }, []);

  const joinQueue = (user) => {
    setUsername(user);
    socket.connect();
    socket.emit('join_queue', user);
    setGameState('queue');
  };

  const makeMove = (col) => {
    socket.emit('make_move', { gameId, col });
  };

  const resetGame = () => {
    setGameState('lobby');
    setWinner(null);
    setBoard(Array(6).fill().map(() => Array(7).fill(0)));
  };

  return (
    <div className="App">
      {gameState === 'lobby' && (
        <>
          <Lobby onJoin={joinQueue} />
          <Leaderboard />
        </>
      )}

      {gameState === 'queue' && (
        <div className="lobby">
          <h2>Waiting for opponent...</h2>
          <p>Opponent will be found in 10s or less.</p>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'finished') && (
        <div className="game-container">
          <div className="status">
            {gameState === 'finished' ? (
              <h2 style={{ color: 'var(--primary)' }}>
                {winner === null ? "It's a Draw!" :
                  (winner === myPlayerNum ? "You Won! 🎉" : "You Lost 😞")}
              </h2>
            ) : (
              <h3>
                Playing against: {opponent} <br />
                Turn: {turn === myPlayerNum ? "Your Turn" : "Opponent's Turn"}
              </h3>
            )}
          </div>

          <Board
            board={board}
            onMove={makeMove}
            myPlayerNum={myPlayerNum}
            turn={turn}
            winner={winner}
          />

          {gameState === 'finished' && (
            <button onClick={resetGame}>Back to Lobby</button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
