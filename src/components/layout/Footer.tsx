import { useTranslation } from "react-i18next"
import { Film } from "lucide-react"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto flex flex-col items-center gap-2 py-6 px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4" />
          <span className="font-semibold">{t("common.appName")}</span>
        </div>
        <p>&copy; {new Date().getFullYear()} Memory Alive. All rights reserved.</p>
      </div>
    </footer>
  )
}
