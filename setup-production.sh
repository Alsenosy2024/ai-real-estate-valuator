#!/bin/bash

# Production Setup Script for AI Real Estate Valuator
# This script helps set up the production environment

set -e

echo "🚀 AI Real Estate Valuator - Production Setup"
echo "=============================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found!"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
echo "🔐 Checking Firebase authentication..."
if ! firebase projects:list &> /dev/null; then
    echo "Please login to Firebase:"
    firebase login
fi

# Select or create Firebase project
echo ""
echo "📋 Firebase Project Setup"
firebase use --add

# Get project info
PROJECT_ID=$(firebase use | grep "active" | awk '{print $4}' | tr -d '()')
echo "Using project: $PROJECT_ID"

# Deploy Firestore rules
echo ""
echo "📝 Deploying Firestore rules..."
firebase deploy --only firestore:rules --project $PROJECT_ID

# Deploy Firestore indexes
echo "📊 Deploying Firestore indexes..."
firebase deploy --only firestore:indexes --project $PROJECT_ID

# Deploy Storage rules
echo "💾 Deploying Storage rules..."
firebase deploy --only storage --project $PROJECT_ID

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from example..."
    cp .env.example .env
    echo ""
    echo "⚙️  Please edit .env file and add:"
    echo "   - FIREBASE_PROJECT_ID=$PROJECT_ID"
    echo "   - FIREBASE_STORAGE_BUCKET=$PROJECT_ID.appspot.com"
    echo "   - OPENAI_API_KEY (your OpenAI API key)"
    echo "   - FIREBASE_SERVICE_ACCOUNT (service account JSON)"
    echo ""
    echo "To get service account:"
    echo "1. Go to Firebase Console > Project Settings > Service Accounts"
    echo "2. Click 'Generate new private key'"
    echo "3. Copy the JSON content to FIREBASE_SERVICE_ACCOUNT in .env"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install || npm install

# Build the application
echo ""
echo "🏗️  Building production bundle..."
pnpm run build || npm run build

echo ""
echo "✅ Production setup complete!"
echo ""
echo "Next steps:"
echo "1. Review .env configuration"
echo "2. Test locally: npm start"
echo "3. Deploy to Firebase: firebase deploy"
echo "   OR deploy to Cloud Run: see DEPLOYMENT.md"
echo ""
echo "📚 Full deployment guide: see DEPLOYMENT.md"
echo ""
