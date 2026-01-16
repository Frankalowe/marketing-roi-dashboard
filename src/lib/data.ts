'use server'

import { createClient } from '@/lib/supabase/server'

export async function getActiveCampaigns() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('meta_ads')
        .select('campaign_id, campaign_name')
        .is('deleted_at', null)
        .order('date', { ascending: false })

    // Deduplicate by campaign_id
    const unique = Array.from(new Map(data?.map(c => [c.campaign_id, c])).values())
    return unique
}

export async function getCallInquiries() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('call_inquiries')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: false })
    return data || []
}


export async function getMetaAds() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('meta_ads')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: false })
    return data || []
}

export async function getOverviewStats(startDate?: string, endDate?: string) {
    const supabase = await createClient()

    // Fetch active data with date for daily grouping
    let adsQuery = supabase.from('meta_ads').select('date, amount_spent, results, impressions').is('deleted_at', null)
    let callsQuery = supabase.from('call_inquiries').select('date, total_calls, call_type, wins').is('deleted_at', null)

    if (startDate) {
        adsQuery = adsQuery.gte('date', startDate)
        callsQuery = callsQuery.gte('date', startDate)
    }
    if (endDate) {
        adsQuery = adsQuery.lte('date', endDate)
        callsQuery = callsQuery.lte('date', endDate)
    }

    const { data: ads } = await adsQuery
    const { data: calls } = await callsQuery

    const totalSpend = ads?.reduce((sum, ad) => sum + Number(ad.amount_spent), 0) || 0
    const totalCalls = calls?.reduce((sum, call) => sum + Number(call.total_calls), 0) || 0
    const localCalls = calls?.filter(c => c.call_type === 'local').reduce((sum, call) => sum + Number(call.total_calls), 0) || 0
    const whatsappCalls = calls?.filter(c => c.call_type === 'whatsapp').reduce((sum, call) => sum + Number(call.total_calls), 0) || 0
    const totalWins = calls?.reduce((sum, call) => sum + Number(call.wins || 0), 0) || 0

    // Daily breakdown for charts
    const daily: Record<string, { spend: number, calls: number, wins: number }> = {}

    ads?.forEach(ad => {
        const d = ad.date
        if (!daily[d]) daily[d] = { spend: 0, calls: 0, wins: 0 }
        daily[d].spend += Number(ad.amount_spent)
    })

    calls?.forEach(call => {
        const d = call.date
        if (!daily[d]) daily[d] = { spend: 0, calls: 0, wins: 0 }
        daily[d].calls += Number(call.total_calls)
        daily[d].wins += Number(call.wins || 0)
    })

    const dailyStats = Object.entries(daily).map(([date, stats]) => ({
        date,
        ...stats,
        cpa: stats.wins > 0 ? stats.spend / stats.wins : 0
    })).sort((a, b) => a.date.localeCompare(b.date))

    return {
        totalSpend,
        totalCalls,
        localCalls,
        whatsappCalls,
        totalWins,
        dailyStats
    }
}

export async function getCampaignPerformance() {
    const supabase = await createClient()

    // Fetch Meta Ads data only (independent of call inquiries)
    const { data: ads } = await supabase.from('meta_ads').select('*').is('deleted_at', null)

    const performance: Record<string, any> = {}

    ads?.forEach(ad => {
        if (!performance[ad.campaign_id]) {
            performance[ad.campaign_id] = {
                campaign_id: ad.campaign_id,
                campaign_name: ad.campaign_name,
                spend: 0,
                results: 0,
                impressions: 0
            }
        }
        performance[ad.campaign_id].spend += Number(ad.amount_spent)
        performance[ad.campaign_id].results += Number(ad.results || 0)
        performance[ad.campaign_id].impressions += Number(ad.impressions || 0)
    })

    return Object.values(performance).map(p => ({
        ...p,
        costPerResult: p.results > 0 ? p.spend / p.results : 0,
    }))
}

export async function getCallAnalytics() {
    const supabase = await createClient()
    const { data: calls } = await supabase.from('call_inquiries').select('*').is('deleted_at', null)

    const byCountry: Record<string, any> = {}
    const byLanguage = { english: 0, sinhala: 0 }
    const byType = { local: 0, whatsapp: 0 }

    calls?.forEach(call => {
        // By Country
        if (!byCountry[call.country_name]) {
            byCountry[call.country_name] = {
                name: call.country_name,
                iso: call.iso_code,
                calls: 0,
                quotes: 0,
            }
        }
        byCountry[call.country_name].calls += Number(call.total_calls)
        byCountry[call.country_name].quotes += Number(call.quotation_sent)

        // By Language
        if (call.language === 'english') byLanguage.english += Number(call.total_calls)
        if (call.language === 'sinhala') byLanguage.sinhala += Number(call.total_calls)

        // By Type
        if (call.call_type === 'local') byType.local += Number(call.total_calls)
        if (call.call_type === 'whatsapp') byType.whatsapp += Number(call.total_calls)
    })

    return {
        byCountry: Object.values(byCountry).sort((a, b) => b.calls - a.calls),
        byLanguage,
        byType
    }
}

export async function getFunnelData() {
    const supabase = await createClient()

    const { data: ads } = await supabase.from('meta_ads').select('impressions, results').is('deleted_at', null)
    const { data: calls } = await supabase.from('call_inquiries').select('total_calls, wins').is('deleted_at', null)

    const impressions = ads?.reduce((sum, ad) => sum + Number(ad.impressions || 0), 0) || 0
    const results = ads?.reduce((sum, ad) => sum + Number(ad.results || 0), 0) || 0
    const totalCalls = calls?.reduce((sum, call) => sum + Number(call.total_calls), 0) || 0
    const clients = calls?.reduce((sum, call) => sum + Number(call.wins || 0), 0) || 0

    return [
        { name: 'Impressions', value: impressions, color: 'bg-blue-600' },
        { name: 'Results', value: results, color: 'bg-indigo-600' },
        { name: 'Inquiries', value: totalCalls, color: 'bg-emerald-600' },
        { name: 'Clients', value: clients, color: 'bg-orange-600' },
    ]
}

export async function getForecastingData() {
    const supabase = await createClient()

    // Requirement: < 14 days or < 30 wins
    const { data: ads } = await supabase.from('meta_ads').select('date, amount_spent').is('deleted_at', null).order('date', { ascending: true })
    const { data: calls } = await supabase.from('call_inquiries').select('call_type, language, total_calls, wins').is('deleted_at', null)

    const wins = calls?.reduce((sum, c) => sum + Number(c.wins || 0), 0) || 0
    const totalSpend = ads?.reduce((sum, ad) => sum + Number(ad.amount_spent), 0) || 0
    const totalCalls = calls?.reduce((sum, call) => sum + Number(call.total_calls), 0) || 0

    let daysOfData = 0
    if (ads && ads.length > 0) {
        const start = new Date(ads[0].date)
        const end = new Date(ads[ads.length - 1].date)
        daysOfData = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    const isEnabled = daysOfData >= 14 && wins >= 30

    // Metrics for forecasting
    const avgCPA = wins > 0 ? totalSpend / wins : 0
    const callsPerWin = wins > 0 ? totalCalls / wins : 0

    // Splits
    const localCalls = calls?.filter(c => c.call_type === 'local').reduce((sum, c) => sum + Number(c.total_calls), 0) || 0
    const whatsappCalls = calls?.filter(c => c.call_type === 'whatsapp').reduce((sum, c) => sum + Number(c.total_calls), 0) || 0
    const englishCalls = calls?.filter(c => c.language === 'english').reduce((sum, c) => sum + Number(c.total_calls), 0) || 0
    const sinhalaCalls = calls?.filter(c => c.language === 'sinhala').reduce((sum, c) => sum + Number(c.total_calls), 0) || 0

    const localRatio = totalCalls > 0 ? localCalls / totalCalls : 0.5
    const engRatio = totalCalls > 0 ? englishCalls / totalCalls : 0.5

    return {
        isEnabled,
        wins,
        daysOfData,
        avgCPA,
        callsPerWin,
        localRatio,
        engRatio
    }
}

export async function globalSearch(query: string) {
    const supabase = await createClient()
    const q = query.toLowerCase()

    const { data: ads } = await supabase.from('meta_ads').select('campaign_name, campaign_id').is('deleted_at', null)
    const { data: calls } = await supabase.from('call_inquiries').select('country_name, iso_code, dialing_code').is('deleted_at', null)

    const campaigns = Array.from(new Set(ads?.filter(a =>
        a.campaign_name.toLowerCase().includes(q) ||
        a.campaign_id.toLowerCase().includes(q)
    ).map(a => JSON.stringify({ name: a.campaign_name, id: a.campaign_id })))).map(s => JSON.parse(s))

    const countries = Array.from(new Set(calls?.filter(c =>
        c.country_name.toLowerCase().includes(q) ||
        c.iso_code.toLowerCase().includes(q) ||
        c.dialing_code.includes(q)
    ).map(c => JSON.stringify({ name: c.country_name, iso: c.iso_code })))).map(s => JSON.parse(s))

    return { campaigns, countries }
}
