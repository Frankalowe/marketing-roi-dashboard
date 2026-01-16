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
    Globe,
    Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface OverviewMetricsProps {
    stats: {
        totalSpend: number
        totalCalls: number
        localCalls: number
        whatsappCalls: number
        totalWins: number
        dailyStats: { date: string, spend: number, calls: number, wins: number, cpa: number }[]
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
            color: 'blue',
            trend: '+12.5%',
            trendUp: true
        },
        {
            name: 'Total Inquiries',
            value: stats.totalCalls.toLocaleString(),
            description: 'Hotline & WhatsApp leads',
            icon: PhoneCall,
            color: 'emerald',
            trend: '+5.2%',
            trendUp: true
        },
        {
            name: 'Total Clients',
            value: stats.totalWins.toLocaleString(),
            description: 'Confirmed wins (Conversions)',
            icon: Users,
            color: 'indigo',
            trend: '+3.1%',
            trendUp: true
        },
        {
            name: 'Cost per Client',
            value: `$${costPerClient.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            description: 'Spend / Total Wins',
            icon: Target,
            color: 'orange',
            trend: '-2.4%',
            trendUp: false
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <Card key={card.name} className="p-4 group relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className={cn(
                                "p-2.5 rounded-lg transition-all duration-500 ring-1 ring-inset shadow-sm",
                                card.color === 'blue' ? "bg-blue-50 text-blue-600 ring-blue-500/10" :
                                    card.color === 'emerald' ? "bg-emerald-50 text-emerald-600 ring-emerald-500/10" :
                                        card.color === 'indigo' ? "bg-indigo-50 text-indigo-600 ring-indigo-500/10" :
                                            "bg-orange-50 text-orange-600 ring-orange-500/10"
                            )}>
                                <card.icon className="w-5 h-5" />
                            </div>
                            <div className={cn(
                                "flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md",
                                card.trendUp ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                            )}>
                                {card.trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {card.trend}
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

                <Card className="lg:col-span-8 p-0 overflow-hidden flex flex-col">
                    <CardHeader
                        title="Daily Performance"
                        subtitle="Day-by-day spend and inquiry tracking"
                        icon={<Activity className="w-4 h-4" />}
                    />
                    <CardContent className="flex-1 p-0 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ad Spend</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inquiries</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Wins</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">CPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.dailyStats.slice().reverse().map((day) => (
                                    <tr key={day.date} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-[11px] font-bold text-slate-900 uppercase tabular-nums">{day.date}</td>
                                        <td className="px-6 py-4 text-sm font-extrabold text-slate-900 tabular-nums">${day.spend.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-extrabold text-slate-900 tabular-nums">{day.calls}</span>
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-extrabold text-success tabular-nums">{day.wins}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-[11px] font-bold text-blue-600 tabular-nums group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                ${day.cpa.toFixed(0)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {stats.dailyStats.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            No daily performance data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <Card className="lg:col-span-12 p-0 overflow-hidden">
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
                    <CardContent className="h-[320px] p-0 relative bg-slate-50/30">
                        {/* Map Visualization */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <svg viewBox="0 0 1000 500" className="w-full h-full text-slate-200">
                                {/* Simplified World Map Paths */}
                                <path fill="currentColor" d="M150,150 L180,140 L220,160 L240,220 L200,280 L140,260 Z" className="hover:text-blue-200 transition-colors" /> {/* NA */}
                                <path fill="currentColor" d="M220,300 L260,320 L270,400 L240,450 L200,420 Z" className="hover:text-blue-200 transition-colors" /> {/* SA */}
                                <path fill="currentColor" d="M450,120 L480,100 L550,110 L560,160 L520,180 L480,160 Z" className="hover:text-blue-200 transition-colors" /> {/* EU */}
                                <path fill="currentColor" d="M480,200 L550,220 L580,300 L540,400 L460,380 L440,280 Z" className="hover:text-blue-200 transition-colors" /> {/* AF */}
                                <path fill="currentColor" d="M580,120 L750,110 L850,180 L820,350 L650,380 L580,260 Z" className="hover:text-blue-200 transition-colors" /> {/* AS */}
                                <path fill="currentColor" d="M750,380 L820,390 L850,450 L770,460 Z" className="hover:text-blue-200 transition-colors" /> {/* OC */}

                                {/* Dots for active countries */}
                                {analytics.byCountry.map((country, idx) => {
                                    const coords: Record<string, { x: number, y: number }> = {
                                        'US': { x: 200, y: 180 }, 'GB': { x: 480, y: 130 }, 'DE': { x: 500, y: 140 },
                                        'FR': { x: 490, y: 155 }, 'LK': { x: 700, y: 320 }, 'IN': { x: 680, y: 280 },
                                        'AE': { x: 600, y: 240 }, 'AU': { x: 800, y: 420 }, 'CA': { x: 180, y: 120 },
                                        'SG': { x: 730, y: 350 },
                                    }
                                    const pos = coords[country.iso] || { x: 500 + (Math.random() - 0.5) * 400, y: 250 + (Math.random() - 0.5) * 200 }
                                    const size = Math.min(15, 6 + (country.calls / (stats.totalCalls || 1)) * 30)
                                    return (
                                        <g key={country.iso} className="group/dot cursor-pointer">
                                            <circle cx={pos.x} cy={pos.y} r={size} className="fill-blue-500/10 stroke-blue-500/30 stroke-2 animate-pulse" />
                                            <circle cx={pos.x} cy={pos.y} r={size / 2} className="fill-blue-600 shadow-lg transition-transform group-hover/dot:scale-150" />
                                            <foreignObject x={pos.x + 10} y={pos.y - 10} width="150" height="40" className="overflow-visible opacity-0 group-hover/dot:opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-slate-900 text-white p-2 rounded-lg text-[10px] whitespace-nowrap border border-white/10 shadow-2xl">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-bold uppercase tracking-tight">{country.name}</span>
                                                        <span className="text-slate-400 font-bold">{country.iso}</span>
                                                    </div>
                                                    <div className="text-blue-400 font-bold tabular-nums">{country.calls} INQUIRIES</div>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    )
                                })}
                            </svg>
                        </div>

                        {/* Country List Sidebar */}
                        <div className="absolute right-6 top-6 bottom-6 w-48 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-2xl p-4 shadow-xl flex flex-col pointer-events-auto overflow-hidden">
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

                        {/* Legend */}
                        <div className="absolute left-6 bottom-6 flex gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-600" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">High Volume</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
