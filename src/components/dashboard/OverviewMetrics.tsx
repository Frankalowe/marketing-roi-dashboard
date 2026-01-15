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

interface OverviewMetricsProps {
    stats: {
        totalSpend: number
        totalCalls: number
        localCalls: number
        whatsappCalls: number
        totalWins: number
        costPerClient: number
        conversionRate: number
    }
    analytics: {
        byCountry: { name: string, iso: string, calls: number, quotes: number }[]
        byLanguage: { english: number, sinhala: number }
        byType: { local: number, whatsapp: number }
    }
}

export default function OverviewMetrics({ stats, analytics }: OverviewMetricsProps) {
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
            value: `$${stats.costPerClient.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
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
                    <Card key={card.name} className="p-6 group relative">
                        <div className="flex items-start justify-between mb-6">
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
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">{card.name}</p>
                            <p className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">{card.value}</p>
                            <div className="mt-4 pt-4 border-t border-slate-50">
                                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed uppercase tracking-wide">{card.description}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <Card className="lg:col-span-4 p-0">
                    <CardHeader
                        title="Channel Breakdown"
                        subtitle="Engagement by inquiry type"
                        icon={<PhoneCall className="w-4 h-4" />}
                    />
                    <CardContent className="space-y-8 pt-6">
                        <div className="space-y-6">
                            <div className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-tight mb-1">
                                            <Phone className="w-3 h-3 text-blue-500" /> Hotline Calls
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 tabular-nums">{stats.localCalls}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                                        style={{ width: `${(stats.localCalls / (stats.totalCalls || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-end mb-3">
                                    <div className="flex flex-col">
                                        <span className="flex items-center gap-2 text-[11px] font-bold text-slate-800 uppercase tracking-tight mb-1">
                                            <MessageCircle className="w-3 h-3 text-emerald-500" /> WhatsApp
                                        </span>
                                    </div>
                                    <span className="text-2xl font-bold text-slate-900 tabular-nums">{stats.whatsappCalls}</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                                        style={{ width: `${(stats.whatsappCalls / (stats.totalCalls || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Conversion Performance</p>
                                    <p className="text-2xl font-bold text-slate-900 tracking-tight">{stats.conversionRate.toFixed(2)}% <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded ml-2 uppercase tracking-wide">Elite Acquisition</span></p>
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
                                Live Global Feed
                            </div>
                        }
                    />
                    <CardContent className="h-[380px] p-0 relative bg-slate-50/30">
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
                                    // Map ISO codes to approximate coordinates
                                    const coords: Record<string, { x: number, y: number }> = {
                                        'US': { x: 200, y: 180 },
                                        'GB': { x: 480, y: 130 },
                                        'DE': { x: 500, y: 140 },
                                        'FR': { x: 490, y: 155 },
                                        'LK': { x: 700, y: 320 },
                                        'IN': { x: 680, y: 280 },
                                        'AE': { x: 600, y: 240 },
                                        'AU': { x: 800, y: 420 },
                                        'CA': { x: 180, y: 120 },
                                        'SG': { x: 730, y: 350 },
                                    }

                                    const pos = coords[country.iso] || { x: 500 + (Math.random() - 0.5) * 400, y: 250 + (Math.random() - 0.5) * 200 }
                                    const size = Math.min(15, 6 + (country.calls / (stats.totalCalls || 1)) * 30)

                                    return (
                                        <g key={country.iso} className="group/dot cursor-pointer">
                                            <circle
                                                cx={pos.x}
                                                cy={pos.y}
                                                r={size}
                                                className="fill-blue-500/20 stroke-blue-500/40 stroke-2 animate-pulse"
                                            />
                                            <circle
                                                cx={pos.x}
                                                cy={pos.y}
                                                r={size / 2}
                                                className="fill-blue-600 shadow-lg"
                                            />
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
                                            <div
                                                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${(c.calls / (stats.totalCalls || 1)) * 100}%` }}
                                            />
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
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-slate-100 rounded-full shadow-sm">
                                <div className="w-2 h-2 rounded-full bg-blue-500/20 border border-blue-500/40" />
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Growing Market</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
