'use client'

import {
    DollarSign,
    PhoneCall,
    Users,
    ArrowUpRight,
    ArrowDownRight,
    Target,
    Zap,
    MessageCircle,
    Phone,
    Globe
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import dynamic from 'next/dynamic'

const GlobalPresenceMap = dynamic(() => import('./GlobalPresenceMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-50/50 animate-pulse rounded-xl flex items-center justify-center text-slate-300">Loading Map...</div>
})

interface OverviewMetricsProps {
    stats: {
        totalSpend: number
        totalCalls: number
        localCalls: number
        whatsappCalls: number
        totalWins: number
        dailyStats: { date: string, spend: number, calls: number, wins: number, cpa: number }[]
        trends?: { spend: number, calls: number, wins: number, cpa: number }
    }
    analytics: {
        byCountry: { name: string, iso: string, calls: number, quotes: number }[]
        byLanguage: { english: number, sinhala: number }
        byType: { local: number, whatsapp: number }
    }
}


export default function OverviewMetrics({ stats, analytics }: OverviewMetricsProps) {
    const costPerClient = stats.totalWins > 0 ? stats.totalSpend / stats.totalWins : 0
    const conversionRate = stats.totalCalls > 0 ? (stats.totalWins / stats.totalCalls) * 100 : 0

    const cards = [
        {
            name: 'Total Ad Spend',
            value: `$${stats.totalSpend.toLocaleString()}`,
            description: 'Total investment in campaigns',
            icon: DollarSign,
            color: 'blue'
        },
        {
            name: 'Total Inquiries',
            value: stats.totalCalls.toLocaleString(),
            description: 'Hotline & WhatsApp leads',
            icon: PhoneCall,
            color: 'emerald'
        },
        {
            name: 'Hotline Calls',
            value: stats.localCalls.toLocaleString(),
            description: 'Direct phone inquiries',
            icon: Phone,
            color: 'cyan'
        },
        {
            name: 'WhatsApp Messages',
            value: stats.whatsappCalls.toLocaleString(),
            description: 'Direct messaging leads',
            icon: MessageCircle,
            color: 'teal'
        },
        {
            name: 'Total Clients',
            value: stats.totalWins.toLocaleString(),
            description: 'Confirmed wins (Conversions)',
            icon: Users,
            color: 'indigo'
        },
        {
            name: 'Cost per Client',
            value: `$${costPerClient.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            description: 'Spend / Total Wins',
            icon: Target,
            color: 'orange'
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* KPI Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <Card key={card.name} className="p-4 group relative hover:shadow-md transition-all duration-300 border-slate-200/60">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "p-2.5 rounded-lg transition-all duration-500 ring-1 ring-inset shadow-sm",
                                card.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-500/10" :
                                    card.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" :
                                        card.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-500/10" :
                                            card.color === 'orange' ? "bg-orange-50 text-orange-600 ring-orange-500/10" :
                                                card.color === 'cyan' ? "bg-cyan-50 text-cyan-600 ring-cyan-500/10" :
                                                    "bg-teal-50 text-teal-600 ring-teal-500/10"
                            )}>
                                <card.icon className="w-5 h-5" />
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">{card.name}</p>
                            <p className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums">{card.value}</p>
                            <div className="mt-3 pt-3 border-t border-slate-50">
                                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed uppercase tracking-wide">{card.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <Card className="lg:col-span-4 p-0">
                    <CardHeader
                        title="Channel Breakdown"
                        subtitle="Engagement by inquiry type"
                        icon={<PhoneCall className="w-4 h-4" />}
                    />
                    <CardContent className="space-y-6 pt-4">
                        <div className="space-y-5">
                            <div className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-800 uppercase tracking-tight mb-1">
                                            <Phone className="w-3 h-3 text-blue-500" /> Hotline Calls
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900 tabular-nums">{stats.localCalls}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                        style={{ width: `${(stats.localCalls / (stats.totalCalls || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-800 uppercase tracking-tight mb-1">
                                            <MessageCircle className="w-3 h-3 text-emerald-500" /> WhatsApp
                                        </span>
                                    </div>
                                    <span className="text-xl font-bold text-slate-900 tabular-nums">{stats.whatsappCalls}</span>
                                </div>
                                <div className="h-1 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${(stats.whatsappCalls / (stats.totalCalls || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion Performance</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight">{conversionRate.toFixed(2)}% <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded ml-2 uppercase tracking-wide">Acquisition</span></p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-500/10">
                                    <Zap className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-8 p-0 overflow-hidden">
                    <CardHeader
                        title="Global Presence"
                        subtitle="Inquiry distribution by territory"
                        icon={<Globe className="w-4 h-4" />}
                        action={
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                Live Data
                            </div>
                        }
                    />

                    <CardContent className="h-[400px] p-0 relative bg-slate-50/30 overflow-hidden">
                        {/* Map Visualization */}
                        <div className="absolute inset-0">
                            <GlobalPresenceMap data={analytics.byCountry} />
                        </div>

                        {/* Country List Sidebar */}
                        <div className="absolute right-6 top-6 bottom-6 w-48 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-xl flex flex-col pointer-events-auto overflow-hidden z-20">
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Top Markets</p>
                            <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide pr-1">
                                {analytics.byCountry.slice(0, 5).map((c) => (
                                    <div key={c.iso} className="group">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tight">{c.name}</span>
                                            <span className="text-[10px] font-bold text-blue-600 tabular-nums">{c.calls}</span>
                                        </div>
                                        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${(c.calls / (stats.totalCalls || 1)) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
