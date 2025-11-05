# 🚀 Production Quick Start Guide

Get your AI Real Estate Valuator running in production in **15 minutes**!

## Prerequisites Checklist

- [ ] Node.js 20+ installed
- [ ] Firebase account created
- [ ] OpenAI API key obtained
- [ ] Firebase CLI installed: `npm install -g firebase-tools`

## 5-Step Deployment

### Step 1: Clone and Install (2 min)

```bash
git clone <your-repo-url>
cd ai-real-estate-valuator
npm install
```

### Step 2: Create Firebase Project (3 min)

1. Go to https://console.firebase.google.com/
2. Click "Create Project"
3. Name it: `ai-real-estate-valuator`
4. Enable Firestore Database (Production mode)
5. Enable Firebase Storage
6. Enable Authentication

### Step 3: Get Your Credentials (5 min)

#### Get Firebase Service Account:
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file

#### Get OpenAI API Key:
1. Go to https://platform.openai.com/api-keys
2. Create new API key
3. Copy the key (starts with `sk-`)

### Step 4: Configure Environment (3 min)

Create `.env` file:

```env
# Firebase (REQUIRED)
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_SERVICE_ACCOUNT={"type":"service_account"...paste entire JSON here...}

# OpenAI (REQUIRED)
OPENAI_API_KEY=sk-your-openai-key-here
BUILT_IN_FORGE_API_URL=https://api.openai.com/v1
BUILT_IN_FORGE_API_KEY=sk-your-openai-key-here

# JWT Secret (generate random string)
JWT_SECRET=your-super-secret-random-string-here

# OAuth (use defaults or configure your own)
VITE_APP_ID=proj_abc123def456
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev

# App Config
VITE_APP_TITLE="AI Real Estate Valuator"
PORT=3000
```

**Quick tip:** Replace `your-project-id-here` with your actual Firebase project ID!

### Step 5: Deploy! (2 min)

#### Option A: Firebase Hosting (Easiest)

```bash
# Login to Firebase
firebase login

# Select your project
firebase use --add

# Deploy everything
firebase deploy

# Your app is live at: https://your-project-id.web.app 🎉
```

#### Option B: Docker (Most Flexible)

```bash
# Build
docker build -t real-estate-valuator .

# Run
docker run -p 3000:3000 --env-file .env real-estate-valuator

# Visit: http://localhost:3000 🎉
```

#### Option C: Local/VPS

```bash
# Build
npm run build

# Start
npm start

# Visit: http://localhost:3000 🎉
```

## Verification Checklist

After deployment, verify these work:

- [ ] Home page loads
- [ ] Can login/authenticate
- [ ] Can create new valuation
- [ ] Map loads and works
- [ ] AI generates valuation
- [ ] Can generate PDF report
- [ ] Can view valuation history

## Common Issues & Fixes

### ❌ "Firebase not initialized"
**Fix:** Check your `FIREBASE_PROJECT_ID` and `FIREBASE_SERVICE_ACCOUNT` are set correctly

### ❌ "OpenAI API error"
**Fix:** Verify your `OPENAI_API_KEY` is valid and has credits

### ❌ "Storage upload failed"
**Fix:** Ensure Firebase Storage is enabled and rules are deployed

### ❌ "Cannot read properties of undefined"
**Fix:** Run `firebase deploy --only firestore:rules,storage` to deploy security rules

## Production Checklist

Before going live:

- [ ] Environment variables secured
- [ ] Firestore rules deployed
- [ ] Storage rules deployed
- [ ] SSL/HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] API rate limits set

## Costs

### Estimated Monthly Costs (1000 users):

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Firebase Firestore | 50K reads, 20K writes/day | $0-25/month |
| Firebase Storage | 5GB, 1GB downloads | $0-10/month |
| Firebase Hosting | 10GB bandwidth | $0/month |
| OpenAI API | No free tier | $50-200/month |
| **Total** | - | **$50-235/month** |

### Cost Optimization Tips:
- Cache AI responses to reduce OpenAI calls
- Use Firestore wisely (batch reads)
- Compress images before storage
- Set up billing alerts

## Scaling

As you grow:

1. **0-1K users:** Free Firebase tier + Basic OpenAI
2. **1K-10K users:** Upgrade Firebase, optimize API calls
3. **10K+ users:** Consider Cloud Run for auto-scaling
4. **100K+ users:** Multi-region deployment, CDN

## Support

Need help?

- 📖 Full guide: See `DEPLOYMENT.md`
- 🐛 Issues: Check application logs
- 💬 Community: GitHub Issues
- 📧 Contact: support@yourdomain.com

## Next Steps

After deployment:

1. ✅ Test all features
2. 📊 Set up analytics
3. 🔍 Configure error tracking
4. 📈 Monitor performance
5. 🎨 Customize branding
6. 🌍 Add more languages
7. 🚀 Launch marketing!

---

**🎉 Congratulations! You're now live in production!**

Share your deployment URL and start valuing properties! 🏠💰

---

*Last updated: 2025-10-24*
