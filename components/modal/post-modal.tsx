'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { postSchema, PostFormValues } from '@/lib/schemas/post'

interface PostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPost: (title: string, content: string) => void
  onCancel?: () => void
}

export function PostModal({
  open,
  onOpenChange,
  onPost,
  onCancel,
}: PostModalProps) {
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  const handleCancel = () => {
    // フォームの値は削除せず、モーダルを閉じる
    onOpenChange(false)
    onCancel?.()
  }

  const handleSubmit = (values: PostFormValues) => {
    // 親にtitleとcontentを返す
    onPost(values.title, values.content)

    // 投稿後、フォームをリセット
    form.reset()
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
