'use client'

import { Tables } from '@/lib/types/supabase'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

interface postCardProps {
  key?: number
  post?: Tables<'posts'>
}

export default function PostCard({ post }: postCardProps) {
  return (
    <Card className="break-inside-avoid mb-2">
      <CardHeader>
        <CardTitle>{post?.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post?.content}</p>
      </CardContent>
      <CardFooter>
        <CardDescription>更新日: {post?.updated_at}</CardDescription>
      </CardFooter>
    </Card>
  )
}
