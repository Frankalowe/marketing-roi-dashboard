'use client'

import { useState, useEffect } from 'react'
import { createRecord, updateRecord, getCampaignsList } from '@/app/(dashboard)/admin/actions'
import { X, Calendar, Database, Target, DollarSign, BarChart3, Tag } from 'lucide-react'
import { format } from 'date-fns'

interface MetaAdsFormProps {
    onClose: () => void
    initialData?: any
}

export default function MetaAdsForm({ onClose, initialData }: MetaAdsFormProps) {
    const [loading, setLoading] = useState(false)
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [formData, setFormData] = useState({
        date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
        campaign_id: initialData?.campaign_id || '',
        campaign_name: initialData?.campaign_name || '',
        amount_spent: initialData?.amount_spent || 0,
        reach: initialData?.reach || 0,
        impressions: initialData?.impressions || 0,
        results: initialData?.results || 0,
    })

    useEffect(() => {
        getCampaignsList().then(setCampaigns)
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (initialData?.id) {
                await updateRecord('meta_ads', initialData.id, formData)
            } else {
                await createRecord('meta_ads', formData)
            }
            onClose()
        } catch (error) {
            console.error('Error saving meta ad:', error)
            alert('Failed to save record')
        } finally {
            setLoading(false)
        }
    }

    const handleCampaignSelect = (campaignId: string) => {
        const campaign = campaigns.find(c => c.campaign_id === campaignId)
        if (campaign) {
            setFormData({ ...formData, campaign_id: campaign.campaign_id, campaign_name: campaign.campaign_name })
        } else {
            setFormData({ ...formData, campaign_id: campaignId })
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-slate-100 w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-primary text-white shadow-sm shadow-primary/20">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{initialData ? 'Edit Meta Ads Data' : 'Add Meta Ads Data'}</h2>
                            <p className="text-xs text-slate-500 font-medium tracking-wide">Record daily performance and spend for your campaigns.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-all">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Date */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-primary" /> Performance Date
                            </label>
                            <input
                                required
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                            />
                        </div>

                        {/* Campaign Selection */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Tag className="w-3 h-3 text-primary" /> Select Campaign
                            </label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                                    value={formData.campaign_id}
                                    onChange={(e) => handleCampaignSelect(e.target.value)}
                                >
                                    <option value="">Pick a campaign...</option>
                                    {campaigns.map(c => (
                                        <option key={c.campaign_id} value={c.campaign_id}>{c.campaign_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Custom Campaign ID if new */}
                        {(!formData.campaign_id || !campaigns.find(c => c.campaign_id === formData.campaign_id)) && (
                            <>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign ID</label>
                                    <input
                                        required
                                        placeholder="act_..."
                                        value={formData.campaign_id}
                                        onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight placeholder:text-slate-300"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campaign Name</label>
                                    <input
                                        required
                                        placeholder="Main Launch..."
                                        value={formData.campaign_name}
                                        onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight placeholder:text-slate-300"
                                    />
                                </div>
                            </>
                        )}

                        {/* Spend */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <DollarSign className="w-3 h-3 text-primary" /> Ad Spend (USD)
                            </label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.amount_spent}
                                onChange={(e) => setFormData({ ...formData, amount_spent: parseFloat(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                            />
                        </div>

                        {/* Reach */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Users className="w-3 h-3 text-primary" /> Reach
                            </label>
                            <input
                                required
                                type="number"
                                value={formData.reach}
                                onChange={(e) => setFormData({ ...formData, reach: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                            />
                        </div>

                        {/* Impressions */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Target className="w-3 h-3 text-primary" /> Impressions
                            </label>
                            <input
                                required
                                type="number"
                                value={formData.impressions}
                                onChange={(e) => setFormData({ ...formData, impressions: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                            />
                        </div>

                        {/* Results */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <BarChart3 className="w-3 h-3 text-primary" /> Results
                            </label>
                            <input
                                required
                                type="number"
                                value={formData.results}
                                onChange={(e) => setFormData({ ...formData, results: parseInt(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 px-5 border border-slate-100 rounded-2xl text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-4 px-5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold text-[11px] uppercase tracking-widest rounded-2xl shadow-sm shadow-primary/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? 'Saving...' : initialData ? 'Update Record' : 'Create Record'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function Users(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}
