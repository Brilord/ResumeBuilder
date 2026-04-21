import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasConfig = !!firebaseConfig.apiKey && !!firebaseConfig.projectId

let auth: ReturnType<typeof getAuth> | null = null
let db: ReturnType<typeof getFirestore> | null = null
let googleProvider: GoogleAuthProvider | null = null

if (hasConfig) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    googleProvider = new GoogleAuthProvider()
    isSupported().then(yes => yes ? getAnalytics(app) : null)
  } catch (e) {
    console.warn('Firebase initialization failed — running in guest-only mode.', e)
  }
}

export { auth, db, googleProvider }
