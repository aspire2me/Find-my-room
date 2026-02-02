import { useTranslation } from "react-i18next"

export function useLanguage() {
  const { i18n } = useTranslation()

  const currentLanguage = i18n.language?.startsWith("ko") ? "ko" : "en"

  const toggleLanguage = () => {
    const next = currentLanguage === "en" ? "ko" : "en"
    i18n.changeLanguage(next)
  }

  const setLanguage = (lang: "en" | "ko") => {
    i18n.changeLanguage(lang)
  }

  return { currentLanguage, toggleLanguage, setLanguage }
}
