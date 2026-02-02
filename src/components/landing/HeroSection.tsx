import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export function HeroSection() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCTA = () => {
    navigate(user ? "/generate" : "/login")
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="container mx-auto px-4 text-center relative">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI-Powered Photo Animation</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
          {t("landing.title")}
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl mb-8">
          {t("landing.subtitle")}
        </p>
        <Button size="lg" onClick={handleCTA} className="text-lg px-8 py-6">
          {t("landing.cta")}
        </Button>
      </div>
    </section>
  )
}
