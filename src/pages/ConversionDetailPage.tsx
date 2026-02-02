import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Download, ImageIcon, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useConversions } from "@/hooks/useConversions"

export function ConversionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const { conversions, loading } = useConversions()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const conversion = conversions.find((c) => c.id === id)

  if (!conversion) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Memory not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/gallery")}>
          {t("common.back")}
        </Button>
      </div>
    )
  }

  const handleDownload = () => {
    if (!conversion.generatedVideoURL) return
    const a = document.createElement("a")
    a.href = conversion.generatedVideoURL
    a.download = `memory-alive-${conversion.id}.mp4`
    a.target = "_blank"
    a.click()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/gallery")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t("common.back")}
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <div className="p-3 border-b flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("landing.before")}</span>
            </div>
            {conversion.originalPhotoURL ? (
              <img
                src={conversion.originalPhotoURL}
                alt="Original"
                className="w-full aspect-video object-contain bg-muted"
              />
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardContent className="p-0">
            <div className="p-3 border-b flex items-center gap-2">
              <Film className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("landing.after")}</span>
            </div>
            {conversion.generatedVideoURL ? (
              <video
                src={conversion.generatedVideoURL}
                controls
                autoPlay
                loop
                className="w-full aspect-video object-contain bg-black"
              />
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Film className="h-8 w-8 text-muted-foreground/50" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {conversion.status === "processing"
                    ? t("gallery.processing")
                    : conversion.status === "failed"
                    ? t("gallery.failed")
                    : ""}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center mt-6 gap-3">
        {conversion.generatedVideoURL && (
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            {t("common.download")}
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate("/generate")}>
          {t("generate.tryAnother")}
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {conversion.createdAt.toLocaleString()}
        {conversion.promptText && (
          <p className="mt-1 italic">"{conversion.promptText}"</p>
        )}
      </div>
    </div>
  )
}
