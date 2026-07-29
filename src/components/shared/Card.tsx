import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    glare?: boolean
}

export function Card({ children, className, hover = true, glare = false }: CardProps) {
    return (
        <div className={cn(
            "relative overflow-hidden rounded-[20px] bg-white border border-slate-200/60 shadow-elite transition-all duration-500",
            hover && "hover:border-slate-300 hover:shadow-overlay hover:-translate-y-0.5",
            className
        )}>
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 pointer-events-none rounded-[19px] ring-1 ring-inset ring-white/10" />
            {children}
        </div>
    )
}

interface CardHeaderProps {
    title: string
    subtitle?: string
    icon?: ReactNode
    action?: ReactNode
    className?: string
}

export function CardHeader({ title, subtitle, icon, action, className }: CardHeaderProps) {
    return (
        <div className={cn("flex items-center justify-between p-6 pb-3 border-b border-slate-50", className)}>
            <div className="flex items-center gap-3">
                {icon && (
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-200/50">
                        {icon}
                    </div>
                )}
                <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
                    {subtitle && <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">{subtitle}</p>}
                </div>
            </div>
            {action && <div>{action}</div>}
        </div>
    )
}

interface CardContentProps {
    children: ReactNode
    className?: string
}

export function CardContent({ children, className }: CardContentProps) {
    return (
        <div className={cn("p-6", className)}>
            {children}
        </div>
    )
}
