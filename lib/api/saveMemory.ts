import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'

type SaveMemoryInput = {
  id?: string
  title: string
  content: string
}

export async function saveMemory(input: SaveMemoryInput): Promise<ApiResponse> {
  const supabase = createClient()

  try {
    // 現在のユーザーを取得
    const userResult = await getCurrentUser()

    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    if (!userResult.data) {
      return { success: false, error: 'ユーザーが存在しません。' }
    }

    // プロシージャを呼び出し
    const { data, error } = await supabase.rpc('save_memory_with_hashtags', {
      p_memory_id: input.id || null,
      p_title: input.title,
      p_content: input.content,
      p_user_id: userResult.data.id,
    })

    if (error) {
      console.error('プロシージャ実行エラー:', error)
      return { success: false, error: error.message }
    }

    // プロシージャの結果を確認
    if (data && !data.success) {
      return { success: false, error: data.error }
    }

    return { success: true }
  } catch (error) {
    console.error('予期しないエラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '保存に失敗しました',
    }
  }
}
