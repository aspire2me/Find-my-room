import { useTranslation } from "react-i18next"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImagePreviewProps {
  file: File
  onRemove: () => void
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const { t } = useTranslation()
  const previewUrl = URL.createObjectURL(file)

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <img
        src={previewUrl}
        alt="Preview"
        className="w-full max-h-96 object-contain bg-muted"
        onLoad={() => URL.revokeObjectURL(previewUrl)}
      />
      <Button
        variant="secondary"
        size="sm"
        className="absolute top-2 right-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4 mr-1" />
        {t("generate.changePhoto")}
      </Button>
    </div>
  )
}
