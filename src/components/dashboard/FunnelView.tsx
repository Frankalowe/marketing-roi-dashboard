'use client'

import {
    BarChart3,
    ArrowDown,
    MousePointer2,
    PhoneCall,
    UserCheck,
    Zap,
    TrendingDown,
    TrendingUp,
    Activity
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'

interface FunnelViewProps {
    steps: any[]
}

export default function FunnelView({ steps }: FunnelViewProps) {
    const funnelSteps = steps.map((step, i) => {
        const nextStep = steps[i + 1]
        const dropOff = nextStep ? ((step.value - nextStep.value) / (step.value || 1)) * 100 : 0
        const conversion = nextStep ? (nextStep.value / (step.value || 1)) * 100 : 0

        return {
            ...step,
            dropOff: dropOff.toFixed(1),
            conversion: conversion.toFixed(2)
        }
    })

    const globalConversion = funnelSteps[funnelSteps.length - 1].value > 0
        ? ((funnelSteps[funnelSteps.length - 1].value / funnelSteps[0].value) * 100).toFixed(4)
        : 0

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-600 ring-1 ring-slate-100 shadow-sm border border-white">
                        <Activity className="w-3.5 h-3.5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest leading-none mb-1">Conversion Journey</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Full-funnel attribution index</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-100 p-1 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-2 bg-blue-50/50 border border-blue-100 px-3 py-1.5 rounded-lg">
                        <Zap className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                            ROI Yield: {globalConversion}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
                {funnelSteps.map((step, i) => (
                    <div key={step.name} className="relative group">
                        <Card className={cn(
                            "h-full p-5 transition-all duration-500 overflow-hidden relative",
                            i === 0 ? "border-blue-200 bg-blue-50/10" : "bg-white"
                        )}>
                            <div className={cn(
                                "absolute top-0 left-0 right-0 h-0.5 transition-colors",
                                i === 0 ? "bg-blue-500" : "bg-slate-50 group-hover:bg-blue-200/50"
                            )} />

                            <div className="flex items-start justify-between mb-5">
                                <div className={cn(
                                    "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ring-1 ring-inset border border-white",
                                    i === 0 ? "bg-blue-500 text-white ring-blue-600/20" :
                                        i === 1 ? "bg-indigo-500 text-white ring-indigo-600/20" :
                                            i === 2 ? "bg-emerald-500 text-white ring-emerald-600/20" :
                                                "bg-amber-500 text-white ring-amber-600/20"
                                )}>
                                    {i === 0 && <BarChart3 className="w-5 h-5" />}
                                    {i === 1 && <MousePointer2 className="w-5 h-5" />}
                                    {i === 2 && <PhoneCall className="w-5 h-5" />}
                                    {i === 3 && <UserCheck className="w-5 h-5" />}
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 opacity-80">{step.name}</p>
                                    <p className="text-3xl font-bold text-slate-900 tracking-tight tabular-nums">
                                        {step.value.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {i > 0 && (
                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50">
                                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
                                        <TrendingUp className="w-3 h-3" />
                                        <span className="text-[11px] font-bold tabular-nums">{step.conversion}%</span>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Retention</span>
                                </div>
                            )}

                            {i < funnelSteps.length - 1 && (
                                <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 transition-transform group-hover:translate-x-1">
                                    <div className="w-4 h-4 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-md">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                                    </div>
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                        <div className="bg-slate-900 text-white text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-1.5 rounded shadow-2xl border border-white/10">
                                            Drop: {step.dropOff}%
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}
