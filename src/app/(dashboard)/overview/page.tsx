import {
    getOverviewStats,
    getCampaignPerformance,
    getCallAnalytics,
    getFunnelData,
    getForecastingData
} from '@/lib/data'
import { cn } from '@/lib/utils'
import DateRangePicker from '@/components/DateRangePicker'
import Link from 'next/link'
import DashboardTabs from '@/components/dashboard/DashboardTabs'

export default async function OverviewPage({
    searchParams
}: {
    searchParams: Promise<{ from?: string; to?: string }>
}) {
    const { from, to } = await searchParams

    // Fetch all data in parallel
    const [stats, performance, analytics, funnel, forecasting] = await Promise.all([
        getOverviewStats(from, to),
        getCampaignPerformance(),
        getCallAnalytics(),
        getFunnelData(),
        getForecastingData()
    ])

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                        Performance Overview
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Real-time marketing metrics and conversion tracking.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#141414] border border-white/5 p-1 rounded-2xl">
                        <Link
                            href="/overview"
                            className={cn(
                                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                                !from && !to ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"
                            )}
                        >
                            All Time
                        </Link>
                        <Link
                            href={`/overview?from=${new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
                            className={cn(
                                "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                                from && !to ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Last 30 Days
                        </Link>
                    </div>
                    <DateRangePicker />
                </div>
            </div>

            <DashboardTabs
                stats={stats}
                performance={performance}
                analytics={analytics}
                funnel={funnel}
                forecasting={forecasting}
            />
        </div>
    )
}
