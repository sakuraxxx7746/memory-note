import { PostFormValues } from '@/lib/schemas/post'
import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'

type SavePostInput = {
  id?: number
  title: string
  content: string
}

export async function savePost(input: SavePostInput): Promise<ApiResponse> {
  const supabase = createClient()

  // 現在のユーザーを取得
  const userResult = await getCurrentUser()

  if (!userResult.success) {
    return { success: false, error: userResult.error }
  }

  if (!userResult.data) {
    return { success: false, error: 'ユーザーが存在しません。' }
  }

  if (input.id) {
    const findResult = await supabase
      .from('posts')
      .select('*')
      .eq('id', input.id)
      .single()

    if (findResult.error) {
      return { success: false, error: findResult.error.message }
    }
    if (findResult.data > 0) {
      const { error } = await supabase.from('posts').update([
        {
          title: input.title,
          content: input.content,
          user_id: userResult?.data.id,
        },
      ])
      if (error) {
        return { success: false, error: error.message }
      }
    }
  }

  const { error } = await supabase.from('posts').insert([
    {
      title: input.title,
      content: input.content,
      user_id: userResult?.data.id,
    },
  ])
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}
