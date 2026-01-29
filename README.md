# Emitrr - Connect Four Game

A real-time multiplayer Connect Four game built with React, Node.js, Express, and Socket.IO. Play against other players or challenge an AI bot.

## 🎮 Features

- **Real-time Multiplayer**: Play against other players in real-time using WebSocket connections
- **AI Bot**: If no opponent is available within 10 seconds, play against a smart bot
- **Leaderboard**: Track wins, losses, and draws
- **Game Queue System**: Automatic matchmaking
- **Responsive UI**: Built with React and Vite for fast performance

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **GitHub Account** - [Sign up](https://github.com/)

Verify installation:
```bash
node --version
npm --version
git --version
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/emitrr-project.git
cd emitrr-project
```

### 2. Install Dependencies

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### 3. Create Environment Files

#### Backend (`backend/.env`)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (`frontend/.env.local`)
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
VITE_BACKEND_URL=http://localhost:3001
```

### 4. Start the Application

You'll need **two terminal windows** (one for backend, one for frontend):

#### Terminal 1 - Backend
```bash
cd backend
npm start
```
Expected output:
```
Server running on port 3001
SQLite Database initialized
Mock Analytics Initialized (Logging to file)
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE v7.2.4  ready in 100 ms

➜  Local:   http://localhost:5173/
```

### 5. Open in Browser

Visit: **http://localhost:5173/**

You should see the Emitrr game lobby. Try joining a game queue!

---

## 📁 Project Structure

```
emitrr-project/
├── backend/                    # Node.js Express server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment template
│   ├── db/                    # Database setup
│   │   └── index.js           # SQLite database initialization
│   ├── game/                  # Game logic
│   │   ├── GameManager.js     # Game orchestration
│   │   └── Bot.js             # AI bot logic
│   └── analytics/             # Analytics & logging
│       └── kafka.js           # Mock analytics
│
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx            # Main app component
│   │   ├── socket.js          # Socket.IO client setup
│   │   ├── main.jsx           # Entry point
│   │   └── components/        # React components
│   │       ├── Board.jsx      # Game board
│   │       ├── Lobby.jsx      # Game lobby
│   │       └── Leaderboard.jsx# Leaderboard display
│   ├── package.json           # Frontend dependencies
│   ├── .env.example           # Environment template
│   └── vite.config.js         # Vite configuration
│
└── package.json               # Root package.json
```

---

## 🔧 Available Scripts

### Backend

```bash
npm start          # Start the server on port 3001
npm test           # Run tests (if configured)
```

### Frontend

```bash
npm run dev        # Start development server on localhost:5173
npm run build      # Build for production (outputs to dist/)
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
```

---

## 🌐 Deployment

This project is ready to deploy on:
- **Frontend**: [Vercel](https://vercel.com/)
- **Backend**: [Render](https://render.com/)

See the deployment guides in the project root for detailed instructions:
- `QUICK_DEPLOYMENT.md` - 5-minute quick start
- `DEPLOYMENT.md` - Full deployment guide

### Production Environment Variables

#### Backend (on Render)
```
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app
```

#### Frontend (on Vercel)
```
VITE_BACKEND_URL=https://your-render-domain.onrender.com
```

---

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database**: SQLite3
- **CORS**: Express CORS middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Real-time**: Socket.IO Client
- **Styling**: CSS3
- **Linting**: ESLint

---

## 🎯 How to Play

1. **Enter Your Username**: Type your name in the lobby
2. **Join Queue**: Click "Join Game" to find an opponent
3. **Wait for Match**: 
   - If another player joins within 10 seconds → Play vs Player
   - If no one joins → Play vs Bot
4. **Make Moves**: Click a column to drop your piece
5. **Win**: Get 4 pieces in a row (horizontal, vertical, or diagonal)
6. **View Leaderboard**: Check the leaderboard for top players

---

## 🤖 Bot AI

The bot uses a strategic approach:
- Tries to win if possible
- Blocks player winning moves
- Builds strategic positions
- Makes random safe moves when no strategy applies

---

## 📊 Database

The app uses **SQLite** for local storage:
- **Users Table**: Tracks username, wins, losses, draws
- **Games Table**: Stores game history with results

Database file: `backend/db/game.db` (created automatically on first run)

---

## 🐛 Troubleshooting

### Frontend can't connect to backend
1. Ensure backend is running: `npm start` in backend folder
2. Check `VITE_BACKEND_URL` in `frontend/.env.local`
3. Open browser DevTools (F12) → Console for errors

### Port already in use
```bash
# Kill process on port 3001
# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process

# macOS/Linux:
lsof -ti:3001 | xargs kill -9
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Database issues
```bash
# Delete the database file to reset
rm backend/db/game.db

# Restart backend - database will be recreated
npm start
```

---

## 📝 Environment Variables Reference

### Backend (.env)
| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment (development/production) |
| ALLOWED_ORIGINS | localhost URLs | CORS allowed origins |

### Frontend (.env.local)
| Variable | Default | Description |
|----------|---------|-------------|
| VITE_BACKEND_URL | http://localhost:3001 | Backend server URL |

---

## 📤 Push to GitHub (From Scratch)

### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com/) and log in
2. Click **+** in top right → **New repository**
3. Repository name: `emitrr-project`
4. Description: `A real-time multiplayer Connect Four game`
5. Choose: **Public** or **Private**
6. **DO NOT** initialize with README (we have one)
7. Click **Create repository**

### Step 2: Initialize Git Locally

```bash
cd emitrr-project

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Emitrr game ready for deployment"
```

### Step 3: Connect to GitHub

Copy the commands from GitHub and run them:

```bash
# Set main branch
git branch -M main

# Add remote origin
git remote add origin https://github.com/YOUR-USERNAME/emitrr-project.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR-USERNAME`** with your actual GitHub username.

### Step 4: Verify

Visit `https://github.com/YOUR-USERNAME/emitrr-project` in your browser. You should see your code!

---

## 🔄 Regular Git Commands

After the initial setup, use these commands:

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull
```

---

## 📋 Checklist Before Pushing to GitHub

- [ ] Node.js and npm installed
- [ ] All dependencies installed (`npm install` in both folders)
- [ ] `.env` files created locally (but NOT committed)
- [ ] `.env.example` files are present
- [ ] `.gitignore` file exists in root
- [ ] Backend runs: `npm start` → port 3001 ✅
- [ ] Frontend runs: `npm run dev` → localhost:5173 ✅
- [ ] Can play a game locally ✅
- [ ] No console errors (F12) ✅
- [ ] GitHub account created
- [ ] SSH keys configured (optional but recommended)

---

## 🚀 Next Steps

1. **Push to GitHub** using the steps above
2. **Deploy to Production**:
   - Backend → [Render](https://render.com/)
   - Frontend → [Vercel](https://vercel.com/)
3. **See deployment guides** for detailed instructions
4. **Test live application**
5. **Share with friends!** 🎮

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev/)
- [Socket.IO Docs](https://socket.io/docs/)
- [Vite Docs](https://vitejs.dev/)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://docs.github.com/)

---

## 📄 License

This project is licensed under the ISC License.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💬 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review error messages in browser console (F12)
3. Check Render/Vercel logs during deployment
4. Open an issue on GitHub

---

## ✨ Features Coming Soon

- [ ] User authentication & profiles
- [ ] Persistent player statistics
- [ ] Custom game modes
- [ ] Chat during games
- [ ] Mobile app
- [ ] Replay system

---

**Ready to play?** Run `npm start` (backend) and `npm run dev` (frontend), then open http://localhost:5173/! 🎮

Made with ❤️ by the Emitrr Team
