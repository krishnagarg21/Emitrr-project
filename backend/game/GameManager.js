const { v4: uuidv4 } = require('uuid');
const Bot = require('./Bot');
const { pool } = require('../db');
const { sendEvent } = require('../analytics/kafka');

class GameManager {
    constructor(io) {
        this.io = io;
        this.games = new Map(); // gameId -> GameState
        this.players = new Map(); // socketId -> PlayerInfo
        this.matchmakingQueue = [];
    }

    handleConnection(socket) {
        socket.on('join_queue', (username) => {
            this.addToQueue(socket, username);
        });

        socket.on('make_move', (data) => {
            this.handleMove(socket, data);
        });

        // Reconnection logic will go here
    }

    handleDisconnect(socket) {
        const player = this.players.get(socket.id);
        if (player) {
            // Handle player disconnect logic (pause game, start timer, etc.)
            // For now, if in queue, remove from queue
            this.removeFromQueue(socket.id);
        }
    }

    addToQueue(socket, username) {
        console.log(`Adding ${username} to queue`);
        const player = { socketId: socket.id, username };
        this.players.set(socket.id, player);

        this.matchmakingQueue.push(player);

        if (this.matchmakingQueue.length >= 2) {
            const p1 = this.matchmakingQueue.shift();
            const p2 = this.matchmakingQueue.shift();
            this.createGame(p1, p2);
        } else {
            // Set timeout for bot
            setTimeout(() => {
                const idx = this.matchmakingQueue.findIndex(p => p.socketId === socket.id);
                if (idx !== -1) {
                    const p1 = this.matchmakingQueue.splice(idx, 1)[0];
                    this.createBotGame(p1);
                }
            }, 10000);
        }
    }

    removeFromQueue(socketId) {
        const idx = this.matchmakingQueue.findIndex(p => p.socketId === socketId);
        if (idx !== -1) {
            this.matchmakingQueue.splice(idx, 1);
        }
    }

    createGame(p1, p2) {
        const gameId = uuidv4();
        console.log(`Creating game ${gameId} for ${p1.username} and ${p2.username}`);

        const game = {
            id: gameId,
            players: { [p1.socketId]: 1, [p2.socketId]: 2 }, // Map socketId to Player 1 or 2
            playerInfo: { 1: p1, 2: p2 },
            board: Array(6).fill().map(() => Array(7).fill(0)), // 6 rows, 7 cols
            turn: 1, // Player 1 starts
            state: 'active', // active, finished
            winner: null
        };

        this.games.set(gameId, game);

        // Notify players
        this.io.to(p1.socketId).emit('game_start', { gameId, opponent: p2.username, youAre: 1 });
        this.io.to(p2.socketId).emit('game_start', { gameId, opponent: p1.username, youAre: 2 });

        sendEvent('game_start', { gameId, p1: p1.username, p2: p2.username, timestamp: Date.now() });
    }

    createBotGame(p1) {
        const gameId = uuidv4();
        console.log(`Creating bot game ${gameId} for ${p1.username}`);

        const bot = new Bot();
        const game = {
            id: gameId,
            players: { [p1.socketId]: 1, 'bot': 2 },
            playerInfo: { 1: p1, 2: { username: 'Bot' } },
            board: Array(6).fill().map(() => Array(7).fill(0)),
            turn: 1,
            state: 'active',
            winner: null,
            isBotGame: true,
            botInstance: bot
        };

        this.games.set(gameId, game);
        this.io.to(p1.socketId).emit('game_start', { gameId, opponent: 'Bot', youAre: 1 });

        sendEvent('game_start', { gameId, p1: p1.username, p2: 'Bot', timestamp: Date.now() });
    }

    handleMove(socket, { gameId, col }) {
        const game = this.games.get(gameId);
        if (!game || game.state !== 'active') return;

        const playerNum = game.players[socket.id];
        if (!playerNum || game.turn !== playerNum) return;

        if (this.makeMove(game, col, playerNum)) {
            // Valid move
            this.io.to(game.playerInfo[1].socketId).emit('move_made', { col, player: playerNum });
            if (game.playerInfo[2].socketId) {
                this.io.to(game.playerInfo[2].socketId).emit('move_made', { col, player: playerNum });
            }

            if (this.checkWin(game.board, playerNum)) {
                this.endGame(game, playerNum);
            } else if (this.checkDraw(game.board)) {
                this.endGame(game, null); // Draw
            } else {
                game.turn = playerNum === 1 ? 2 : 1;

                // If Playing against bot
                if (game.isBotGame && game.turn === 2) {
                    setTimeout(() => {
                        const botMove = game.botInstance.decideMove(game.board);
                        this.handleBotMove(game, botMove);
                    }, 500); // Small delay for realism
                }
            }
        }
    }

    handleBotMove(game, col) {
        if (this.makeMove(game, col, 2)) {
            this.io.to(game.playerInfo[1].socketId).emit('move_made', { col, player: 2 });

            if (this.checkWin(game.board, 2)) {
                this.endGame(game, 2);
            } else if (this.checkDraw(game.board)) {
                this.endGame(game, null);
            } else {
                game.turn = 1;
            }
        }
    }

    makeMove(game, col, playerNum) {
        // Find lowest empty row in col
        for (let r = 5; r >= 0; r--) {
            if (game.board[r][col] === 0) {
                game.board[r][col] = playerNum;
                return true;
            }
        }
        return false;
    }

    checkWin(board, player) {
        // Horizontal
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r][c + 1] === player && board[r][c + 2] === player && board[r][c + 3] === player) return true;
            }
        }
        // Vertical
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] === player && board[r + 1][c] === player && board[r + 2][c] === player && board[r + 3][c] === player) return true;
            }
        }
        // Diagonal /
        for (let r = 3; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r - 1][c + 1] === player && board[r - 2][c + 2] === player && board[r - 3][c + 3] === player) return true;
            }
        }
        // Diagonal \
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] === player && board[r + 1][c + 1] === player && board[r + 2][c + 2] === player && board[r + 3][c + 3] === player) return true;
            }
        }
        return false;
    }

    checkDraw(board) {
        return board[0].every(cell => cell !== 0);
    }

    async endGame(game, winner) {
        game.state = 'finished';
        game.winner = winner;
        this.io.to(game.playerInfo[1].socketId).emit('game_over', { winner });
        if (game.playerInfo[2].socketId) {
            this.io.to(game.playerInfo[2].socketId).emit('game_over', { winner });
        }

        // Analytics
        sendEvent('game_end', { gameId: game.id, winner, timestamp: Date.now() });

        // Persistence
        try {
            const p1Name = game.playerInfo[1].username;
            const p2Name = game.playerInfo[2].username;
            const result = winner === 1 ? 'player1' : (winner === 2 ? 'player2' : 'draw');
            const winnerName = winner === 1 ? p1Name : (winner === 2 ? p2Name : null);

            await pool.query(
                'INSERT INTO games (id, player1, player2, winner, result) VALUES ($1, $2, $3, $4, $5)',
                [game.id, p1Name, p2Name, winnerName, result]
            );

            // Update user stats
            await this.updateUserStats(p1Name, winner === 1 ? 'win' : (winner === 2 ? 'loss' : 'draw'));
            if (!game.isBotGame) {
                await this.updateUserStats(p2Name, winner === 2 ? 'win' : (winner === 1 ? 'loss' : 'draw'));
            }
        } catch (err) {
            console.error('Error saving game result', err);
        }
    }

    async updateUserStats(username, result) {
        try {
            await pool.query(
                `INSERT INTO users (username, wins, losses, draws) 
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (username) DO UPDATE SET
                 wins = users.wins + $2,
                 losses = users.losses + $3,
                 draws = users.draws + $4`,
                [
                    username,
                    result === 'win' ? 1 : 0,
                    result === 'loss' ? 1 : 0,
                    result === 'draw' ? 1 : 0
                ]
            );
        } catch (err) {
            console.error('Error updating user stats', err);
        }
    }
}

module.exports = GameManager;
