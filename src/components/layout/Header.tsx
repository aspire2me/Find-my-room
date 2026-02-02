import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Film, Globe, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/hooks/useLanguage"

export function Header() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Film className="h-6 w-6 text-primary" />
          <span>{t("common.appName")}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t("common.home")}
          </Link>
          {user && (
            <>
              <Link to="/generate" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("common.generate")}
              </Link>
              <Link to="/gallery" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {t("common.gallery")}
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleLanguage} title="Toggle language">
            <Globe className="h-4 w-4" />
            <span className="sr-only">Language</span>
          </Button>
          <span className="text-xs text-muted-foreground">{currentLanguage.toUpperCase()}</span>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user.displayName || user.email}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout} title={t("common.logout")}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate("/login")}>
              {t("common.login")}
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          <Link
            to="/"
            className="block text-sm font-medium py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("common.home")}
          </Link>
          {user && (
            <>
              <Link
                to="/generate"
                className="block text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.generate")}
              </Link>
              <Link
                to="/gallery"
                className="block text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("common.gallery")}
              </Link>
            </>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 mr-1" />
              {currentLanguage.toUpperCase()}
            </Button>
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                {t("common.logout")}
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  navigate("/login")
                  setMobileMenuOpen(false)
                }}
              >
                {t("common.login")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
