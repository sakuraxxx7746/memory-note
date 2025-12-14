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
        console.error('Login error:', error)
        return
      }

      console.log('Login success:', data)
      alert(`ログイン成功!\nユーザーID: ${data.user?.id}\nメール: ${data.user?.email}`)
      // router.push('/')
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('予期しないエラーが発生しました')
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <Box className="flex min-h-screen flex-col items-center justify-center p-8">
      <Typography variant="h4" className="mb-8">Login Page</Typography>
      
      <Box component="form" onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-4">
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
        
        <TextField
          label="Password"
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
