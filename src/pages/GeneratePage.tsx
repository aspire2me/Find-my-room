import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhotoDropzone } from "@/components/upload/PhotoDropzone"
import { ImagePreview } from "@/components/upload/ImagePreview"
import { PromptInput } from "@/components/upload/PromptInput"
import { VideoProgress } from "@/components/video/VideoProgress"
import { VideoPlayer } from "@/components/video/VideoPlayer"
import { useVideoGeneration } from "@/hooks/useVideoGeneration"

export function GeneratePage() {
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [promptText, setPromptText] = useState("")
  const { status, progress, videoURL, error, startGeneration, reset } = useVideoGeneration()

  const handleGenerate = () => {
    if (!selectedFile) return
    startGeneration(selectedFile, promptText || undefined)
  }

  const handleCreateAnother = () => {
    setSelectedFile(null)
    setPromptText("")
    reset()
  }

  const isProcessing = status === "uploading" || status === "processing"

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            {t("generate.title")}
          </CardTitle>
          <CardDescription>{t("generate.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "succeeded" && videoURL ? (
            <VideoPlayer videoURL={videoURL} onCreateAnother={handleCreateAnother} />
          ) : isProcessing ? (
            <VideoProgress message={progress} />
          ) : (
            <>
              {selectedFile ? (
                <ImagePreview file={selectedFile} onRemove={() => setSelectedFile(null)} />
              ) : (
                <PhotoDropzone onFileSelected={setSelectedFile} />
              )}

              <PromptInput value={promptText} onChange={setPromptText} />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!selectedFile || isProcessing}
                className="w-full"
                size="lg"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {t("generate.generate")}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
