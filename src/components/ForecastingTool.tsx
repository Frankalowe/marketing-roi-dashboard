'use client'

import { useState } from 'react'
import {
    Calculator,
    Target,
    DollarSign,
    PhoneCall,
    AlertTriangle,
    Zap,
    Lock,
    MessageCircle,
    Phone,
    Globe,
    Languages,
    Activity,
    TrendingDown,
    TrendingUp,
    Cpu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface ForecastingToolProps {
    data: {
        isEnabled: boolean
        wins: number
        daysOfData: number
        avgCPA: number
        callsPerWin: number
        localRatio: number
        engRatio: number
    }
}

export default function ForecastingTool({ data }: ForecastingToolProps) {
    const [targetClients, setTargetClients] = useState(10)

    const requiredSpend = targetClients * data.avgCPA
    const expectedCalls = targetClients * data.callsPerWin
    const localCalls = expectedCalls * data.localRatio
    const whatsappCalls = expectedCalls * (1 - data.localRatio)
    const englishCalls = expectedCalls * data.engRatio
    const sinhalaCalls = expectedCalls * (1 - data.engRatio)

    if (!data.isEnabled) {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
                <Card className="p-12 text-center relative overflow-hidden bg-white border-warning/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-warning/20 to-orange-500/20" />
                    <div className="w-20 h-20 rounded-[32px] bg-warning/5 flex items-center justify-center mx-auto mb-10 border border-warning/10 transition-all duration-700 hover:scale-110">
                        <Lock className="w-8 h-8 text-warning" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Forecasting Locked</h2>
                    <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed mb-12">
                        We need more data to generate accurate projections. Please continue recording inquiries to unlock this feature.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-12">
                        <div className={cn(
                            "p-8 rounded-[24px] border transition-all duration-700",
                            data.daysOfData >= 14 ? "bg-success/5 border-success/10 text-success" : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                        )}>
                            <p className="text-3xl font-extrabold tabular-nums">{data.daysOfData} <span className="text-xs font-bold text-slate-400">/ 14</span></p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Days of Data</p>
                        </div>
                        <div className={cn(
                            "p-8 rounded-[24px] border transition-all duration-700",
                            data.wins >= 30 ? "bg-success/5 border-success/10 text-success" : "bg-slate-50 border-slate-100 text-slate-400 opacity-60"
                        )}>
                            <p className="text-3xl font-extrabold tabular-nums">{data.wins} <span className="text-xs font-bold text-slate-400">/ 30</span></p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Confirmed Wins</p>
                        </div>
                    </div>

                    <div className="p-5 bg-warning/5 border border-warning/10 rounded-2xl flex items-center justify-center gap-3 text-warning text-xs font-bold uppercase tracking-widest">
                        <AlertTriangle className="w-4 h-4" />
                        Insufficient data for reliable financial projections.
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Input Card */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                    <Card className="p-0 border-primary/10 bg-primary/[0.01]">
                        <CardHeader
                            title="Target Goals"
                            subtitle="Desired acquisition outcome"
                            icon={<Target className="w-5 h-5" />}
                        />
                        <CardContent className="p-10 space-y-12">
                            <div className="text-center group">
                                <div className="inline-flex items-end gap-2 px-10 py-6 bg-white border border-slate-100 rounded-[40px] shadow-sm transition-transform group-hover:scale-105 duration-700">
                                    <span className="text-8xl font-extrabold text-slate-900 tracking-tight tabular-nums leading-none">{targetClients}</span>
                                    <div className="flex flex-col items-start pb-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-widest">NEW</span>
                                        <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">CLIENTS</span>
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-8">Target Acquisition Range</p>
                            </div>

                            <div className="space-y-6 px-4">
                                <input
                                    type="range"
                                    min="5"
                                    max="1000"
                                    step="5"
                                    value={targetClients}
                                    onChange={(e) => setTargetClients(parseInt(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-primary hover:accent-primary/80 transition-all outline-none"
                                />
                                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest tabular-nums">
                                    <span className="bg-slate-50 px-3 py-1 rounded-lg">5 MIN</span>
                                    <span className="bg-slate-50 px-3 py-1 rounded-lg">500 MID</span>
                                    <span className="bg-slate-50 px-3 py-1 rounded-lg">1000 MAX</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setTargetClients(10)}
                                className="w-full py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-bold tracking-widest uppercase hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group text-slate-400 hover:text-slate-900"
                            >
                                <Calculator className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                                RESET FORECAST
                            </button>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-primary/5 border border-primary/10 rounded-[32px] flex items-start gap-4 shadow-sm">
                        <div className="p-3 bg-white rounded-2xl shadow-sm">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium uppercase tracking-widest pt-1">
                            Projection based on <strong className="text-slate-900">{data.daysOfData} days</strong> of historical data. Confidence level elevated.
                        </p>
                    </div>
                </div>

                {/* Results Card */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-8">
                    <Card className="p-0">
                        <CardHeader
                            title="Forecast Results"
                            subtitle="Calculated resources for target volume"
                            icon={<Zap className="w-5 h-5" />}
                            action={
                                <div className="px-4 py-2 bg-success/5 border border-success/10 rounded-xl flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                                    <TrendingUp className="w-3.5 h-3.5" /> Stability: 98%
                                </div>
                            }
                        />
                        <CardContent className="p-10 pt-4 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] group hover:border-primary/20 transition-all duration-700 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6 text-primary">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Budget Required</span>
                                    </div>
                                    <p className="text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                                        ${requiredSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] group hover:border-success/20 transition-all duration-700 relative overflow-hidden">
                                    <div className="flex items-center gap-3 mb-6 text-success">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <PhoneCall className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Expected Inquiries</span>
                                    </div>
                                    <p className="text-5xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                                        {expectedCalls.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-slate-100">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Channel & Language Projection</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                    {[
                                        { label: 'Hotline', val: localCalls, icon: Phone, color: 'text-primary' },
                                        { label: 'WhatsApp', val: whatsappCalls, icon: MessageCircle, color: 'text-success' },
                                        { label: 'English', val: englishCalls, icon: Globe, color: 'text-indigo-500' },
                                        { label: 'Sinhala', val: sinhalaCalls, icon: Languages, color: 'text-orange-500' }
                                    ].map((it, i) => (
                                        <div key={i} className="space-y-3 group hover:scale-105 transition-transform">
                                            <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest", it.color)}>
                                                <it.icon className="w-3.5 h-3.5" /> {it.label}
                                            </div>
                                            <p className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">{it.val.toFixed(0)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <Card className="p-6 bg-slate-50/50 border-slate-100 flex items-center justify-between group">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Cost per Win</p>
                                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">${data.avgCPA.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                                <Target className="w-5 h-5" />
                            </div>
                        </Card>
                        <Card className="p-6 bg-slate-50/50 border-slate-100 flex items-center justify-between group">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inquiry Win Rate</p>
                                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{(1 / data.callsPerWin * 100).toFixed(1)}%</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-white shadow-sm text-slate-400 group-hover:text-success transition-colors">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
