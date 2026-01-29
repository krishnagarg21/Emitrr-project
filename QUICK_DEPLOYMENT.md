# Quick Deployment Checklist

## ✅ Pre-Deployment Verification

### Backend (Render)
- [x] `server.js` uses `process.env.PORT` ✅
- [x] CORS configured with environment variable ✅
- [x] `package.json` has start script: `"start": "node server.js"` ✅
- [x] `.env.example` created ✅
- [ ] Created `.env` file locally with your values

### Frontend (Vercel)
- [x] Socket.js uses environment variable `VITE_BACKEND_URL` ✅
- [x] `package.json` has build script: `"build": "vite build"` ✅
- [x] `.env.example` created ✅
- [ ] Created `.env.local` file locally with your backend URL

---

## 🚀 Step-by-Step Deployment

### Phase 1: Deploy Backend First
1. [ ] Push backend code to GitHub
2. [ ] Go to Render → Create Web Service
3. [ ] Select your repo, build with `npm install`, start with `npm start`
4. [ ] Add env vars: `PORT=3001`, `NODE_ENV=production`
5. [ ] Wait for successful deployment
6. [ ] Copy backend URL (e.g., `https://emitrr-backend.onrender.com`)

### Phase 2: Deploy Frontend
1. [ ] Create `.env.local` in `frontend/` directory:
   ```
   VITE_BACKEND_URL=https://emitrr-backend.onrender.com
   ```
2. [ ] Push frontend code to GitHub
3. [ ] Go to Vercel → Import Project → Select repo
4. [ ] Set root directory: `frontend`
5. [ ] Add env var: `VITE_BACKEND_URL=https://emitrr-backend.onrender.com`
6. [ ] Deploy
7. [ ] Copy frontend URL (e.g., `https://emitrr-project.vercel.app`)

### Phase 3: Update CORS on Backend
1. [ ] Go back to Render → Your backend service
2. [ ] Edit environment variable: `ALLOWED_ORIGINS=https://emitrr-project.vercel.app`
3. [ ] Save (backend will redeploy)

---

## 🧪 Post-Deployment Testing

1. [ ] Open frontend URL in browser
2. [ ] Open DevTools (F12) → Console tab
3. [ ] Try to join game queue
4. [ ] Check for any red errors in console
5. [ ] If error: Check that `VITE_BACKEND_URL` matches your Render backend URL
6. [ ] Check Render logs for backend errors

---

## ⚠️ Critical Notes

### SQLite Database Issue
- **Problem**: Your database file (`game.db`) won't persist on Render
- **Effect**: All game data is lost when Render redeploys
- **Solution**: This is OK for testing. For production, migrate to PostgreSQL or external database.

### Environment Variables Must Be Set
- Backend needs: `ALLOWED_ORIGINS` pointing to your Vercel domain
- Frontend needs: `VITE_BACKEND_URL` pointing to your Render domain
- These are fetched during build/start time

### Common Errors
| Error | Fix |
|-------|-----|
| "Cannot establish connection" | Verify `VITE_BACKEND_URL` in `.env.local` |
| "CORS policy error" | Update `ALLOWED_ORIGINS` on Render to include Vercel URL |
| "Socket not connecting" | Check browser console → Network tab → WebSocket connections |

---

## 📝 Notes
- Your code logic is working fine on localhost ✅
- Only configuration changes were made for production ✅
- No functional changes to the game logic ✅
- Database reset on deploy is expected behavior with SQLite on Render
