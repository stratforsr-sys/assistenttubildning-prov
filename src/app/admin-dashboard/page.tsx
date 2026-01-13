'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatsCard } from '@/components/admin/StatsCard'
import { ParticipantTable } from '@/components/admin/ParticipantTable'
import { QuestionAnalysis } from '@/components/admin/QuestionAnalysis'
import { ScoreDistribution } from '@/components/admin/Charts/ScoreDistribution'
import { TimeVsScore } from '@/components/admin/Charts/TimeVsScore'
import { TrendLine } from '@/components/admin/Charts/TrendLine'
import { ConfirmModal } from '@/components/ui/Modal'
import { MESSAGES } from '@/lib/constants'
import type { AdminStats, ParticipantAttempt, QuestionStats, ScoreDistribution as ScoreDistributionType, TimeVsScoreData, TrendData } from '@/types'

type TabType = 'overview' | 'participants' | 'questions' | 'codes'

export default function AdminDashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [attempts, setAttempts] = useState<ParticipantAttempt[]>([])
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([])
  const [scoreDistribution, setScoreDistribution] = useState<ScoreDistributionType[]>([])
  const [timeVsScore, setTimeVsScore] = useState<TimeVsScoreData[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [deleteAttemptId, setDeleteAttemptId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, attemptsRes, questionStatsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/attempts'),
        fetch('/api/admin/stats?type=questions'),
      ])
      
      const statsData = await statsRes.json()
      const attemptsData = await attemptsRes.json()
      const questionStatsData = await questionStatsRes.json()
      
      if (statsData.success) {
        setStats(statsData.data.stats)
        setScoreDistribution(statsData.data.scoreDistribution || [])
        setTimeVsScore(statsData.data.timeVsScore || [])
        setTrendData(statsData.data.trendData || [])
      }
      
      if (attemptsData.success) {
        setAttempts(attemptsData.data)
      }
      
      if (questionStatsData.success) {
        setQuestionStats(questionStatsData.data)
      }
    } catch (error) {
      console.error('Fetch data error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  // Check auth and fetch data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.status === 401) {
          router.replace('/admin-login')
          return
        }
        await fetchData()
      } catch {
        router.replace('/admin-login')
      }
    }
    
    checkAuth()
  }, [router, fetchData])
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/admin-login', { method: 'DELETE' })
    } catch {
      // Ignore
    }
    router.replace('/admin-login')
  }
  
  // Handle delete attempt
  const handleDeleteAttempt = async () => {
    if (!deleteAttemptId) return
    
    setIsDeleting(true)
    try {
      const res = await fetch('/api/admin/delete-attempt', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: deleteAttemptId }),
      })
      
      if (res.ok) {
        setAttempts(prev => prev.filter(a => a.id !== deleteAttemptId))
        await fetchData() // Refresh stats
      }
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setIsDeleting(false)
      setDeleteAttemptId(null)
    }
  }
  
  // Handle view attempt detail
  const handleViewAttempt = (id: string) => {
    router.push(`/admin-dashboard/attempt/${id}`)
  }
  
  const tabs = [
    { id: 'overview', label: MESSAGES.DASHBOARD_STATS, icon: '📊' },
    { id: 'participants', label: MESSAGES.DASHBOARD_PARTICIPANTS, icon: '👥' },
    { id: 'questions', label: MESSAGES.DASHBOARD_QUESTIONS, icon: '❓' },
  ] as const
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-telink-bg flex items-center justify-center">
        <div className="text-telink-text-secondary animate-pulse">
          {MESSAGES.LOADING}
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-telink-bg">
      {/* Header */}
      <header className="bg-telink-bg-secondary border-b border-telink-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Telink"
              width={100}
              height={32}
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-bold text-telink-text hidden sm:block">
              {MESSAGES.DASHBOARD_TITLE}
            </h1>
          </div>
          
          <Button variant="ghost" onClick={handleLogout}>
            {MESSAGES.LOGOUT}
          </Button>
        </div>
        
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-1 -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-telink-accent text-telink-accent'
                    : 'border-transparent text-telink-text-secondary hover:text-telink-text'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                label={MESSAGES.STAT_TOTAL_PARTICIPANTS}
                value={stats.totalParticipants}
                icon="👥"
              />
              <StatsCard
                label={MESSAGES.STAT_AVERAGE_SCORE}
                value={`${stats.averageScore}%`}
                icon="📈"
              />
              <StatsCard
                label={MESSAGES.STAT_MEDIAN_SCORE}
                value={`${stats.medianScore}%`}
                icon="📊"
              />
              <StatsCard
                label={MESSAGES.STAT_MIN_MAX}
                value={`${stats.minScore}% / ${stats.maxScore}%`}
                icon="🎯"
              />
            </div>
            
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Distribution */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>{MESSAGES.CHART_SCORE_DISTRIBUTION}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScoreDistribution data={scoreDistribution} />
                </CardContent>
              </Card>
              
              {/* Time vs Score */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>{MESSAGES.CHART_TIME_VS_SCORE}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeVsScore data={timeVsScore} />
                </CardContent>
              </Card>
            </div>
            
            {/* Trend Line */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{MESSAGES.CHART_TREND}</CardTitle>
              </CardHeader>
              <CardContent>
                <TrendLine data={trendData} />
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Participants Tab */}
        {activeTab === 'participants' && (
          <div className="animate-fade-in">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{MESSAGES.DASHBOARD_PARTICIPANTS}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ParticipantTable
                  attempts={attempts}
                  onView={handleViewAttempt}
                  onDelete={(id) => setDeleteAttemptId(id)}
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="animate-fade-in">
            <QuestionAnalysis stats={questionStats} />
          </div>
        )}
      </main>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteAttemptId}
        onConfirm={handleDeleteAttempt}
        onCancel={() => setDeleteAttemptId(null)}
        title="Radera provresultat"
        message={MESSAGES.DELETE_CONFIRM}
        confirmText={MESSAGES.DELETE}
        cancelText={MESSAGES.CANCEL}
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  )
}
