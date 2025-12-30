import React from 'react' // React 名前空間をインポート
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Memory Note',
  description: 'Personal memory note app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  )
}
