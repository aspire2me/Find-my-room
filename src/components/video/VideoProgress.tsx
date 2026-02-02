import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface VideoProgressProps {
  message: string
}

export function VideoProgress({ message }: VideoProgressProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-lg font-medium">{message || t("generate.generating")}</p>
        <p className="text-sm text-muted-foreground">{t("generate.estimatedTime")}</p>
      </CardContent>
    </Card>
  )
}
