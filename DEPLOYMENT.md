# Deployment Guide

## Important: What to Deploy

**ONLY deploy the backend server** (`server/` directory) to Render or any hosting service.

**DO NOT deploy the React Native Expo app** - it runs on mobile devices, not servers.

## Backend Deployment (Render.com)

### Option 1: Using render.yaml (Recommended)

1. Push your code to GitHub
2. Connect your repository to Render
3. Render will automatically detect `render.yaml` and deploy only the backend

### Option 2: Manual Setup

1. In Render dashboard, create a new **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Node Version**: `18` or higher

4. Set Environment Variables:
   - `PORT`: `3000` (or let Render assign one)
   - `MONGODB_URI`: Your MongoDB connection string
   - `DB_NAME`: `bookDB`
   - `NODE_ENV`: `production`

### MongoDB Setup

You can use:
- **MongoDB Atlas** (free tier available): https://www.mongodb.com/cloud/atlas
- Or your own MongoDB instance

Update `MONGODB_URI` in Render environment variables.

## Frontend (React Native App)

The React Native app should:
1. **Run locally** using `npm start` for development
2. **Build for mobile**:
   - Android: `eas build --platform android`
   - iOS: `eas build --platform ios`
3. **Deploy to app stores** using Expo Application Services (EAS)

### Update API URL for Production

After deploying the backend, update `services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Local development
  : 'https://your-render-app.onrender.com/api';  // Production
```

Or use environment variables with `expo-constants`:

```bash
npm install expo-constants
```

Then in `services/api.js`:
```javascript
import Constants from 'expo-constants';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : `${Constants.expoConfig.extra.apiUrl}/api`;
```

And in `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-render-app.onrender.com"
    }
  }
}
```

## Testing Deployment

1. Deploy backend to Render
2. Test API: `https://your-app.onrender.com/api/health`
3. Update frontend API URL
4. Test the mobile app

## Common Issues

### Error: Cannot find module 'expo'
- **Cause**: Trying to deploy React Native app to server
- **Solution**: Only deploy the `server/` directory

### Error: MongoDB connection failed
- **Cause**: Wrong connection string or network restrictions
- **Solution**: 
  - Use MongoDB Atlas (cloud)
  - Whitelist Render IPs in MongoDB Atlas
  - Check connection string format

### Error: Port already in use
- **Cause**: Multiple instances running
- **Solution**: Render handles this automatically

