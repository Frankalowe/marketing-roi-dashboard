import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    breadcrumbs?: string[]
    actions?: ReactNode
    className?: string
}

export function PageHeader({ title, subtitle, breadcrumbs, actions, className }: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8", className)}>
            <div className="space-y-3">
                {breadcrumbs && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] opacity-80">
                        {breadcrumbs.map((crumb, i) => (
                            <div key={crumb} className="flex items-center gap-2">
                                <span>{crumb}</span>
                                {i < breadcrumbs.length - 1 && <ChevronRight className="w-2.5 h-2.5 opacity-40" />}
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-l-4 border-blue-500 pl-4 py-1">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-slate-500 mt-2 text-sm font-medium leading-relaxed max-w-2xl pl-4">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            {actions && (
                <div className="flex items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    )
}
