import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { MemoryWithMemoryImagesType } from '@/lib/types/api'
import { getCurrentUser } from './getCurrentUser'

export async function deleteMemory(
  memory: MemoryWithMemoryImagesType
): Promise<ApiResponse> {
  const supabase = createClient()
  // 現在のユーザーを取得
  const userResult = await getCurrentUser()

  if (!userResult.success) {
    return { success: false, error: userResult.error }
  }

  if (!userResult.data) {
    return { success: false, error: 'ユーザーが存在しません。' }
  }

  const userId = userResult.data.id

  /// img.image_urlはURLなので、最後の/以降を正規表現で取得し、とれない場合は
  const imagePaths =
    memory.memory_images?.flatMap(
      img => `memories/${userId}/${memory.id}/` + img.file_name
    ) || []

  console.log('Deleting images from paths:', imagePaths)
  // ストレージから画像を削除
  if (imagePaths.length > 0) {
    const { error: storageError } = await supabase.storage
      .from('memory-images')
      .remove(imagePaths)
    if (storageError) {
      return { success: false, error: storageError.message }
    }
  }

  // Memoriesからレコードを削除
  console.log('Deleting memory record:', memory.id)
  const { error } = await supabase.from('memories').delete().eq('id', memory.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
