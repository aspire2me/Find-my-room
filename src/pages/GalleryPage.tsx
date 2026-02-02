import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Plus, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/video/VideoCard"
import { useConversions } from "@/hooks/useConversions"

export function GalleryPage() {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">{t("gallery.title")}</h1>
        <Button onClick={() => navigate("/generate")}>
          <Plus className="h-4 w-4 mr-2" />
          {t("gallery.emptyAction")}
        </Button>
      </div>

      {conversions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Film className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground mb-4">{t("gallery.empty")}</p>
          <Button onClick={() => navigate("/generate")}>
            {t("gallery.emptyAction")}
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {conversions.map((conversion) => (
            <VideoCard key={conversion.id} conversion={conversion} />
          ))}
        </div>
      )}
    </div>
  )
}
