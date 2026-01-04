'use client'

import { getHashtags } from '@/lib/api/getHashtags'
import { useState, useEffect } from 'react'
import { Tables } from '@/lib/types/supabase'
import { Label } from '@radix-ui/react-label'

interface RightSidebarProps {
  className?: string
}
export default function RightSidebar({ className }: RightSidebarProps) {
  const [hashtags, setHashtags] = useState<Array<Tables<'hashtags'>>>([])

  useEffect(() => {
    const fetchHashtags = async () => {
      const result = await getHashtags()

      if (!result.success) {
        console.log('ハッシュタグの取得に失敗:', result.error)
        return
      }

      setHashtags(result.data || [])
    }
    fetchHashtags()
  })
  return (
    <div className={`${className} `}>
      <h2 className="text-lg font-bold mb-2">ハッシュタグ</h2>
      {hashtags.map(hashtag => (
        <Label key={hashtag.id} className="m-1">
          #{hashtag.name}
        </Label>
      ))}
    </div>
  )
}
