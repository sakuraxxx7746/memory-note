import * as z from 'zod'

export const memorySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, '投稿タイトルを入力してください'),
  content: z
    .string()
    .min(1, '内容を入力してください')
    .max(1000, '内容は1000文字以内で入力してください'),
  images: z
    .array(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('new'),
          file: z.instanceof(File),
          previewUrl: z.string(),
        }),
        z.object({
          type: z.literal('existing'),
          id: z.string(),
          url: z.string(),
        }),
      ])
    )
    .optional(),
})

export type MemoryFormValues = z.infer<typeof memorySchema>
