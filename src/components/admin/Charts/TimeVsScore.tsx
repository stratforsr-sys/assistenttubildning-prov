'use client'

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatTimeMinutes } from '@/lib/utils'

interface TimeVsScoreProps {
  data: { time: number; score: number; name: string }[]
}

export function TimeVsScore({ data }: TimeVsScoreProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-telink-text-secondary">
        Ingen data tillgänglig
      </div>
    )
  }
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
          />
          <XAxis 
            dataKey="time" 
            type="number"
            name="Tid"
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            tickFormatter={(value) => `${Math.floor(value / 60)}m`}
            label={{ 
              value: 'Tid (minuter)', 
              position: 'bottom', 
              fill: '#6B7A8F',
              fontSize: 11,
            }}
          />
          <YAxis 
            dataKey="score" 
            type="number"
            name="Poäng"
            domain={[0, 22]}
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            label={{ 
              value: 'Rätta svar', 
              angle: -90, 
              position: 'insideLeft',
              fill: '#6B7A8F',
              fontSize: 11,
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#162337',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'Tid') return formatTimeMinutes(value)
              return value
            }}
            labelFormatter={(_, payload) => {
              if (payload && payload[0]) {
                return payload[0].payload.name
              }
              return ''
            }}
          />
          <Scatter 
            data={data} 
            fill="#3DD68C"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
