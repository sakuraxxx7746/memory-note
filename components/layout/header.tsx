'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full">
      <Link href="/">
        <h1 className="text-2xl font-bold mb-4 cursor-pointer hover:opacity-80">
          ここが君の記憶の場所
        </h1>
      </Link>
    </header>
  )
}
