'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PostModal } from '@/components/modal/post-modal'
import PostCard from '@/components/card/post-card'
import { Tables } from '@/lib/types/supabase'
import { getPosts } from '@/lib/api/getPosts'
import { savePost } from '@/lib/api/savePost'
import { PostFormValues } from '@/lib/schemas/post'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [posts, setPosts] = useState<Tables<'posts'>[]>([])
  const [post, setPost] = useState<Tables<'posts'> | null>(null)

  const fetchPosts = async () => {
    const result = await getPosts()

    if (!result.success) {
      console.error('投稿の取得に失敗:', result.error)
      return
    }

    setPosts(result.data || [])
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchPosts()
  }, [])

  const handlEdit = (post: Tables<'posts'>) => {
    setPost(post)
    setIsModalOpen(true)
  }

  const handlePost = async (values: PostFormValues) => {
    const result = await savePost({
      id: values?.id,
      title: values.title,
      content: values.content,
    })

    if (!result.success) {
      alert(`投稿の保存に失敗しました: ${result.error}`)
      return
    }

    // 投稿一覧を再取得
    await fetchPosts()

    // モーダルを閉じる
    setIsModalOpen(false)
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">ここが君の記憶の場所</h1>
      <Button className="mb-4" onClick={() => setIsModalOpen(true)}>
        忘れたくないものがあるときにすることをここで
      </Button>
      <div className="columns-1 md:columns-3 xl:columns-4 gap-4">
        {posts.map(post => (
          <PostCard onEdit={handlEdit} key={post.id} post={post} />
        ))}
      </div>

      <PostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPost={handlePost}
        post={post}
      />
    </main>
  )
}
