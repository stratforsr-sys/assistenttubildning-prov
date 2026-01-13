'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode | string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ label, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card variant="glass" className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-telink-text-secondary mb-1">{label}</p>
            <p className="text-3xl font-bold text-telink-accent">{value}</p>
            {trend && (
              <p className={cn(
                'text-sm mt-2 flex items-center gap-1',
                trend.isPositive ? 'text-status-correct' : 'text-status-incorrect'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className="w-12 h-12 rounded-xl bg-telink-accent/10 flex items-center justify-center text-2xl">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
