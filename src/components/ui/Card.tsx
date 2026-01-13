import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'solid'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'glass', children, ...props }, ref) => {
    const variants = {
      default: 'bg-telink-bg-secondary border border-telink-border rounded-2xl',
      glass: 'bg-telink-bg-secondary/50 backdrop-blur-sm border border-telink-border rounded-2xl shadow-card hover:shadow-card-hover hover:border-telink-border-accent transition-all duration-300',
      solid: 'bg-telink-bg-tertiary rounded-2xl',
    }
    
    return (
      <div
        ref={ref}
        className={cn(variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4 border-b border-telink-border', className)}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6', className)} {...props} />
  )
)

CardContent.displayName = 'CardContent'

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-telink-text', className)}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

export { Card, CardHeader, CardContent, CardTitle }
