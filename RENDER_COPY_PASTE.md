# Render Deployment - Copy & Paste Ready

## Build Command
```
cd frontend && npm ci && npm run build
```

## Start Command
```
cd frontend && npm start
```

## Environment Variables

| Key | Value |
|-----|-------|
| NODE_ENV | production |

---

## Step-by-Step for Render Dashboard

### 1. Create Web Service
- Go to https://render.com
- Click **"New +"** → **"Web Service"**
- Select your repo: **Abhayrana84/Beyond-ETA**
- Click **"Connect"**

### 2. Fill Basic Info
- **Name:** `beyond-eta`
- **Environment:** `Node`
- **Region:** Choose nearest (Oregon, Frankfurt, Singapore, etc.)
- **Branch:** `main`
- **Build Command:** COPY & PASTE BELOW

### 3. Copy This Build Command
```
cd frontend && npm ci && npm run build
```

### 4. Copy This Start Command
```
cd frontend && npm start
```

### 5. Environment Variables
Click **"Advanced"** and add:
- **Key:** `NODE_ENV`
- **Value:** `production`

### 6. Deploy
- Click **"Create Web Service"**
- Wait 3-5 minutes for build & deployment
- Get your live URL: `https://beyond-eta.onrender.com`

---

## All Your Deployment URLs

```
Local Development:     http://localhost:3000
Local Production:      http://localhost:3000 (after npm start)
GitHub Pages:          https://abhayrana84.github.io/Beyond-ETA
Render (after deploy): https://beyond-eta.onrender.com
```

---

## Quick Troubleshooting

**Build fails?** → Check `/frontend/package.json` exists
**404 error?** → Ensure `basePath` is NOT set in `next.config.js`
**Port 3000 in use?** → It will use 3001 or next available port

---

## Build Output Verification ✓

Your build produces:
- ✅ Static HTML/CSS/JS files
- ✅ Optimized bundle (~114 KB first load)
- ✅ Production-ready assets
- ✅ All pages prerendered

Your app is ready to deploy!
