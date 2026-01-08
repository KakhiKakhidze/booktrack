# Quick Start - Render Deployment

## ✅ All Changes Applied

The following files have been updated for Render deployment:

1. ✅ `render.yaml` - Configured with `rootDir: server` and Node 18
2. ✅ `server/package.json` - Node engine set to 18.x
3. ✅ `server/server.js` - Improved logging for production
4. ✅ `.renderignore` - Excludes React Native files
5. ✅ `services/api.js` - Ready for production URL update

## 🚀 Deploy Now

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure Render deployment - backend only"
git push origin main
```

### Step 2: Configure Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Create new **Web Service**
3. Connect your GitHub repository
4. Render will auto-detect `render.yaml` ✅

### Step 3: Set Environment Variables

In Render dashboard, add:
- `MONGODB_URI` = Your MongoDB connection string (REQUIRED)
- `DB_NAME` = `bookDB` (optional, defaults to bookDB)
- `NODE_ENV` = `production` (already in render.yaml)

### Step 4: Verify Deployment

After deployment, test:
```bash
curl https://your-app.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","db":"connected"}
```

### Step 5: Update Mobile App API URL

After successful deployment, update `services/api.js`:
```javascript
const PRODUCTION_API_URL = 'https://your-app.onrender.com/api';
```

## ⚠️ Critical Settings

- **Root Directory**: `server` (NOT root `/`)
- **Node Version**: `18` (NOT 22)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

## 📋 Files Structure

```
booktrack/
├── server/              ← ONLY THIS DEPLOYS TO RENDER
│   ├── server.js
│   ├── package.json
│   └── seed.js
├── screens/            ← NOT DEPLOYED (React Native)
├── services/           ← NOT DEPLOYED (React Native)
├── App.js              ← NOT DEPLOYED (React Native)
└── render.yaml         ← Render configuration
```

## ✅ Success Indicators

- Build completes without errors
- Server logs show: "Server running on port 3000"
- Health endpoint returns: `{"status":"ok","db":"connected"}`
- Books endpoint returns data: `/api/books`

## 🆘 Troubleshooting

**Error: Cannot find module 'expo'**
→ Root directory is wrong. Set Root Directory to `server`

**Error: Port already in use**
→ Shouldn't happen. Server uses `process.env.PORT` correctly.

**Error: MongoDB connection failed**
→ Check `MONGODB_URI` environment variable is set correctly.

**Error: Node version incompatible**
→ Set Node Version to `18` in Render dashboard.

