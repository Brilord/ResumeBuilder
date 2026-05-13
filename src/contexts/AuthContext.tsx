import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { getFirebaseServices } from '../firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let unsub: (() => void) | undefined

    getFirebaseServices()
      .then(async ({ auth }) => {
        if (!active) return
        if (!auth) {
          setLoading(false)
          return
        }
        const { onAuthStateChanged } = await import('firebase/auth')
        if (!active) return
        unsub = onAuthStateChanged(auth, (u) => {
          setUser(u)
          setLoading(false)
        })
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
      unsub?.()
    }
  }, [])

  const signInWithGoogle = async () => {
    const { auth, googleProvider } = await getFirebaseServices()
    if (!auth || !googleProvider) return
    const { signInWithPopup } = await import('firebase/auth')
    await signInWithPopup(auth, googleProvider)
  }

  const logout = async () => {
    const { auth } = await getFirebaseServices()
    if (!auth) return
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
