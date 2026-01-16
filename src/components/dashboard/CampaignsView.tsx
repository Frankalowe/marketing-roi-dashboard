'use client'

import {
    DollarSign,
    Target,
    Users,
    Filter,
    BarChart3,
    TrendingUp,
    Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader } from '@/components/shared/Card'
import { DataTable } from '@/components/shared/DataTable'

interface CampaignsViewProps {
    performance: any[]
}

export default function CampaignsView({ performance }: CampaignsViewProps) {

    const stats = [
        {
            label: 'Avg. Ad Spend',
            value: `$${(performance.reduce((sum, p) => sum + p.spend, 0) / (performance.length || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            icon: DollarSign,
            color: 'blue'
        },
        {
            label: 'Total Link Clicks',
            value: performance.reduce((sum, p) => sum + (p.link_clicks || 0), 0).toLocaleString(),
            icon: Target,
            color: 'emerald'
        },
        {
            label: 'Avg. Cost per Click',
            value: `$${(performance.reduce((sum, p) => sum + p.spend, 0) / (performance.reduce((sum, p) => sum + (p.link_clicks || 1), 0)) || 1).toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
            icon: TrendingUp,
            color: 'indigo'
        },
        {
            label: 'Total Reach',
            value: performance.reduce((sum, p) => sum + (p.reach || 0), 0).toLocaleString(),
            icon: Users,
            color: 'orange'
        }
    ]

    const columns = [
        {
            header: 'Date',
            render: (p: any) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span className="text-sm text-slate-900 font-bold">
                        {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                </div>
            )
        },
        {
            header: 'Ad Spend',
            render: (p: any) => (
                <span className="text-sm text-slate-900 font-extrabold tabular-nums">${p.spend.toLocaleString()}</span>
            )
        },
        {
            header: 'Impressions',
            render: (p: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-600 font-medium tabular-nums">{p.impressions.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Views</span>
                </div>
            )
        },
        {
            header: 'Reach',
            render: (p: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold tabular-nums">{p.reach.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Unique</span>
                </div>
            )
        },
        {
            header: 'Link Clicks',
            render: (p: any) => (
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-900 font-extrabold tabular-nums w-12 text-right">{(p.link_clicks || 0).toLocaleString()}</span>
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min(((p.link_clicks || 0) / 100) * 100, 100)}%` }}></div>
                    </div>
                </div>
            )
        },
        {
            header: 'CPC',
            render: (p: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-extrabold tabular-nums">${p.costPerClick?.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Per Click</span>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex items-center gap-5">
                        <div className={cn(
                            "p-3 rounded-xl ring-1 ring-inset shadow-sm",
                            stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-500/10" :
                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" :
                                    stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-500/10" :
                                        "bg-orange-50 text-orange-600 ring-orange-500/10"
                        )}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-0 overflow-hidden">
                <CardHeader
                    title="Daily Performance Reports"
                    subtitle="Detailed breakdown of impressions, reach, spend, and clicks by day"
                    icon={<BarChart3 className="w-4 h-4" />}
                    action={
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-all text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <Filter className="w-3 h-3" />
                                Advanced Filters
                            </button>
                        </div>
                    }
                />
                <div className="px-1 pb-1">
                    <DataTable
                        data={performance}
                        columns={columns}
                        emptyMessage="No daily records found."
                    />
                </div>
            </Card>
        </div>
    )
}
