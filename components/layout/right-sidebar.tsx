'use client'

import { getHashtags } from '@/lib/api/getHashtags'
import { useState, useEffect } from 'react'
import { Tables } from '@/lib/types/supabase'
import HashtagLink from '@/components/atom/hashtag-link'

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
  }, [])

  return (
    <div className={`${className} `}>
      {hashtags.map(hashtag => (
        <HashtagLink key={hashtag.id} name={hashtag.name} />
      ))}
    </div>
  )
}
