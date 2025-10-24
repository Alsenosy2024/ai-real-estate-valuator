import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

let app: App;
let db: Firestore;

export function initializeFirebase() {
  if (getApps().length === 0) {
    try {
      // Try to initialize with service account from environment variable
      if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        app = initializeApp({
          credential: cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
        console.log('[Firebase] Initialized with service account');
      } else if (process.env.FIREBASE_PROJECT_ID) {
        // Initialize with application default credentials (for Cloud Run, App Engine, etc.)
        app = initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID,
          storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
        });
        console.log('[Firebase] Initialized with default credentials');
      } else {
        throw new Error('Firebase configuration missing. Please set FIREBASE_PROJECT_ID or FIREBASE_SERVICE_ACCOUNT');
      }
    } catch (error) {
      console.error('[Firebase] Initialization failed:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }

  db = getFirestore(app);
  // Enable offline persistence for better performance
  db.settings({ ignoreUndefinedProperties: true });
  
  return { app, db };
}

export function getFirebaseDB(): Firestore {
  if (!db) {
    const { db: firebaseDb } = initializeFirebase();
    return firebaseDb;
  }
  return db;
}

export function getFirebaseStorage() {
  return getStorage(app);
}

// Initialize on module load
initializeFirebase();
