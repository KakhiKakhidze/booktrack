# Render Deployment Checklist

## Pre-Deployment

- [x] `render.yaml` configured with `rootDir: server`
- [x] Node version set to 18.x in `server/package.json`
- [x] Server uses `process.env.PORT` correctly
- [x] `.renderignore` excludes React Native files

## Render Dashboard Configuration

### Service Settings
- [ ] **Service Type**: Web Service
- [ ] **Root Directory**: `server` ⚠️ CRITICAL
- [ ] **Build Command**: `npm install`
- [ ] **Start Command**: `npm start`
- [ ] **Environment**: Node
- [ ] **Node Version**: `18` (NOT 22) ⚠️ CRITICAL

### Environment Variables
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000` (or let Render assign)
- [ ] `MONGODB_URI` = Your MongoDB connection string ⚠️ REQUIRED
- [ ] `DB_NAME` = `bookDB`

## Verification Steps

1. **Check Build Logs**:
   ```
   ✓ Building...
   ✓ Installing dependencies...
   ✓ Starting server...
   ```

2. **Test API Endpoints**:
   ```bash
   curl https://your-app.onrender.com/api/health
   # Expected: {"status":"ok","db":"connected"}
   
   curl https://your-app.onrender.com/api/books
   # Expected: Array of books
   ```

3. **Check Server Logs**:
   ```
   Server running on port 3000
   Environment: production
   Database: bookDB
   Connected to MongoDB: bookDB
   ```

## Common Issues

### ❌ Error: Cannot find module 'expo'
**Cause**: Root directory deployed instead of `server/`
**Fix**: Set Root Directory to `server` in Render dashboard

### ❌ Error: Port already in use
**Cause**: Multiple instances (shouldn't happen on Render)
**Fix**: Server uses `process.env.PORT` correctly

### ❌ Error: MongoDB connection failed
**Cause**: Missing or incorrect `MONGODB_URI`
**Fix**: Set `MONGODB_URI` in Render environment variables

### ❌ Error: Node version incompatible
**Cause**: Using Node 22 instead of Node 18
**Fix**: Set Node Version to `18` in Render dashboard

## Post-Deployment

- [ ] Update `services/api.js` with production API URL
- [ ] Test mobile app connects to deployed API
- [ ] Monitor Render logs for errors
- [ ] Set up MongoDB Atlas IP whitelist if needed

## Quick Deploy Command

```bash
# Push to GitHub (Render auto-deploys)
git add .
git commit -m "Configure Render deployment"
git push origin main
```

## Support

If deployment fails:
1. Check Render build logs
2. Verify `rootDir: server` in `render.yaml`
3. Verify Node version is 18
4. Check environment variables are set

