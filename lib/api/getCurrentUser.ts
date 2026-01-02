import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { User } from '@supabase/supabase-js'

export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    return { success: false, error: error.message }
  }

  if (!user) {
    return { success: false, error: 'ログインが必要です' }
  }

  return { success: true, data: user }
}
