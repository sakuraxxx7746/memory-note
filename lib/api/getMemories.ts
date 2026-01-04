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

export async function getMemoriesByHashtag(
  hashtagName: string
): Promise<ApiResponse<Tables<'memories'>[]>> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('memories')
    .select(
      `
      *,
      memory_hashtag_mapping!inner(
        hashtags!inner(name)
      )
    `
    )
    .eq('memory_hashtag_mapping.hashtags.name', hashtagName)
    .order('updated_at', { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
