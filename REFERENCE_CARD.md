# 📋 Deployment Reference Card

## Quick Copy-Paste Values

### Backend (.env on Render)
```
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://emitrr-project.vercel.app
```
*Replace `emitrr-project.vercel.app` with your actual Vercel URL*

### Frontend (.env.local on Vercel)
```
VITE_BACKEND_URL=https://emitrr-backend.onrender.com
```
*Replace `emitrr-backend.onrender.com` with your actual Render URL*

---

## Render Deployment Steps

```
1. New Web Service
2. Select GitHub repo
3. Runtime: Node
4. Build: npm install
5. Start: npm start
6. Environment Variables:
   PORT=3001
   NODE_ENV=production
   ALLOWED_ORIGINS=(add after frontend deployed)
7. Deploy
8. Copy URL
```

---

## Vercel Deployment Steps

```
1. Import Project
2. Root Directory: frontend
3. Build Command: npm run build
4. Output: dist
5. Environment Variables:
   VITE_BACKEND_URL=(your Render URL)
6. Deploy
7. Copy URL
8. Go back to Render & update ALLOWED_ORIGINS
```

---

## Testing Commands

### Local Backend
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

### Local Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

### Check Health Endpoint
```bash
curl https://your-render-url/health
# Should return: Server is running
```

---

## File Locations Reference

| Task | File |
|------|------|
| Check socket connection | [frontend/src/socket.js](frontend/src/socket.js) |
| Check server CORS | [backend/server.js](backend/server.js) |
| Backend env template | [backend/.env.example](backend/.env.example) |
| Frontend env template | [frontend/.env.example](frontend/.env.example) |
| Full deployment guide | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Quick checklist | [QUICK_DEPLOYMENT.md](QUICK_DEPLOYMENT.md) |

---

## Environment Variable Names

### Frontend
- `VITE_BACKEND_URL` - Backend WebSocket URL (without trailing slash)

### Backend
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed frontend URLs

---

## Common URLs

| Service | URL Format |
|---------|-----------|
| Render | `https://app-name.onrender.com` |
| Vercel | `https://project-name.vercel.app` |
| Localhost Backend | `http://localhost:3001` |
| Localhost Frontend | `http://localhost:5173` |

---

## Troubleshooting URLs

| Problem | Check |
|---------|-------|
| Frontend can't connect | Browser console → Network tab → WebSocket status |
| CORS error | Backend ALLOWED_ORIGINS env var |
| Socket undefined | VITE_BACKEND_URL environment variable |
| 404 on health check | Backend is running and accessible |
| Database lost | Expected on Render (ephemeral filesystem) |

---

## Package.json Scripts

### Backend
```json
"start": "node server.js"
```

### Frontend
```json
"build": "vite build",
"dev": "vite",
"preview": "vite preview"
```

---

## Key Files Modified

```
frontend/src/socket.js ................. ✅ Updated
backend/server.js ..................... ✅ Updated

frontend/.env.example ................. ✅ Created
backend/.env.example .................. ✅ Created
frontend/vercel.json .................. ✅ Created
backend/render.json ................... ✅ Created
backend/.gitignore .................... ✅ Created
```

---

## Important Reminders

⚠️ **Never commit `.env` files**  
✅ **Do commit `.env.example` files**  
✅ **Copy `.env.example` → `.env.local` locally**  
✅ **Add sensitive values only on Render/Vercel dashboards**

---

## Success Indicators

✅ Frontend loads without errors  
✅ Browser console shows no red errors  
✅ Socket.IO connects to backend (check Network tab)  
✅ Can join game queue  
✅ Can play moves  
✅ Leaderboard loads  

---

## Getting Help

- **Full Guide**: Read [DEPLOYMENT.md](DEPLOYMENT.md)
- **Quick Steps**: Follow [QUICK_DEPLOYMENT.md](QUICK_DEPLOYMENT.md)
- **What Changed**: See [CODE_CHANGES_SUMMARY.md](CODE_CHANGES_SUMMARY.md)
- **Status Check**: See [DEPLOYMENT_READINESS.md](DEPLOYMENT_READINESS.md)

---

Last Updated: 2026-01-29  
Status: ✅ READY FOR DEPLOYMENT
