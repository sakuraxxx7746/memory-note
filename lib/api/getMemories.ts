import { createClient } from '@/lib/supabase/client'
import { ApiResponse } from '@/lib/types/api'
import { Tables } from '@/lib/types/supabase'

export async function getMemories(): Promise<
  ApiResponse<Tables<'memories'>[]>
> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .order('updated_at', { ascending: false })
  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
