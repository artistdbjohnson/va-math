import { ReactNode } from 'react'

interface GlassCardProps {
  title?: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function GlassCard({ title, children, className = '', onClick }: GlassCardProps) {
  return (
    <div
      className={`glass-card ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <h2 className="font-display text-xl md:text-2xl text-slate-100 mb-3">
          {title}
        </h2>
      )}
      <div className="text-slate-300 text-base leading-relaxed flex-1">
        {children}
      </div>
    </div>
  )
}