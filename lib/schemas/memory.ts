import * as z from 'zod'

export const memorySchema = z.object({
  id: z.number().optional(),
  title: z.string().min(1, '投稿タイトルを入力してください'),
  content: z
    .string()
    .min(1, '内容を入力してください')
    .max(1000, '内容は1000文字以内で入力してください'),
})

export type MemoryFormValues = z.infer<typeof memorySchema>
