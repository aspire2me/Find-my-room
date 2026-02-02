import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
}

export function PromptInput({ value, onChange }: PromptInputProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">{t("generate.promptLabel")}</Label>
      <Input
        id="prompt"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("generate.promptPlaceholder")}
        maxLength={200}
      />
    </div>
  )
}
