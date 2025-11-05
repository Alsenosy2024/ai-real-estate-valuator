# Production Deployment Guide

This guide will help you deploy the AI Real Estate Valuator to production with Firebase.

## Prerequisites

1. Node.js 20+ installed
2. Firebase CLI installed (`npm install -g firebase-tools`)
3. OpenAI API key (for AI features)
4. Firebase project created

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it: `ai-real-estate-valuator` (or your preferred name)
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firebase Services

### Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Production mode"
4. Select your preferred location (e.g., `us-central` for USA, `europe-west` for Europe)
5. Click "Enable"

### Enable Firebase Storage
1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Use default security rules
4. Select same location as Firestore
5. Click "Done"

### Enable Firebase Authentication
1. Go to "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Enable "Google" provider (optional)
5. Save

## Step 3: Get Firebase Configuration

### For Server (Node.js)

1. Go to Project Settings (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Copy the entire JSON content (it's one long line)

### Get Project ID
- In Project Settings > General, copy your "Project ID"

## Step 4: Configure Environment Variables

Create `.env` file in project root:

```env
# App Configuration
VITE_APP_ID=proj_your_app_id
VITE_OAUTH_PORTAL_URL=https://vida.butterfly-effect.dev
VITE_APP_TITLE="AI Real Estate Valuator"
VITE_APP_LOGO="https://your-logo-url.com/logo.png"

# OAuth Server
OAUTH_SERVER_URL=https://vidabiz.butterfly-effect.dev

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# OpenAI API
OPENAI_API_KEY=sk-your-openai-api-key-here

# Firebase Configuration
FIREBASE_PROJECT_ID=ai-real-estate-valuator
FIREBASE_STORAGE_BUCKET=ai-real-estate-valuator.appspot.com

# Firebase Service Account (paste entire JSON as one line)
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# LLM API
BUILT_IN_FORGE_API_URL=https://api.openai.com/v1
BUILT_IN_FORGE_API_KEY=sk-your-openai-api-key-here

# Server Port
PORT=3000
```

## Step 5: Install Dependencies

```bash
npm install
# or
pnpm install
```

## Step 6: Deploy Firestore Rules

```bash
firebase login
firebase use --add
# Select your project

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

## Step 7: Build for Production

```bash
npm run build
```

This will create:
- `dist/` folder with frontend build
- `dist/index.js` with backend bundle

## Step 8: Deploy Options

### Option A: Firebase Hosting + Cloud Functions

1. Deploy to Firebase:
```bash
firebase deploy
```

This deploys:
- Frontend to Firebase Hosting
- Backend to Cloud Functions
- Database rules to Firestore
- Storage rules to Cloud Storage

Your app will be live at: `https://your-project-id.web.app`

### Option B: Deploy to Cloud Run (Recommended for full-stack)

1. Build Docker image:
```bash
# Create Dockerfile if needed
docker build -t gcr.io/your-project-id/real-estate-valuator .

# Push to Google Container Registry
docker push gcr.io/your-project-id/real-estate-valuator
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy real-estate-valuator \
  --image gcr.io/your-project-id/real-estate-valuator \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="FIREBASE_PROJECT_ID=your-project-id"
```

### Option C: Deploy to Your Own Server

1. Copy the built files to your server:
```bash
scp -r dist/ user@your-server:/var/www/real-estate-valuator/
```

2. Install dependencies on server:
```bash
ssh user@your-server
cd /var/www/real-estate-valuator
npm install --production
```

3. Set up environment variables on server

4. Run with PM2:
```bash
pm2 start dist/index.js --name real-estate-valuator
pm2 save
pm2 startup
```

## Step 9: Configure Custom Domain (Optional)

### For Firebase Hosting:
1. In Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

### For Cloud Run:
1. In Cloud Run console, click your service
2. Click "Manage Custom Domains"
3. Add your domain and configure DNS

## Step 10: Test Your Deployment

1. Visit your deployment URL
2. Test authentication flow
3. Create a test valuation
4. Generate a PDF report
5. Verify all features work

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_PROJECT_ID` | Yes | Your Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | Yes | Storage bucket name |
| `FIREBASE_SERVICE_ACCOUNT` | Yes (server) | Service account JSON |
| `OPENAI_API_KEY` | Yes | OpenAI API key for AI features |
| `JWT_SECRET` | Yes | Secret for JWT tokens |
| `OAUTH_SERVER_URL` | Yes | OAuth server URL |
| `VITE_APP_ID` | Yes | App ID for OAuth |
| `PORT` | No | Server port (default: 3000) |

## Monitoring and Maintenance

### View Logs

**Firebase:**
```bash
firebase functions:log
```

**Cloud Run:**
```bash
gcloud logging read "resource.type=cloud_run_revision"
```

### Monitor Database Usage
- Go to Firebase Console > Firestore Database
- Check "Usage" tab for reads/writes

### Monitor Storage Usage
- Go to Firebase Console > Storage
- Check usage and set up billing alerts

## Security Checklist

- ✅ Firestore rules deployed
- ✅ Storage rules deployed
- ✅ JWT secret is strong and unique
- ✅ API keys are not exposed in frontend
- ✅ CORS configured properly
- ✅ Rate limiting enabled (if using Cloud Run)
- ✅ SSL/HTTPS enabled
- ✅ Environment variables secured

## Troubleshooting

### Firebase Permission Errors
- Verify service account has correct roles
- Check Firestore rules are deployed
- Ensure project ID is correct

### Storage Upload Fails
- Check Storage rules
- Verify bucket name is correct
- Ensure service account has Storage Admin role

### AI Features Not Working
- Verify OpenAI API key is valid
- Check API quota and billing
- Review error logs

## Cost Estimation

### Firebase (Free Tier)
- Firestore: 50K reads, 20K writes per day
- Storage: 5GB, 1GB downloads per day
- Hosting: 10GB bandwidth per month

### Firebase (Pay-as-you-go)
- Firestore: $0.06 per 100K reads, $0.18 per 100K writes
- Storage: $0.026/GB per month, $0.12/GB downloads
- Cloud Functions: $0.40 per million invocations

### OpenAI API
- GPT-4: ~$0.03 per 1K input tokens, ~$0.06 per 1K output tokens
- GPT-3.5-turbo: ~$0.001 per 1K tokens

## Support

For issues or questions:
- Check Firebase Console logs
- Review application logs
- Check GitHub Issues
- Contact support team

## Next Steps

After deployment:
1. Monitor application performance
2. Set up error tracking (Sentry, etc.)
3. Configure backup strategy
4. Set up CI/CD pipeline
5. Implement analytics
6. Add more AI features
7. Scale as needed

---

**Congratulations! Your AI Real Estate Valuator is now in production! 🎉**
