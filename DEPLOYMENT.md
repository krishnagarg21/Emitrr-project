# Deployment Guide - Vercel (Frontend) + Render (Backend)

## Prerequisites
- GitHub repository with both frontend and backend code
- Vercel account (vercel.com)
- Render account (render.com)

---

## Backend Deployment (Render)

### Step 1: Prepare Your Repository
1. Ensure your `backend/` folder has:
   - `package.json` with proper dependencies
   - `server.js` with proper start script
   - `.env.example` file with required variables

2. Create a `.env` file (locally only, don't commit):
   ```
   PORT=3001
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
   ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in the details:
   - **Name**: `emitrr-backend` (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (which runs `node server.js`)
5. Click **Advanced** and add environment variables:
   - `PORT`: 3001 (Render assigns this automatically)
   - `NODE_ENV`: production
   - `ALLOWED_ORIGINS`: (leave empty for now, update after frontend is deployed)
6. Click **Create Web Service**
7. Wait for deployment (takes 2-5 minutes)
8. Copy the URL (e.g., `https://emitrr-backend.onrender.com`)

### Step 3: Important Notes for Render
- **Ephemeral Filesystem**: Render doesn't persist files. Your SQLite database will be lost on redeploy.
  - **Solution**: Migrate to PostgreSQL on Render or use an external database service (Firebase, MongoDB Atlas, etc.)
- **Cold Start**: First request may take 30s on free tier
- **Keep-Alive**: Add a health check in your code (already implemented with `/health` endpoint)

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Repository
1. Ensure your `frontend/` folder has:
   - `package.json` with proper dependencies
   - `vite.config.js` configured correctly
   - `.env.example` file
2. Create `.env.local` file (locally only, don't commit):
   ```
   VITE_BACKEND_URL=https://emitrr-backend.onrender.com
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Set up the project:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Advanced** → **Environment Variables**
6. Add:
   - `VITE_BACKEND_URL`: `https://emitrr-backend.onrender.com`
7. Click **Deploy**
8. Wait for deployment (usually 1-2 minutes)
9. Copy the frontend URL (e.g., `https://emitrr-project.vercel.app`)

### Step 3: Update Backend CORS
1. Go back to Render dashboard
2. Click on your backend service
3. Go to **Environment** tab
4. Update `ALLOWED_ORIGINS` to your Vercel frontend URL:
   ```
   https://emitrr-project.vercel.app
   ```
5. Click **Save Changes** - your backend will redeploy automatically

---

## Environment Variables Setup

### Backend (.env)
```
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Frontend (.env.local)
```
VITE_BACKEND_URL=https://your-render-app.onrender.com
```

---

## Testing After Deployment

1. Open your Vercel frontend URL
2. Try to join a game queue
3. Check browser console for any connection errors
4. Check Render logs for any server errors

### Common Issues:

| Issue | Solution |
|-------|----------|
| "Cannot reach backend" | Ensure `VITE_BACKEND_URL` is correctly set and matches backend URL |
| CORS error | Update `ALLOWED_ORIGINS` on Render to include your Vercel domain |
| Database lost | Render's filesystem is ephemeral. Migrate to external database |
| Cold start delay | Normal on Render free tier. Consider paid tier for production |

---

## Database Considerations

Your project uses **SQLite** which stores data in `backend/db/game.db`.

### ⚠️ Issue on Render:
Render doesn't persist files between redeploys. Your database will be lost.

### Solutions:

#### Option 1: PostgreSQL on Render (Recommended)
1. Create a PostgreSQL database on Render
2. Update your `backend/db/index.js` to use PostgreSQL instead of SQLite
3. Use connection string from Render

#### Option 2: External Database
- **MongoDB Atlas** (free tier available)
- **Firebase Realtime Database**
- **Supabase** (PostgreSQL hosted)

#### Option 3: Accept Data Loss
If your app is just for testing, you can keep SQLite and accept that data is lost on redeploy.

---

## Production Checklist

- [ ] Environment variables configured on both Vercel and Render
- [ ] Backend CORS allows frontend domain
- [ ] Frontend points to correct backend URL
- [ ] Database solution decided (if using SQLite, accept data loss)
- [ ] Tested connection between frontend and backend
- [ ] No console errors in browser DevTools
- [ ] No errors in Render logs
- [ ] Health check endpoint works (`/health`)

---

## Redeploying After Changes

### Backend Changes:
1. Push to GitHub
2. Render auto-deploys on git push (if connected)
3. Check deployment status on Render dashboard

### Frontend Changes:
1. Push to GitHub
2. Vercel auto-deploys on git push
3. Check deployment status on Vercel dashboard

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Socket.IO Production**: https://socket.io/docs/v4/socket-io-on-windows/
