import {
    getOverviewStats,
    getCampaignPerformance,
    getCallAnalytics,
    getFunnelData,
    getForecastingData
} from '@/lib/data'
import DateRangePicker from '@/components/DateRangePicker'
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
