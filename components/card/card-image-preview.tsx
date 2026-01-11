import Image from 'next/image'

interface CardImagePreviewProps {
  imageUrl: string | null
}

export default function CardImagePreview({
  imageUrl = null,
}: CardImagePreviewProps) {
  return (
    <div className="relative inline-block">
      <Image
        src={imageUrl ?? ''}
        alt="プレビュー"
        width={128}
        height={128}
        className="h-32 w-32 object-cover rounded-md border"
        unoptimized
      />
    </div>
  )
}
