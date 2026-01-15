'use client'

import {
    Phone,
    Globe,
    Languages,
    PieChart as PieChartIcon,
    ArrowUpRight,
    Smartphone,
    MessageCircle,
    Map,
    Zap,
    TrendingUp,
    Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { DataTable } from '@/components/shared/DataTable'

interface CallAnalyticsViewProps {
    analytics: any
}

export default function CallAnalyticsView({ analytics }: CallAnalyticsViewProps) {
    const totalCalls = analytics.byType.local + analytics.byType.whatsapp

    const columns = [
        {
            header: 'Country / Market',
            render: (c: any) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {c.iso}
                    </div>
                    <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{c.name}</span>
                </div>
            )
        },
        {
            header: 'Total Inquiries',
            render: (c: any) => (
                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{c.calls.toLocaleString()}</span>
            )
        },
        {
            header: 'Quotes Sent',
            render: (c: any) => (
                <span className="text-sm font-medium text-slate-500 tabular-nums">{c.quotes.toLocaleString()}</span>
            )
        },
        {
            header: 'Conversion Rate',
            render: (c: any) => (
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full min-w-[80px] overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-1000"
                            style={{ width: `${(c.quotes / (c.calls || 1)) * 100}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 w-8">
                        {((c.quotes / (c.calls || 1)) * 100).toFixed(0)}%
                    </span>
                </div>
            )
        },
        {
            header: 'Market Share',
            className: 'text-right',
            render: (c: any) => (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {((c.calls / (totalCalls || 1)) * 100).toFixed(1)}%
                </div>
            )
        }
    ]

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Call Type Card */}
                <Card className="p-0 group">
                    <CardHeader
                        title="Channel Distribution"
                        subtitle="Engagement by inquiry type"
                        icon={<Smartphone className="w-4 h-4" />}
                    />
                    <CardContent className="space-y-8 pt-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">{totalCalls}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-80">Total Leads Index</p>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                                <ArrowUpRight className="w-3 h-3" /> 8.4%
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2 text-slate-800"><Phone className="w-3 h-3 text-blue-500" /> Hotline Calls</span>
                                    <span className="text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-[10px] tabular-nums">{analytics.byType.local}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                                        style={{ width: `${(analytics.byType.local / (totalCalls || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-400">
                                    <span className="flex items-center gap-2 text-slate-800"><MessageCircle className="w-3 h-3 text-emerald-500" /> WhatsApp Messages</span>
                                    <span className="text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md text-[10px] tabular-nums">{analytics.byType.whatsapp}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                                        style={{ width: `${(analytics.byType.whatsapp / (totalCalls || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Language Card */}
                <Card className="p-0 group">
                    <CardHeader
                        title="Language Breakdown"
                        subtitle="User preference distribution"
                        icon={<Languages className="w-4 h-4" />}
                    />
                    <CardContent className="flex flex-col items-center justify-center pt-6">
                        <div className="relative w-36 h-36 flex items-center justify-center mb-8">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                {/* Track */}
                                <circle
                                    className="text-slate-50 stroke-current"
                                    strokeWidth="8"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                                {/* sinhala Segment */}
                                <circle
                                    className="text-emerald-500 stroke-current transition-all duration-1000"
                                    strokeWidth="8"
                                    strokeDasharray={263.8}
                                    strokeDashoffset={0}
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                                {/* English Segment */}
                                <circle
                                    className="text-blue-500 stroke-current transition-all duration-1000"
                                    strokeWidth="8"
                                    strokeDasharray={`${(analytics.byLanguage.english / (analytics.byLanguage.english + analytics.byLanguage.sinhala || 1)) * 263.8} 263.8`}
                                    strokeDashoffset={0}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums leading-none">
                                    {analytics.byLanguage.english >= analytics.byLanguage.sinhala
                                        ? Math.round((analytics.byLanguage.english / (analytics.byLanguage.english + analytics.byLanguage.sinhala || 1)) * 100)
                                        : Math.round((analytics.byLanguage.sinhala / (analytics.byLanguage.english + analytics.byLanguage.sinhala || 1)) * 100)
                                    }%
                                </span>
                                <span className={cn(
                                    "text-[8px] font-bold uppercase tracking-widest mt-1.5 px-2 py-0.5 rounded border",
                                    analytics.byLanguage.english >= analytics.byLanguage.sinhala
                                        ? "text-blue-600 bg-blue-50 border-blue-100"
                                        : "text-emerald-600 bg-emerald-50 border-emerald-100"
                                )}>
                                    {analytics.byLanguage.english >= analytics.byLanguage.sinhala ? 'ENGLISH' : 'SINHALA'}
                                </span>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3 border-t border-slate-50 pt-6 mt-2">
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">English</p>
                                <p className="text-lg font-bold text-slate-900 tabular-nums">{analytics.byLanguage.english}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Sinhala</p>
                                <p className="text-lg font-bold text-slate-900 tabular-nums">{analytics.byLanguage.sinhala}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Efficiency Card */}
                <Card className="p-0 group">
                    <CardHeader
                        title="Acquisition Quality"
                        subtitle="Global performance tracking"
                        icon={<Activity className="w-4 h-4" />}
                    />
                    <CardContent className="space-y-6 pt-6">
                        <div className="p-5 bg-slate-50 border border-slate-100/50 rounded-2xl transition-all duration-300 group-hover:bg-blue-50/30">
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-4 leading-none opacity-80">Lead-to-Win Index</p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                                        {analytics.byCountry.length > 0 ? (analytics.byCountry.reduce((s: any, c: any) => s + c.quotes, 0) / analytics.byCountry.reduce((s: any, c: any) => s + c.calls, 1) * 100).toFixed(1) : 0}%
                                    </span>
                                </div>
                                <div className="p-2 rounded-lg bg-white text-blue-600 shadow-sm ring-1 ring-blue-500/10 transition-transform group-hover:scale-110">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-slate-50 border border-slate-100/50 rounded-2xl transition-all duration-300 group-hover:bg-emerald-50/30">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-4 leading-none opacity-80">Market Presence</p>
                            <div className="flex items-end justify-between">
                                <div>
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{analytics.byCountry.length}</span>
                                    <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-[0.1em]">Active Regions</span>
                                </div>
                                <div className="p-2 rounded-lg bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-500/10 transition-transform group-hover:scale-110">
                                    <Globe className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Country Breakdown Table */}
            <Card className="p-0 overflow-hidden">
                <CardHeader
                    title="Geographic Performance Breakdown"
                    subtitle="Market metrics by territory and conversion efficiency"
                    icon={<Map className="w-5 h-5" />}
                    action={
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1" />
                            Live Market Feed
                        </div>
                    }
                />
                <div className="px-1 pb-1">
                    <DataTable
                        data={analytics.byCountry}
                        columns={columns}
                        emptyMessage="No market data available for the current selection."
                    />
                </div>
            </Card>
        </div>
    )
}
