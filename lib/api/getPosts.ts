import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { Tables } from '@/lib/types/supabase'

export async function getPosts(): Promise<ApiResponse<Tables<'posts'>[]>> {
  const supabase = createClient()

  const { data, error } = await supabase.from('posts').select('*')
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
