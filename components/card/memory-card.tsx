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

interface memoryCardProps {
  key?: number
  memory: Tables<'memories'>
  onEdit: (values: Tables<'memories'>) => void
}

export default function MemoryCard({ memory, onEdit }: memoryCardProps) {
  return (
    <Card className="break-inside-avoid mb-2">
      <CardHeader>
        <CardTitle>{memory.title}</CardTitle>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap">
        {memory.content}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <CardDescription>
          更新日:
          {memory.updated_at
            ? format(new Date(memory.updated_at), 'yyyy年MM月dd日')
            : '吉日'}
        </CardDescription>
        <Button variant="outline" size="sm" onClick={() => onEdit(memory)}>
          編集
        </Button>
      </CardFooter>
    </Card>
  )
}
