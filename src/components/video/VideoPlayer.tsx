import { useTranslation } from "react-i18next"
import { Download, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface VideoPlayerProps {
  videoURL: string
  onCreateAnother?: () => void
}

export function VideoPlayer({ videoURL, onCreateAnother }: VideoPlayerProps) {
  const { t } = useTranslation()

  const handleDownload = () => {
    const a = document.createElement("a")
    a.href = videoURL
    a.download = `memory-alive-${Date.now()}.mp4`
    a.target = "_blank"
    a.click()
  }

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <p className="text-lg font-medium text-center text-green-600">
          {t("generate.success")}
        </p>
        <div className="rounded-lg overflow-hidden bg-black">
          <video
            src={videoURL}
            controls
            autoPlay
            loop
            className="w-full max-h-96 object-contain"
          />
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            {t("generate.download")}
          </Button>
          {onCreateAnother && (
            <Button variant="outline" onClick={onCreateAnother}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t("generate.tryAnother")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
