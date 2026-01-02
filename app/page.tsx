'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PostModal } from '@/components/modal/post-modal'
import { createClient } from '@/lib/supabase/client'
import PostCard from '@/components/card/post-card'
import { Tables } from '@/lib/types/supabase'
import { getPosts } from '@/lib/api/getPosts'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<Tables<'posts'>[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await getPosts()
      
      if (!result.success) {
        // エラー時は error プロパティのみ存在
        console.error('投稿の取得に失敗:', result.error)
        return
      }
      
      // 成功時は data プロパティのみ存在
      setPosts(result.data || [])
    }
    fetchPosts()
  }, [])

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

    const { error } = await supabase
      .from('posts')
      .insert([{ title, content, user_id: user.id }])

    if (error) {
      alert(`投稿の保存に失敗しました: ${error.message}`)
      return
    }

    // 保存成功後、投稿一覧を再取得
    const { data } = await supabase.from('posts').select('*')
    setPosts(data || [])

    // モーダルを閉じる
    setIsModalOpen(false)
    alert('投稿が保存されました')
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
      <Button onClick={() => setIsModalOpen(true)}>＋</Button>

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <PostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPost={handlePost}
      />
    </main>
  )
}
