# Render Deployment Guide

## Steps to Deploy on Render

### 1. **Create a Render Account**
- Go to https://render.com
- Sign up with your GitHub account
- Authorize Render to access your repositories

### 2. **Connect GitHub Repository**
- In Render dashboard, click **"New +"** → **"Web Service"**
- Select "GitHub" as the repository source
- Choose repository: `Abhayrana84/Beyond-ETA`
- Click "Connect"

### 3. **Configure Deployment Settings**

**Name:** `beyond-eta`

**Environment:** Node.js

**Region:** Select nearest region (Oregon, Frankfurt, Singapore, etc.)

**Branch:** `main`

**Build Command:** `cd frontend && npm install && npm run build`

**Start Command:** `cd frontend && npm start`

**Plan:** Free (or paid for better performance)

### 4. **Environment Variables**
Click "Advanced" and add:
- **Key:** `NODE_ENV`
- **Value:** `production`

(Optional) Add if using GitHub Pages alternative:
- **Key:** `DEPLOY_TARGET`  
- **Value:** `render` (or `github-pages` for GitHub Pages)

### 5. **Auto-Deploy Settings**
- **Auto-Deploy:** Enabled (deploys on every push to main)
- The `.nvmrc` file ensures Node.js 18.17.0 is used

### 6. **Deploy**
Click **"Create Web Service"**

Render will:
- Build your Next.js app
- Run the server
- Provide a public URL (something like `beyond-eta.onrender.com`)

## Deployment URLs

- **Render Production:** `https://beyond-eta.onrender.com`
- **GitHub Pages:** `https://abhayrana84.github.io/Beyond-ETA`
- **Local Development:** `http://localhost:3001`

## What Happens on Each Push

1. Code pushed to `main` branch
2. Render detects changes
3. Installs dependencies
4. Builds the Next.js static site
5. Starts the production server
6. Site goes live automatically

## Troubleshooting

**Build fails?**
- Check Render logs: Dashboard → Your Service → Logs
- Ensure `frontend/package.json` exists
- Check for Node version compatibility

**Site shows 404?**
- Make sure `basePath` is not set for Render
- Clear browser cache
- Check that `next.config.js` has correct config

**Need to use GitHub Pages instead?**
Set `DEPLOY_TARGET=github-pages` in Render environment variables

## After Deployment

Your site will be live at the Render URL with:
- ✅ Google Maps integration
- ✅ Real-time route comparison  
- ✅ Sensor monitoring
- ✅ Safe navigation features
