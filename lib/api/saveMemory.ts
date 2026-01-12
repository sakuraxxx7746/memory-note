import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'
import { ImageItem } from '@/lib/types/image'
import { ar } from 'zod/v4/locales'

type SaveMemoryInput = {
  id?: string
  title: string
  content: string
  images?: ImageItem[]
}
const supabase = createClient()

export async function saveMemory(input: SaveMemoryInput): Promise<ApiResponse> {
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

    let memoryId = input.id
    if (!memoryId) {
      const { data, error } = await supabase
        .from('memories')
        .insert({})
        .select('id')
        .single()
      if (error) {
        console.error('メモリ作成エラー:', error)
        return { success: false, error: error.message }
      }
      memoryId = data.id
    }

    // 画像アップロード用の関数を呼び出し
    const uploadedImageUrls = await uploadImages(
      userResult.data.id,
      memoryId,
      input.images || []
    )

    if (uploadedImageUrls instanceof Error) {
      return { success: false, error: uploadedImageUrls.message }
    }
    const { data, error } = await supabase.rpc('save_memory', {
      p_memory_id: memoryId || null,
      p_title: input.title,
      p_content: input.content,
      p_image_urls: uploadedImageUrls,
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

    console.log('saveMemory memoryId:', memoryId)

    return { success: true }
  } catch (error) {
    console.error('予期しないエラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '保存に失敗しました',
    }
  }
}

const uploadImages = async (
  userId: string,
  memoryId: string | undefined,
  inputImages: ImageItem[]
): Promise<string[] | Error> => {
  let publicUrls: string[] = []
  // 画像のアップロード処理
  if (!(inputImages && inputImages.length > 0)) {
    return publicUrls
  }

  publicUrls = inputImages.flatMap(img =>
    img.type === 'existing' ? [img.url] : []
  )
  // 新規画像のみアップロード
  const newImages = inputImages.filter(img => img.type === 'new')
  console.log('saveMemory memoryId:', newImages)
  for (let i = 0; i < newImages.length; i++) {
    const image = newImages[i]
    const fileName = `${i}_${Date.now()}.jpg`
    const filePath = `memories/${userId}/${memoryId}/${fileName}`

    // Storageにアップロード
    const { error: uploadError } = await supabase.storage
      .from('memory-images')
      .upload(filePath, image.file)

    if (uploadError) {
      console.error('画像アップロードエラー:', uploadError)
      return uploadError
    }

    // 公開URLを取得
    const {
      data: { publicUrl },
    } = supabase.storage.from('memory-images').getPublicUrl(filePath)
    console.log('saveMemory publicUrl:', publicUrl)

    publicUrls.push(publicUrl)
  }
  return publicUrls
}
