import { useTranslation } from "react-i18next"
import { Upload, Wand2, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { icon: Upload, titleKey: "landing.step1Title", descKey: "landing.step1Desc" },
  { icon: Wand2, titleKey: "landing.step2Title", descKey: "landing.step2Desc" },
  { icon: Download, titleKey: "landing.step3Title", descKey: "landing.step3Desc" },
]

export function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">{t("landing.howItWorks")}</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          {t("landing.demoSubtitle")}
        </p>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="text-center border-0 shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="mb-2 text-sm font-semibold text-primary">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{t(step.titleKey)}</h3>
                <p className="text-muted-foreground">{t(step.descKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
