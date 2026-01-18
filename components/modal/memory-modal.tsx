'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
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
import { ImageItem } from '@/lib/types/image'
import { useDropzone } from 'react-dropzone'
import ModalImagePreview from './image/modal-image-preview'
import { compressImage } from '@/lib/utils/image-compression'
import { MemoryWithMemoryImagesType } from '@/lib/types/api'
import { saveMemory } from '@/lib/api/saveMemory'
import { deleteMemory } from '@/lib/api/deleteMemory'
import { getImageUrl } from '@/lib/supabase/storage'

interface MemoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPost: () => Promise<void>
  memory: MemoryWithMemoryImagesType | null
  onCancel?: () => void
}

export function MemoryModal({
  open,
  onOpenChange,
  onPost,
  memory,
  onCancel,
}: MemoryModalProps) {
  const maxImageSize = 2
  const [images, setImages] = useState<ImageItem[]>([])

  const onDrop = async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxImageSize) {
      alert('画像は最大2枚までアップロード可能です。')
      return
    }

    const compressed = await Promise.all(
      acceptedFiles.map(file => compressImage(file))
    )

    const newImages: ImageItem[] = compressed.map(file => ({
      type: 'new',
      file,
      previewUrl: URL.createObjectURL(file),
    }))

    setImages(prev => [...prev, ...newImages])
  }

  const form = useForm<MemoryFormValues>({
    resolver: zodResolver(memorySchema),
    defaultValues: {
      title: '',
      content: '',
    },
  })

  useEffect(() => {
    form.reset({
      id: memory?.id,
      title: memory?.title ?? '',
      content: memory?.content ?? '',
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    setImages(
      memory?.memory_images?.map(mi => ({
        type: 'existing',
        id: memory.id,
        url: getImageUrl(memory.user_id, memory.id, mi.file_name ?? ''),
      })) ?? []
    )
  }, [memory, form])

  const handleCancel = () => {
    // フォームの値は削除せず、モーダルを閉じる
    onOpenChange(false)
    onCancel?.()
  }

  const handleDelete = async () => {
    if (memory) {
      const result = await deleteMemory(memory)
      console.log('deleteMemory result:', result)
    }
    // フォームの値は削除せず、モーダルを閉じる
    onOpenChange(false)
  }

  const handleSubmit = async (values: MemoryFormValues) => {
    console.log('handleSubmit values:', values)
    // imagesステートをフォームの値に追加して親に渡す
    const formData = {
      ...values,
      images: images.length > 0 ? images : undefined,
    }
    console.log('handleSubmit added images:', images)
    const result = await saveMemory({
      id: formData?.id,
      title: formData.title,
      content: formData.content,
      images: formData.images || undefined,
    })

    if (!result.success) {
      alert(`投稿の保存に失敗しました: ${result.error}`)
      return
    }
    onPost()
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
                      placeholder="内容（画像をここにドロップ）"
                      maxLength={1000}
                      rows={8}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* 画像選択ボタン */}
            <div className="space-y-2">
              {images.length < maxImageSize && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.multiple = true
                    input.onchange = async e => {
                      const files = (e.target as HTMLInputElement).files
                      if (files) {
                        await onDrop(Array.from(files))
                      }
                    }
                    input.click()
                  }}
                >
                  画像を追加
                </Button>
              )}
            </div>

            {images.length > 0 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <ModalImagePreview
                    key={index}
                    imageUrl={
                      image.type === 'new' ? image.previewUrl : image.url
                    }
                    onRemove={() =>
                      setImages(prev => prev.filter((_, i) => i !== index))
                    }
                  />
                ))}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleDelete}>
                削除
              </Button>
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
