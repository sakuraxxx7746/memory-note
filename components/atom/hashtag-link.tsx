import Link from 'next/link'

interface HashtagLinkProps {
  name: string
  className?: string
}

export default function HashtagLink({ name, className }: HashtagLinkProps) {
  return (
    <Link
      href={`/?tag=${name}`}
      className={`inline-block mr-1 text-sm hover:underline ${className || ''}`}
    >
      #{name}
    </Link>
  )
}
