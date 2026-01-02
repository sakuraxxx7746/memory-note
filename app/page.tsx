'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PostModal } from '@/components/post-modal'
import { createClient } from '@/lib/supabase/client'

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePost = async (title: string, content: string) => {
    const supabase = createClient()

    // 現在のユーザーを取得
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('ログインが必要です')
      return
    }

    // Supabaseに投稿を保存（user_idを含める）
    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, user_id: user.id }])

    if (error) {
      alert(`投稿の保存に失敗しました: ${error.message}`)
      return
    }

    // 保存成功後、モーダルを閉じる
    setIsModalOpen(false)
    alert('投稿が保存されました')
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <Button onClick={() => setIsModalOpen(true)}>＋</Button>

      <PostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPost={handlePost}
      />
    </main>
  )
}
