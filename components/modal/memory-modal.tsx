'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { memorySchema, MemoryFormValues } from '@/lib/schemas/memory'
import { Tables } from '@/lib/types/supabase'

interface MemoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemory: (values: MemoryFormValues) => void
  memory?: Tables<'memories'> | null
  onCancel?: () => void
}

export function MemoryModal({
  open,
  onOpenChange,
  onMemory,
  memory,
  onCancel,
}: MemoryModalProps) {
  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  // memoryが変更されたときにフォームの値を更新
  useEffect(() => {
    if (memory) {
      form.reset({
        id: memory.id,
        title: memory.title || '',
        content: memory.content || '',
      })
    } else if (!open) {
      // モーダルが閉じたときにフォームをクリア
      form.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memory, open])

  const handleCancel = () => {
    // フォームの値は削除せず、モーダルを閉じる
    onOpenChange(false)
    onCancel?.()
  }

  const handleSubmit = (values: MemoryFormValues) => {
    // 親にtitleとcontentを返す
    onMemory(values)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>投稿</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="投稿タイトル" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="内容"
                      maxLength={1000}
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                  <p className="text-sm text-gray-500">
                    {field.value.length} / 1000文字
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
              <Button type="submit">投稿</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
