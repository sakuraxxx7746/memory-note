import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'
import { ImageItem } from '@/lib/types/image'

type SaveMemoryInput = {
  id?: string
  title: string
  content: string
  images?: ImageItem[]
}

export async function saveMemory(input: SaveMemoryInput): Promise<ApiResponse> {
  const supabase = createClient()

  console.log('saveMemory input:', input)
  try {
    // 現在のユーザーを取得
    const userResult = await getCurrentUser()

    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    if (!userResult.data) {
      return { success: false, error: 'ユーザーが存在しません。' }
    }

    console.log('saveMemory userResult:', userResult)
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

    const memoryId = data.memory_id
    console.log('saveMemory memoryId:', memoryId)
    // 画像のアップロード処理
    if (input.images && input.images.length > 0) {
      // 既存の画像を削除（編集時）
      if (input.id) {
        await supabase.from('memory_images').delete().eq('memory_id', input.id)
      }

      // 新規画像のみアップロード
      const newImages = input.images.filter(img => img.type === 'new')
      console.log('saveMemory memoryId:', newImages)
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i]
        const fileName = `${memoryId}_${i}_${Date.now()}.jpg`
        const filePath = `memories/${userResult.data.id}/${fileName}`

        // Storageにアップロード
        const { error: uploadError } = await supabase.storage
          .from('memory-images')
          .upload(filePath, image.file)

        if (uploadError) {
          console.error('画像アップロードエラー:', uploadError)
          continue
        }

        // 公開URLを取得
        const {
          data: { publicUrl },
        } = supabase.storage.from('memory-images').getPublicUrl(filePath)
        console.log('saveMemory publicUrl:', publicUrl)

        // memory_imagesテーブルに保存
        await supabase.from('memory_images').insert({
          memory_id: memoryId,
          image_url: publicUrl,
          display_order: i + 1,
        })
      }
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
