'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-telink-text-secondary mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3',
            'bg-telink-bg-tertiary text-telink-text',
            'border rounded-xl',
            'placeholder:text-telink-text-muted',
            'transition-all duration-200',
            'focus:outline-none focus:ring-1',
            error
              ? 'border-status-incorrect focus:border-status-incorrect focus:ring-status-incorrect'
              : 'border-telink-border focus:border-telink-accent focus:ring-telink-accent',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-status-incorrect">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
