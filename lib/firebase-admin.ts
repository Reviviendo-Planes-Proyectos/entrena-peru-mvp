import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import * as path from 'path';
import * as fs from 'fs';

// Load service account key
const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin SDK
const firebaseAdminConfig = {
  credential: cert(serviceAccount as any),
  projectId: serviceAccount.project_id,
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
};

// Initialize the app if it hasn't been initialized yet
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

// Exportar servicios de Firebase Admin
export const adminAuth = getAuth()
export const adminDb = getFirestore()
export const adminStorage = getStorage()