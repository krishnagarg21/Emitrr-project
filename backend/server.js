require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000,http://localhost:5173").split(',').map(origin => origin.trim());
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        credentials: true
    }
});

const { pool, initDB } = require('./db');
const { initKafka } = require('./analytics/kafka');

const PORT = process.env.PORT || 3001;

// Placeholder for Game Manager
const GameManager = require('./game/GameManager');
const gameManager = new GameManager(io);

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    gameManager.handleConnection(socket);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        gameManager.handleDisconnect(socket);
    });
});

app.get('/health', (req, res) => {
    res.send('Server is running');
});

app.get('/leaderboard', async (req, res) => {
    try {
        const result = await pool.query('SELECT username, wins, losses, draws FROM users ORDER BY wins DESC LIMIT 10');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching leaderboard', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await initDB();
    await initKafka();
});
