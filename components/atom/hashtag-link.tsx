import Link from 'next/link'

interface HashtagLinkProps {
  name: string
  className?: string
}

export default function HashtagLink({ name, className }: HashtagLinkProps) {
  return (
    <Link
      href={`/?tag=${name}`}
      className={`inline-block mr-1 text-sm text-slate-500 hover:text-slate-700 hover:underline ${className || ''}`}
    >
      #{name}
    </Link>
  )
}
