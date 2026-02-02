import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useTranslation } from "react-i18next"
import { Upload } from "lucide-react"

interface PhotoDropzoneProps {
  onFileSelected: (file: File) => void
  disabled?: boolean
}

export function PhotoDropzone({ onFileSelected, disabled }: PhotoDropzoneProps) {
  const { t } = useTranslation()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0])
      }
    },
    [onFileSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
        transition-colors
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-lg font-medium mb-2">{t("generate.dropzone")}</p>
      <p className="text-sm text-muted-foreground">{t("generate.supportedFormats")}</p>
    </div>
  )
}
