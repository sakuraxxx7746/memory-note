import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewProps {
  imageUrl: string
  onRemove: () => void
}

export default function ImagePreview({
  imageUrl,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="relative inline-block">
      <Image
        src={imageUrl}
        alt="プレビュー"
        width={128}
        height={128}
        className="h-32 w-32 object-cover rounded-md border"
        unoptimized
      />
      <Button
        type="button"
        size="icon"
        variant="destructive"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}
