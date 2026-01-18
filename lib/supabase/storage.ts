import { createClient } from '@/lib/supabase/client'

export const getImageUrl = (
  userId: string,
  memoryId: string,
  fileName: string
): string => {
  const supabase = createClient()
  const path = `memories/${userId}/${memoryId}/${fileName}`
  return supabase.storage.from('memory-images').getPublicUrl(path).data
    .publicUrl
}
