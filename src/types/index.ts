export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export type ConversionStatus = "uploading" | "processing" | "succeeded" | "failed"

export interface Conversion {
  id: string
  userId: string
  status: ConversionStatus
  originalPhotoURL: string
  originalPhotoPath: string
  promptText: string | null
  runwayTaskId: string | null
  generatedVideoURL: string | null
  generatedVideoPath: string | null
  duration: number
  model: string
  errorMessage: string | null
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
}

export interface GenerateVideoRequest {
  conversionId: string
  photoURL: string
  promptText?: string
  duration?: number
}

export interface PollStatusRequest {
  conversionId: string
}

export interface PollStatusResponse {
  status: ConversionStatus
  videoURL?: string
  error?: string
  runwayStatus?: string
}
