'use client'

import { useState } from 'react'
import { LayoutDashboard, BarChart3, PhoneCall, Filter, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import OverviewMetrics from './OverviewMetrics'
import CampaignsView from './CampaignsView'
import CallAnalyticsView from './CallAnalyticsView'
import FunnelView from './FunnelView'
import ForecastingTool from '@/components/ForecastingTool'

interface DashboardTabsProps {
    stats: any
    performance: any[]
    analytics: any
    funnel: any[]
    forecasting: any
}

export default function DashboardTabs({ stats, performance, analytics, funnel, forecasting }: DashboardTabsProps) {
    const [activeTab, setActiveTab] = useState('metrics')

    const tabs = [
        { id: 'metrics', name: 'Overview', icon: LayoutDashboard },
        { id: 'campaigns', name: 'Campaigns', icon: BarChart3 },
        { id: 'calls', name: 'Calls', icon: PhoneCall },
        { id: 'funnel', name: 'Funnel', icon: Filter },
        { id: 'forecasting', name: 'Forecast', icon: PieChart },
    ]

    return (
        <div className="space-y-10">
            {/* Tab Navigation */}
            <div className="inline-flex items-center gap-1 p-1 bg-surface border border-border-subtle rounded-2xl shadow-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative group",
                            activeTab === tab.id
                                ? "text-primary"
                                : "text-gray-500 hover:text-white"
                        )}
                    >
                        {activeTab === tab.id && (
                            <div className="absolute inset-0 bg-primary/10 rounded-xl animate-in fade-in zoom-in-95 duration-300" />
                        )}
                        <tab.icon className={cn("w-4 h-4 relative z-10 transition-transform group-hover:scale-110", activeTab === tab.id ? "text-primary" : "text-gray-600 group-hover:text-white")} />
                        <span className="relative z-10 uppercase tracking-widest">{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in-up">
                {activeTab === 'metrics' && <OverviewMetrics stats={stats} analytics={analytics} />}
                {activeTab === 'campaigns' && <CampaignsView performance={performance} />}
                {activeTab === 'calls' && <CallAnalyticsView analytics={analytics} />}
                {activeTab === 'funnel' && <FunnelView steps={funnel} />}
                {activeTab === 'forecasting' && <ForecastingTool data={forecasting} />}
            </div>
        </div>
    )
}
