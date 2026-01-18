import Image from 'next/image'

interface CardImagePreviewProps {
  imageUrl: string
}

export default function CardImagePreview({ imageUrl }: CardImagePreviewProps) {
  return (
    <div className="relative inline-block">
      <Image
        src={imageUrl}
        alt="プレビュー"
        width={128}
        height={128}
        className="h-18 w-18 object-cover rounded-xs border"
        unoptimized
      />
    </div>
  )
}
