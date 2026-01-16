'use client'

import { useState } from 'react'
import {
    DollarSign,
    Target,
    PhoneCall,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { DataTable } from '@/components/shared/DataTable'
import { FormInput } from '@/components/shared/FormInput'

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
            label: 'Total Records',
            value: performance.reduce((sum, p) => sum + p.records, 0).toLocaleString(),
            icon: Target,
            color: 'emerald'
        },
        {
            label: 'Avg. Cost per Record',
            value: `$${(performance.reduce((sum, p) => sum + p.spend, 0) / (performance.reduce((sum, p) => sum + (p.records || 1), 0)) || 1).toLocaleString(undefined, { maximumFractionDigits: 1 })}`,
            icon: TrendingUp,
            color: 'indigo'
        }
    ]

    const columns = [
        {
            header: 'Campaign Name',
            render: (p: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold">{p.campaign_name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{p.campaign_id}</span>
                </div>
            )
        },
        {
            header: 'Total Spend',
            render: (p: any) => (
                <span className="text-sm text-slate-900 font-extrabold tabular-nums">${p.spend.toLocaleString()}</span>
            )
        },
        {
            header: 'Records (Conversions)',
            render: (p: any) => (
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-900 font-extrabold tabular-nums">{p.records.toLocaleString()}</span>
                    <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                        <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${Math.min((p.records / 100) * 100, 100)}%` }}></div>
                    </div>
                </div>
            )
        },
        {
            header: 'Impressions',
            render: (p: any) => (
                <span className="text-sm text-slate-500 font-medium tabular-nums">{p.impressions.toLocaleString()}</span>
            )
        },
        {
            header: 'Cost per Record',
            render: (p: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-extrabold tabular-nums border-b border-slate-100 pb-1 mb-1 w-fit">${p.costPerRecord.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ad Efficiency</span>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 flex items-center gap-5">
                        <div className={cn(
                            "p-3 rounded-xl ring-1 ring-inset shadow-sm",
                            stat.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-500/10" :
                                stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" :
                                    "bg-indigo-50 text-indigo-600 ring-indigo-500/10"
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
                    title="Campaign Performance Summary"
                    subtitle="Detailed efficiency breakdown by campaign entry"
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
                        emptyMessage="No matching campaigns found."
                    />
                </div>
            </Card>
        </div>
    )
}
