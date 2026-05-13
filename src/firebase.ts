import type { Auth, GoogleAuthProvider } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

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

export interface FirebaseServices {
  auth: Auth | null
  db: Firestore | null
  googleProvider: GoogleAuthProvider | null
}

let servicesPromise: Promise<FirebaseServices> | null = null

export async function getFirebaseServices(): Promise<FirebaseServices> {
  if (!hasConfig) {
    return { auth: null, db: null, googleProvider: null }
  }

  servicesPromise ??= initializeFirebase()
  return servicesPromise
}

async function initializeFirebase(): Promise<FirebaseServices> {
  try {
    const [{ initializeApp }, { getAuth, GoogleAuthProvider }, { getFirestore }] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ])
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    const db = getFirestore(app)
    const googleProvider = new GoogleAuthProvider()

    import('firebase/analytics')
      .then(({ getAnalytics, isSupported }) => {
        isSupported().then(yes => yes ? getAnalytics(app) : null)
      })
      .catch(() => {})

    return { auth, db, googleProvider }
  } catch (e) {
    console.warn('Firebase initialization failed — running in guest-only mode.', e)
    return { auth: null, db: null, googleProvider: null }
  }
}
