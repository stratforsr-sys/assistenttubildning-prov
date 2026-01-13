'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TrendLineProps {
  data: { date: string; averageScore: number; count: number }[]
}

export function TrendLine({ data }: TrendLineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-telink-text-secondary">
        Ingen data tillgänglig
      </div>
    )
  }
  
  // Format date for display
  const formattedData = data.map(d => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString('sv-SE', {
      month: 'short',
      day: 'numeric',
    }),
  }))
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.1)" 
            vertical={false}
          />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis 
            domain={[0, 22]}
            tick={{ fill: '#A4B3C7', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#162337',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
            }}
            formatter={(value: number, name: string) => {
              if (name === 'averageScore') return [value, 'Medelpoäng']
              if (name === 'count') return [value, 'Antal']
              return [value, name]
            }}
          />
          <Line 
            type="monotone" 
            dataKey="averageScore" 
            stroke="#3DD68C" 
            strokeWidth={2}
            dot={{ fill: '#3DD68C', strokeWidth: 0, r: 4 }}
            activeDot={{ fill: '#3DD68C', strokeWidth: 0, r: 6 }}
            name="averageScore"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
