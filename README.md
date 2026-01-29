# 4 in a Row — Real-Time Multiplayer Game

A robust, backend-driven implementation of the classic Connect 4 game, featuring real-time multiplayer, intelligent matchmaking, and persistent game tracking.

## 🧠 Project Overview

This project simulates a production-grade gaming environment where logic is centralized on the server to prevent cheating and ensure consistency.

### Core Architecture

- **Backend (Node.js/Express)**: Acts as the game authority. It manages the state of every active game in memory (`GameManager`), processes moves, validates win conditions, and handles player connections via WebSockets.
- **Real-Time Communication (Socket.io)**: Events like `game_start`, `move_made`, and `game_over` are pushed instantly to clients, ensuring a seamless experience.
- **Data Persistence (SQLite)**: While active games are held in memory for speed, completed game results and player statistics (Wins/Losses) are permanently stored in a relational SQLite database.
- **Analytics**: A decoupled analytics module tracks system events (game starts, resolutions) to a log file, simulating a production telemetry pipeline.

### Key Features Explained

1.  **Matchmaking System**:
    - Players join a central queue.
    - If another player is available, a 1v1 session starts immediately.
    - **Fallback Mechanism**: The system enforces a 10-second service-level agreement (SLA) for finding a match. If no human opponent is found, the server instantiates a **Bot** game.

2.  **Competitive Bot Logic**:
    - The bot is not random. It uses a heuristic decision engine:
        - **Defensive**: Prioritizes blocking the opponent's winning moves.
        - **Offensive**: actively looks for winning connections (Horizontal, Vertical, Diagonal).
        - **Simulation**: Provides a realistic challenge by analyzing the board state before moving.

3.  **Resilience**:
    - The server handles disconnects gracefully, maintaining the game state so players can potentially reconnect (logic framework in place).

---

## 🛠️ Setup Instructions (Localhost)

Follow these steps to set up the project locally from the GitHub repository.

### Prerequisites
- **Node.js**: Version 16 or higher.
- **npm**: Comes with Node.js.

### 1. Clone the Repository
```bash
git clone <repository_url>
cd <repository_folder>
```

### 2. Backend Setup
The backend runs on Port `3001` and manages the SQLite database automatically.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the server:
    ```bash
    node server.js
    ```
    ✅ *Console Output: `Server running on port 3001`, `SQLite Database initialized`*

### 3. Frontend Setup
The frontend is a lightweight React application (Vite) running on Port `5173`.

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the client:
    ```bash
    npm run dev
    ```
4.  Open the link shown in the terminal (usually `http://localhost:5173`) in your browser.

---

## 👨‍💻 Developer Details

**Krishna Garg**
- 📧 **Email**: [krishnagarga21@gmail.com](mailto:krishnagarga21@gmail.com)
- 📞 **Phone**: 9518820758
- 🔗 **LinkedIn**: [krishna-garg21](https://www.linkedin.com/in/krishna-garg21/)
