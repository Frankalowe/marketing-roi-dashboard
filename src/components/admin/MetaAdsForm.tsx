'use client'

import { useState } from 'react'
import { createRecord, updateRecord } from '@/app/(dashboard)/admin/actions'
import { X, Calendar, Database, Target, DollarSign, BarChart3, AlertCircle, MousePointerClick } from 'lucide-react'
import { format } from 'date-fns'

interface MetaAdsFormProps {
    onClose: () => void
    initialData?: any
}

export default function MetaAdsForm({ onClose, initialData }: MetaAdsFormProps) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        campaign_name: initialData?.campaign_name || '',
        campaign_id: initialData?.campaign_id || '',
        date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
        amount_spent: initialData?.amount_spent || 0,
        link_clicks: initialData?.link_clicks || 0,
        reach: initialData?.reach || 0,
        impressions: initialData?.impressions || 0,
        glitch_noted: initialData?.glitch_noted || false,
        glitch_details: initialData?.glitch_details || '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            let result
            if (initialData?.id) {
                result = await updateRecord('meta_ads', initialData.id, formData)
            } else {
                result = await createRecord('meta_ads', formData)
            }

            if (result.success) {
                onClose()
            } else {
                throw new Error(result.error)
            }
        } catch (error) {
            console.error('Error saving meta ad:', error)
            alert(`Failed to save record: ${(error as Error).message}`)
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-slate-100 w-full max-w-xl rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-primary/5 to-transparent">
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

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Campaign Info */}
                    <div className="space-y-4 pb-4 border-b border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Target className="w-3 h-3 text-primary" /> Campaign Name
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Summer Sale 2024"
                                    value={formData.campaign_name}
                                    onChange={(e) => setFormData({ ...formData, campaign_name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Database className="w-3 h-3 text-primary" /> Campaign ID
                                </label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. 120248888..."
                                    value={formData.campaign_id}
                                    onChange={(e) => setFormData({ ...formData, campaign_id: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all font-bold tracking-tight"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                        {/* Link Clicks - Major Metric */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <MousePointerClick className="w-3 h-3 text-emerald-600" /> Link Clicks
                            </label>
                            <input
                                required
                                type="number"
                                value={formData.link_clicks}
                                onChange={(e) => setFormData({ ...formData, link_clicks: parseInt(e.target.value) })}
                                className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold tracking-tight"
                            />
                            <p className="text-[9px] text-emerald-600 font-semibold">Correlates with call inquiries</p>
                        </div>
                    </div>

                    {/* Glitch Reporting */}
                    <div className="space-y-4 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <label className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Record Glitch</label>
                        </div>
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.glitch_noted}
                                    onChange={(e) => setFormData({ ...formData, glitch_noted: e.target.checked })}
                                    className="w-4 h-4 rounded border-slate-200 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="text-sm font-semibold text-slate-700">Issue detected with this record</span>
                            </label>
                            {formData.glitch_noted && (
                                <textarea
                                    placeholder="Describe the glitch or issue..."
                                    value={formData.glitch_details}
                                    onChange={(e) => setFormData({ ...formData, glitch_details: e.target.value })}
                                    className="w-full bg-white border border-amber-200 rounded-xl py-3 px-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                                    rows={3}
                                />
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-4">
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
