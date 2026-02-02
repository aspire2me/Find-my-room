import { useState, useEffect } from "react"
import { auth, googleProvider, firebaseConfigured } from "@/config/firebase"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    const setup = async () => {
      const { onAuthStateChanged } = await import("firebase/auth")
      unsubscribe = onAuthStateChanged(auth!, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    }

    setup()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) {
      setError("Firebase is not configured")
      return
    }
    setError(null)
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth")
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const loginWithGoogle = async () => {
    if (!auth || !googleProvider) {
      setError("Firebase is not configured")
      return
    }
    setError(null)
    try {
      const { signInWithPopup } = await import("firebase/auth")
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!auth) {
      setError("Firebase is not configured")
      return
    }
    setError(null)
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth")
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  const logout = async () => {
    if (!auth) return
    setError(null)
    try {
      const { signOut } = await import("firebase/auth")
      await signOut(auth)
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
  }

  return { user, loading, error, loginWithEmail, loginWithGoogle, signUp, logout }
}
