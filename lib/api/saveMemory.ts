import { MemoryFormValues } from '@/lib/schemas/memory'
import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'

type SaveMemoryInput = {
  id?: string
  title: string
  content: string
}

function parseHashtags(data: string): string[] {
  // #の後、半角スペース・全角スペース・改行以外の文字を抽出
  // 終端は半角スペース・全角スペース・改行または文末
  const regex = /#([^\s　\n]+)(?=[\s　\n]|$)/g
  const matches = [...data.matchAll(regex)]

  // キャプチャグループ[1]から#なしのタグ名を取得、重複削除
  const tags = matches.map(m => m[1])
  return [...new Set(tags)]
}

export async function saveMemory(input: SaveMemoryInput): Promise<ApiResponse> {
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
    // 更新処理
    const { error } = await supabase
      .from('memories')
      .update({
        title: input.title,
        content: input.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.id)
      .eq('user_id', userResult.data.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  // 新規作成
  const { error } = await supabase.from('memories').insert({
    title: input.title,
    content: input.content,
    user_id: userResult.data.id,
  })

  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true }
}
