'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { MESSAGES } from '@/lib/constants'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim() || !password) {
      setError(MESSAGES.ERROR_REQUIRED_FIELDS)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (!data.success) {
        setError(data.error || MESSAGES.ADMIN_ERROR_INVALID)
        return
      }
      
      router.push('/admin-dashboard')
    } catch (err) {
      console.error('Admin login error:', err)
      setError(MESSAGES.ERROR_GENERIC)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <main className="min-h-screen bg-telink-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-telink-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-telink-accent/5 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Telink"
            width={160}
            height={48}
            className="mx-auto mb-6"
            priority
          />
          <h1 className="text-3xl font-bold text-telink-text mb-2">
            {MESSAGES.ADMIN_LOGIN_TITLE}
          </h1>
          <p className="text-telink-text-secondary">
            Telink Provplattform
          </p>
        </div>
        
        {/* Login Card */}
        <Card variant="glass" className="animate-fade-in-up">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <Input
                label={MESSAGES.ADMIN_EMAIL_LABEL}
                type="email"
                placeholder="admin@telink.se"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              
              {/* Password */}
              <Input
                label={MESSAGES.ADMIN_PASSWORD_LABEL}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              
              {/* Error message */}
              {error && (
                <div className="p-4 bg-status-incorrect/10 border border-status-incorrect/30 rounded-xl text-status-incorrect text-sm">
                  {error}
                </div>
              )}
              
              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                isLoading={isLoading}
              >
                {MESSAGES.ADMIN_LOGIN_BUTTON}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        {/* Back link */}
        <div className="text-center mt-6">
          <a 
            href="/participant-login" 
            className="text-sm text-telink-text-muted hover:text-telink-text-secondary transition-colors"
          >
            ← Tillbaka till provstart
          </a>
        </div>
      </div>
    </main>
  )
}
