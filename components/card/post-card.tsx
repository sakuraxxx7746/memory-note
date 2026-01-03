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
import { PostFormValues } from '@/lib/schemas/post'
import { Button } from '@/components/ui/button'

interface postCardProps {
  key?: number
  post: Tables<'posts'>
  onEdit: (values: Tables<'posts'>) => void
}

export default function PostCard({ post, onEdit }: postCardProps) {
  return (
    <Card className="break-inside-avoid mb-2">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
      </CardContent>
      <CardFooter>
        <CardDescription>
          <span>更新日: {post.updated_at}</span>
          <Button onClick={() => onEdit(post)}>編集</Button>
        </CardDescription>
      </CardFooter>
    </Card>
  )
}
