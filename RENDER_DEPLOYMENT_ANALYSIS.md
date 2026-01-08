# Render Deployment Analysis & Solution

## 1. Why This Error Occurs

### Root Cause
Render is executing `node_modules/expo/AppEntry.js` as a Node.js entry point. This file expects:
- React Native runtime environment (not available on server)
- Metro bundler (development tool, not production server)
- Native module bindings (iOS/Android, not available on Node.js server)

### Technical Explanation
```
Error: Cannot find module 'expo/src/launch/registerRootComponent'
```

This occurs because:
1. Render detects `package.json` with `"main": "node_modules/expo/AppEntry.js"`
2. Render executes: `node node_modules/expo/AppEntry.js`
3. Expo's AppEntry.js imports React Native modules that don't exist in Node.js runtime
4. `registerRootComponent` is a React Native-specific function that requires native bindings

**Expo apps are NOT Node.js applications** - they are mobile applications that require:
- Metro bundler for JavaScript bundling
- React Native runtime (not Node.js)
- Native platform APIs (iOS/Android)

---

## 2. Incorrect Assumptions in Current Setup

### ❌ Assumption 1: Entire project root is deployable
**Reality**: Root directory contains React Native app, not a server application.

### ❌ Assumption 2: Expo app can run as Node.js service
**Reality**: Expo apps require Metro bundler and React Native runtime, not Node.js HTTP server.

### ❌ Assumption 3: `package.json` main entry is a server entry point
**Reality**: `"main": "node_modules/expo/AppEntry.js"` is for Expo CLI, not server execution.

### ❌ Assumption 4: Node.js v22.16.0 is compatible
**Reality**: Expo SDK 54 supports Node 18-20. Node 22 has breaking changes.

---

## 3. What Should Be Deployed to Render?

### ✅ CORRECT: Backend API Server Only

**Deploy**: `server/` directory only
- Contains Express.js API server
- Has proper `server.js` entry point
- Uses standard Node.js dependencies

**DO NOT Deploy**:
- Root directory (`/`)
- `App.js`, `screens/`, `services/` (React Native code)
- `node_modules/expo/` (Expo runtime)
- `app.json` (Expo config)

---

## 4. Deployment Strategy by Component

### A) Expo Mobile App (iOS/Android)
**NOT deployed to Render**

**Deployment Method**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for production
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

**Distribution**: App Store / Google Play Store

---

### B) Expo Web App
**Can be deployed as Render Static Site** (if web support is needed)

**Prerequisites**:
```json
// app.json - Add web support
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

**Build Command**:
```bash
npx expo export:web
```

**Render Static Site Configuration**:
```yaml
# render.yaml (for web only)
services:
  - type: static
    name: booktrack-web
    buildCommand: npm install && npx expo export:web
    staticPublishPath: web-build
```

**However**: Your current app uses React Navigation (not expo-router), which has limited web support. Consider:
- Migrating to expo-router for better web support, OR
- Skip web deployment and focus on mobile + backend

---

### C) Backend API Server
**✅ Deploy to Render Web Service**

**Correct Configuration**:

```yaml
# render.yaml
services:
  - type: web
    name: booktrack-api
    env: node
    plan: free  # or starter
    region: oregon  # or your preferred region
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGODB_URI
        sync: false  # Set in Render dashboard
      - key: DB_NAME
        value: bookDB
```

**Manual Render Dashboard Settings**:
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment**: `Node`
- **Node Version**: `18` (NOT 22)

---

## 5. Node.js Version Recommendation

### ✅ Recommended: Node.js 18.x LTS

**Why Node 18**:
- Expo SDK 54 officially supports Node 18-20
- Stable LTS release
- Compatible with all Expo dependencies
- Render supports Node 18

**Why NOT Node 22**:
- Node 22 introduced breaking ESM changes
- Expo dependencies not tested with Node 22
- Potential compatibility issues with native modules
- Not officially supported by Expo SDK 54

**Set in Render**:
```yaml
# render.yaml
services:
  - type: web
    # ...
    envVars:
      - key: NODE_VERSION
        value: 18.20.0
```

Or in Render dashboard: **Node Version**: `18`

---

## 6. Files/Folders to Exclude from Deployment

### Create `.renderignore` (if deploying entire repo):

```
# Exclude React Native app
App.js
app.json
babel.config.js
screens/
services/
node_modules/
.expo/
.expo-shared/

# Keep only backend
!server/
```

### Better: Deploy only `server/` directory

**In Render Dashboard**:
- Set **Root Directory** to: `server`

**In Git** (if using monorepo):
```bash
# Deploy only server subdirectory
git subtree push --prefix server origin server-deploy
```

---

## 7. Corrected Deployment Steps

### Step 1: Update render.yaml

```yaml
services:
  - type: web
    name: booktrack-api
    env: node
    plan: free
    region: oregon
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: MONGODB_URI
        sync: false
      - key: DB_NAME
        value: bookDB
```

### Step 2: Update server/package.json

```json
{
  "name": "booktrack-server",
  "version": "1.0.0",
  "main": "server.js",
  "engines": {
    "node": "18.x"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### Step 3: Verify server/server.js listens on PORT env var

```javascript
// server/server.js
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 4: Deploy to Render

1. Push code to GitHub
2. Connect repository in Render
3. Render auto-detects `render.yaml`
4. Set `MONGODB_URI` in Render environment variables
5. Deploy

---

## 8. Verification Checklist

- [ ] `render.yaml` specifies `rootDir: server`
- [ ] Node version set to 18 (not 22)
- [ ] `MONGODB_URI` configured in Render dashboard
- [ ] Backend server uses `process.env.PORT`
- [ ] Root `package.json` NOT used for deployment
- [ ] React Native app excluded from deployment

---

## 9. Expected Result After Fix

**Successful Deployment**:
```
✓ Building...
✓ Installing dependencies...
✓ Starting server...
Server running on port 3000
Connected to MongoDB: bookDB
```

**API Endpoints Available**:
- `https://your-app.onrender.com/api/health`
- `https://your-app.onrender.com/api/books`
- `https://your-app.onrender.com/api/authors`
- `https://your-app.onrender.com/api/genres`

---

## 10. Summary

| Component | Deploy To | Method |
|-----------|-----------|--------|
| Backend API | Render Web Service | ✅ Deploy `server/` directory |
| Mobile App | App Stores | ✅ EAS Build + Submit |
| Web App | Render Static Site | ⚠️ Optional (limited RN web support) |

**Critical Fix**: Set Render **Root Directory** to `server` and use **Node 18**.

