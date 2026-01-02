import { PostFormValues } from '@/lib/schemas/post'
import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'

export async function createPost(input: PostFormValues): Promise<ApiResponse> {
  const supabase = createClient()

  // 現在のユーザーを取得
  const userResult = await getCurrentUser()

  if (!userResult.success) {
    return { success: false, error: userResult.error }
  }

  const { error } = await supabase.from('posts').insert([
    {
      title: input.title,
      content: input.content,
      user_id: userResult.data.id,
    },
  ])

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
