'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CreateMemoryModal } from '@/components/modal/create-memory-modal'
import MemoryCard from '@/components/card/memory-card'
import { Tables } from '@/lib/types/supabase'
import { getMemories, getMemoriesByHashtag } from '@/lib/api/getMemories'
import { useSearchParams } from 'next/navigation'
import CreateMemoryButton from '@/components/atom/create-memory-button'

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [memories, setMemories] = useState<Tables<'memories'>[]>([])
  const [memory, setMemory] = useState<Tables<'memories'> | null>(null)

  const searchParams = useSearchParams()
  const hashtag = searchParams.get('tag')

  const fetchMemories = async () => {
    let result

    if (hashtag) {
      result = await getMemoriesByHashtag(hashtag)
    } else {
      result = await getMemories()
    }

    if (!result.success) {
      console.log('投稿の取得に失敗:', result.error)
      return
    }

    setMemories(result.data || [])
  }

  useEffect(() => {
    fetchMemories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashtag])

  const openPostModal = () => {
    setMemory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (memory: Tables<'memories'>) => {
    setMemory(memory)
    setIsModalOpen(true)
  }

  const handlePost = async () => {
    // 投稿一覧を再取得
    await fetchMemories()

    // モーダルを閉じる
    setIsModalOpen(false)
    setMemory(null)
  }

  return (
    <div className="">
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-2">
        {memories.map(memory => (
          <MemoryCard
            className="glass-reveal"
            onEdit={handleEdit}
            key={memory.id}
            memory={memory}
          />
        ))}
      </div>
      <CreateMemoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPost={handlePost}
        memory={memory}
      />{' '}
      <CreateMemoryButton onClick={openPostModal} />
    </div>
  )
}
