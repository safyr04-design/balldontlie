# 🚀 Deployment Information

## Live Dashboard

**URL**: https://3003-i89pt90gl83mn7gkol6v2-dfc00ec5.sandbox.novita.ai

The Ball Don't Lie Lab Dashboard is now live and accessible!

## Features

### 🎨 Beautiful UI
- Dark theme with glassmorphism effects
- Smooth Framer Motion animations
- Interactive charts with Recharts
- Fully responsive design
- Professional Tailwind CSS styling

### 📊 Dashboard Pages
1. **Home** - Overview with stats cards and quick actions
2. **Models** - Browse and manage betting strategies
3. **Predictions** - View predictions with confidence scores
4. **Factor Analysis** - Analyze factors and get recommendations
5. **Settings** - API configuration

## Technical Details

### Frontend Stack
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualizations
- **Lucide React** - Beautiful icons

### Configuration
- Server runs on port 3003
- Host: 0.0.0.0 (accessible externally)
- Allowed hosts: `.sandbox.novita.ai`, `localhost`, `127.0.0.1`
- API proxy configured for `/api` routes

## Backend API

The backend is configured with your API key: `eb22453f-3efd-4b06-884d-996ebca1a436`

### Available Endpoints
- Models management
- Predictions generation
- Factor analysis
- Performance tracking

## Quick Commands

### Start Frontend
```bash
cd /home/user/webapp/frontend
npm run dev
```

### Run Backend Demos
```bash
cd /home/user/webapp/backend
export BDL_API_KEY='eb22453f-3efd-4b06-884d-996ebca1a436'

# Interactive guide
python main_demo.py guide

# Create sample models
python main_demo.py create

# Analyze factors
python main_demo.py analyze
```

### Start Monitoring
```bash
cd /home/user/webapp/backend
python prediction_monitor.py add <model_id>
python prediction_monitor.py start
```

## Important Notes

⚠️ **API Access Limitation**
- The provided API key is on the **Free tier**
- Free tier allows UI access only
- Programmatic API access requires a paid subscription:
  - **LAB PRO**: $99.99/mo (Full API access, unlimited models)
  - **ALL-ACCESS**: $299.99/mo (API + real-time data)

Upgrade at: https://lab-app.balldontlie.io/settings/billing

## Resources

- **Repository**: https://github.com/safyr04-design/balldontlie
- **Pull Request**: https://github.com/safyr04-design/balldontlie/pull/1
- **API Documentation**: https://lab.balldontlie.io/docs/
- **Discord Support**: https://discord.gg/cQJhfTPn8j

## What's Next?

1. ✅ **Explore the Dashboard** - Check out the beautiful UI
2. ✅ **Review the Code** - See the PR for implementation details
3. 🔄 **Upgrade API Key** - Get a paid subscription for full functionality
4. 🚀 **Deploy to Production** - Ready for deployment to any hosting platform

---

**Status**: ✅ Live and Ready
**Last Updated**: 2026-02-17
