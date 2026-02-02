import { useState, useEffect } from "react"
import { db, firebaseConfigured } from "@/config/firebase"
import { useAuth } from "@/hooks/useAuth"
import type { Conversion } from "@/types"

export function useConversions() {
  const { user } = useAuth()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || !firebaseConfigured || !db) {
      setConversions([])
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    const setup = async () => {
      const { collection, query, where, orderBy, onSnapshot, Timestamp } = await import("firebase/firestore")

      const q = query(
        collection(db!, "conversions"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      )

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => {
            const d = doc.data()
            return {
              id: doc.id,
              ...d,
              createdAt: (d.createdAt instanceof Timestamp) ? d.createdAt.toDate() : new Date(),
              updatedAt: (d.updatedAt instanceof Timestamp) ? d.updatedAt.toDate() : new Date(),
              completedAt: (d.completedAt instanceof Timestamp) ? d.completedAt.toDate() : null,
            } as Conversion
          })
          setConversions(data)
          setLoading(false)
        },
        () => {
          setLoading(false)
        }
      )
    }

    setup()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user])

  return { conversions, loading }
}
