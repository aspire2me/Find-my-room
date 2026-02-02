import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Film, Clock, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { Conversion } from "@/types"

interface VideoCardProps {
  conversion: Conversion
}

const statusConfig = {
  uploading: { icon: Clock, color: "text-yellow-500", key: "gallery.processing" },
  processing: { icon: Clock, color: "text-yellow-500", key: "gallery.processing" },
  succeeded: { icon: CheckCircle2, color: "text-green-500", key: "gallery.completed" },
  failed: { icon: XCircle, color: "text-red-500", key: "gallery.failed" },
}

export function VideoCard({ conversion }: VideoCardProps) {
  const { t } = useTranslation()
  const config = statusConfig[conversion.status]
  const StatusIcon = config.icon

  return (
    <Link to={`/gallery/${conversion.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-0">
          <div className="aspect-video relative">
            {conversion.originalPhotoURL ? (
              <img
                src={conversion.originalPhotoURL}
                alt="Original photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Film className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
              <StatusIcon className={`h-3 w-3 ${config.color}`} />
              <span className="text-xs font-medium">{t(config.key)}</span>
            </div>
          </div>
          <div className="p-3">
            <p className="text-xs text-muted-foreground">
              {conversion.createdAt.toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
