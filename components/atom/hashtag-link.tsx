import Link from 'next/link'

interface HashtagLinkProps {
  name: string
  className?: string
}

export default function HashtagLink({ name, className }: HashtagLinkProps) {
  return (
    <Link
      href={`/?tag=${name}`}
      className={`inline-block m-1 hover:underline ${className || ''}`}
    >
      #{name}
    </Link>
  )
}
