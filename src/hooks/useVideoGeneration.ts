import { useState, useRef, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"
import { storage, db, functions, firebaseConfigured } from "@/config/firebase"
import { useAuth } from "@/hooks/useAuth"
import type { ConversionStatus, PollStatusResponse } from "@/types"

interface VideoGenerationState {
  status: ConversionStatus | "idle"
  progress: string
  videoURL: string | null
  error: string | null
  conversionId: string | null
}

export function useVideoGeneration() {
  const { user } = useAuth()
  const [state, setState] = useState<VideoGenerationState>({
    status: "idle",
    progress: "",
    videoURL: null,
    error: null,
    conversionId: null,
  })
  const pollingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
      pollingRef.current = null
    }
  }, [])

  const pollStatus = useCallback(
    async (conversionId: string) => {
      if (!functions) return
      try {
        const { httpsCallable } = await import("firebase/functions")
        const pollVideoStatus = httpsCallable<{ conversionId: string }, PollStatusResponse>(
          functions,
          "pollVideoStatus"
        )
        const result = await pollVideoStatus({ conversionId })
        const data = result.data

        if (data.status === "succeeded" && data.videoURL) {
          setState((prev) => ({
            ...prev,
            status: "succeeded",
            progress: "",
            videoURL: data.videoURL!,
          }))
          return
        }

        if (data.status === "failed") {
          setState((prev) => ({
            ...prev,
            status: "failed",
            progress: "",
            error: data.error || "Video generation failed",
          }))
          return
        }

        pollingRef.current = setTimeout(() => pollStatus(conversionId), 5000)
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "failed",
          progress: "",
          error: (err as Error).message,
        }))
      }
    },
    []
  )

  const startGeneration = useCallback(
    async (file: File, promptText?: string) => {
      if (!user) return

      if (!firebaseConfigured || !storage || !db || !functions) {
        setState((prev) => ({
          ...prev,
          status: "failed",
          error: "Firebase is not configured. Please set up Firebase credentials.",
        }))
        return
      }

      setState({
        status: "uploading",
        progress: "Uploading photo...",
        videoURL: null,
        error: null,
        conversionId: null,
      })

      try {
        const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
        const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
        const { httpsCallable } = await import("firebase/functions")

        const fileId = uuidv4()
        const ext = file.name.split(".").pop()
        const storagePath = `users/${user.uid}/photos/${fileId}.${ext}`
        const storageRef = ref(storage, storagePath)

        await uploadBytes(storageRef, file)
        const photoURL = await getDownloadURL(storageRef)

        setState((prev) => ({ ...prev, progress: "Creating conversion record..." }))

        const docRef = await addDoc(collection(db, "conversions"), {
          userId: user.uid,
          status: "uploading",
          originalPhotoURL: photoURL,
          originalPhotoPath: storagePath,
          promptText: promptText || null,
          runwayTaskId: null,
          generatedVideoURL: null,
          generatedVideoPath: null,
          duration: 5,
          model: "gen3a_turbo",
          errorMessage: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          completedAt: null,
        })

        const conversionId = docRef.id
        setState((prev) => ({
          ...prev,
          status: "processing",
          progress: "Generating video...",
          conversionId,
        }))

        const generateVideo = httpsCallable(functions, "generateVideo")
        await generateVideo({
          conversionId,
          photoURL,
          promptText: promptText || undefined,
          duration: 5,
        })

        pollStatus(conversionId)
      } catch (err) {
        setState((prev) => ({
          ...prev,
          status: "failed",
          progress: "",
          error: (err as Error).message,
        }))
      }
    },
    [user, pollStatus]
  )

  const reset = useCallback(() => {
    stopPolling()
    setState({
      status: "idle",
      progress: "",
      videoURL: null,
      error: null,
      conversionId: null,
    })
  }, [stopPolling])

  return { ...state, startGeneration, reset, stopPolling }
}
