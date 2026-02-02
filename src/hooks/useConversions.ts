import { useState, useEffect } from "react"
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Timestamp,
} from "firebase/firestore"
import { db } from "@/config/firebase"
import { useAuth } from "@/hooks/useAuth"
import type { Conversion } from "@/types"

export function useConversions() {
  const { user } = useAuth()
  const [conversions, setConversions] = useState<Conversion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setConversions([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "conversions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const d = doc.data()
        return {
          id: doc.id,
          ...d,
          createdAt: (d.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (d.updatedAt as Timestamp)?.toDate() || new Date(),
          completedAt: (d.completedAt as Timestamp)?.toDate() || null,
        } as Conversion
      })
      setConversions(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])

  return { conversions, loading }
}
