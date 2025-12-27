'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button, TextField, Box, Typography } from '@mui/material'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        alert(`ログイン失敗\n\nエラー: ${error.message}`)
        console.error('Login error:', error)
        return
      }

      // 成功時の結果をアラート表示
      alert(`ログイン成功！\n\nユーザーID: ${data.user?.id}\nメール: ${data.user?.email}\n作成日時: ${data.user?.created_at}`)
      console.log('Login success:', data)
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('予期しないエラーが発生しました')
      alert('予期しないエラーが発生しました')
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Box className="flex min-h-screen flex-col items-center justify-center p-8">
      <Typography variant="h4" className="mb-8">ログイン</Typography>
      
      <Box component="form" onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-4">
        <TextField
          label="メールアドレス"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        
        <TextField
          label="パスワード"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
        
        {error && (
          <Typography color="error" className="text-sm">
            {error}
          </Typography>
        )}
        
        <Button variant="contained" type="submit" size="large">
          ログイン
        </Button>
      </Box>
    </Box>
  )
}
