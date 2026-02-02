import { useTranslation } from "react-i18next"
import { ImageIcon, Film } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function DemoSection() {
  const { t } = useTranslation()

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{t("landing.demoTitle")}</h2>
        <p className="text-center text-muted-foreground mb-12">
          {t("landing.demoSubtitle")}
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-muted flex flex-col items-center justify-center gap-3">
                <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                <span className="text-sm font-medium text-muted-foreground">
                  {t("landing.before")}
                </span>
                <p className="text-xs text-muted-foreground/70 px-4 text-center">
                  Still photograph
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/15 flex flex-col items-center justify-center gap-3">
                <Film className="h-12 w-12 text-primary/70" />
                <span className="text-sm font-medium text-primary">
                  {t("landing.after")}
                </span>
                <p className="text-xs text-muted-foreground px-4 text-center">
                  5-second animated video
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
