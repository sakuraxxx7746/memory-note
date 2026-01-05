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
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import HashtagLink from '@/components/atom/hashtag-link'
import { parseContentWithHashtags, isHashtag } from '@/lib/utils/parseContent'

interface memoryCardProps {
  key?: string
  memory: Tables<'memories'>
  onEdit: (values: Tables<'memories'>) => void
  className?: string
}

export default function MemoryCard({
  memory,
  onEdit,
  className,
}: memoryCardProps) {
  return (
    <Card className={`group break-inside-avoid mb-2 ${className}`}>
      <CardHeader>
        <CardTitle>{memory.title}</CardTitle>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap">
        {parseContentWithHashtags(memory.content ?? '').map((part, index) => {
          if (isHashtag(part)) {
            return <HashtagLink key={index} name={part.slice(1)} />
          }
          return <span key={index}>{part}</span>
        })}
      </CardContent>
      <CardFooter className="flex flex-row justify-between items-center">
        <CardDescription>
          {memory.updated_at
            ? format(new Date(memory.updated_at), 'yyyy年MM月dd日') + '更新'
            : '吉日'}
        </CardDescription>
        <Button variant="outline" size="sm" onClick={() => onEdit(memory)}>
          編集
        </Button>
      </CardFooter>
    </Card>
  )
}
