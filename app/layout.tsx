import React from 'react' // React 名前空間をインポート
import type { Metadata } from 'next'
import './globals.css'
import RightSidebar from '@/components/layout/right-sidebar'
import Header from '@/components/layout/header'

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
      <body>
        <Header />
        <div className="flex min-h-screen">
          <main className="flex-1 md:flex-[8] min-w-0">{children}</main>
          <aside className="hidden md:block md:flex-[2]">
            <RightSidebar />
          </aside>
        </div>
      </body>
    </html>
  )
}
