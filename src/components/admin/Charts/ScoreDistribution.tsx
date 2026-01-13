'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ScoreDistributionProps {
  data: { range: string; count: number }[]
}

export function ScoreDistribution({ data }: ScoreDistributionProps) {
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
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="range" 
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#162337',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(61, 214, 140, 0.1)' }}
          />
          <Bar 
            dataKey="count" 
            fill="#3DD68C" 
            radius={[4, 4, 0, 0]}
            name="Antal"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
