import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { Tables } from '@/lib/types/supabase'

export async function getHashtags(): Promise<
  ApiResponse<Tables<'hashtags'>[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('hashtags')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
