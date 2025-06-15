// lib/firebase.ts
// This file initializes the Firebase client-side SDK.
// For server-side operations (e.g., in Server Actions or API routes),
// you would typically use the Firebase Admin SDK, which has a different setup.

import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage" // For image storage
import { getAnalytics } from "firebase/analytics" // For analytics

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
  authDomain: "ice-tool-83c19.firebaseapp.com",
  projectId: "ice-tool-83c19",
  storageBucket: "ice-tool-83c19.firebasestorage.app",
  messagingSenderId: "710566798225",
  appId: "1:710566798225:web:b90246b181fcbbeb66f030",
  measurementId: "G-0J1TW2EDY9",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const storage = getStorage(app)

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

async function uploadImage(file: File) {
  const storageRef = storage.ref();
  const fileRef = storageRef.child(file.name);
  await fileRef.put(file);
  return await fileRef.getDownloadURL();
}

async function submitReport(reportData: any, imageFiles: File[]) {
  const imageUrls = await Promise.all(imageFiles.map(file => uploadImage(file)));
  const reportWithImages = {
    ...reportData,
    images: imageUrls,
  };
  // Submit reportWithImages to Firestore
}

export { app, db, storage, analytics }
