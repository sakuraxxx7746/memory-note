'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MemoryModal } from '@/components/modal/memory-modal'
import MemoryCard from '@/components/card/memory-card'
import { Tables } from '@/lib/types/supabase'
import { getMemories, getMemoriesByHashtag } from '@/lib/api/getMemories'
import { saveMemory } from '@/lib/api/saveMemory'
import { MemoryFormValues } from '@/lib/schemas/memory'
import { useSearchParams } from 'next/navigation'

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

  const handlEdit = (memory: Tables<'memories'>) => {
    setMemory(memory)
    setIsModalOpen(true)
  }

  const handleMemory = async (values: MemoryFormValues) => {
    const result = await saveMemory({
      id: values?.id,
      title: values.title,
      content: values.content,
    })

    if (!result.success) {
      alert(`投稿の保存に失敗しました: ${result.error}`)
      return
    }

    // 投稿一覧を再取得
    await fetchMemories()

    // モーダルを閉じる
    setIsModalOpen(false)
  }

  return (
    <div className="">
      <Button onClick={() => setIsModalOpen(true)} className="w-full mb-2">
        忘れたくないものがあるときにここで
      </Button>
      <div className="columns-1 md:columns-3 xl:columns-4 gap-2">
        {memories.map(memory => (
          <MemoryCard
            className="glass-reveal"
            onEdit={handlEdit}
            key={memory.id}
            memory={memory}
          />
        ))}
      </div>

      <MemoryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onMemory={handleMemory}
        memory={memory}
      />
    </div>
  )
}
