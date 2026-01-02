'use client'

import { Tables } from '@/lib/types/supabase'

interface postCardProps {
  key?: number
  post?: Tables<'posts'>
}

export default function PostCard({ post }: postCardProps) {
  return <div>{post?.title}</div>
}
