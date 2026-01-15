'use client'

import { useState, useMemo } from 'react'
import { Plus, Filter, Edit2, Trash2, Calendar, Database, Zap, ArrowUpRight, TrendingUp, X, Activity } from 'lucide-react'
import { format } from 'date-fns'
import MetaAdsForm from '@/components/admin/MetaAdsForm'
import { deleteRecord } from '@/app/(dashboard)/admin/actions'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { DataTable } from '@/components/shared/DataTable'

export default function MetaAdsManagementClient({ initialAds }: { initialAds: any[] }) {
    const [ads, setAds] = useState(initialAds)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<any>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return
        try {
            await deleteRecord('meta_ads', id)
            setAds(ads.filter(a => a.id !== id))
        } catch (error) {
            alert('Failed to delete record')
        }
    }

    const columns = [
        {
            header: 'Date',
            render: (row: any) => (
                <span className="text-sm font-medium text-slate-500 tabular-nums">
                    {format(new Date(row.date), 'MMM dd, yyyy')}
                </span>
            )
        },
        {
            header: 'Campaign',
            render: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold uppercase tracking-tight">{row.campaign_name}</span>
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{row.campaign_id}</span>
                </div>
            )
        },
        {
            header: 'Ad Spend',
            render: (row: any) => (
                <span className="text-sm text-slate-900 font-extrabold tabular-nums">
                    ${Number(row.amount_spent).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            header: 'Impressions',
            render: (row: any) => (
                <span className="text-sm text-slate-500 font-medium tabular-nums">
                    {Number(row.impressions).toLocaleString()}
                </span>
            )
        },
        {
            header: 'Results',
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-success font-extrabold tabular-nums">{row.results}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-success/20" />
                </div>
            )
        },
        {
            header: 'CTR / Conv.',
            render: (row: any) => (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-lg text-[10px] font-bold text-primary tabular-nums">
                    {row.impressions > 0 ? ((row.results / row.impressions) * 100).toFixed(2) : 0}%
                </div>
            )
        },
        {
            header: 'Actions',
            className: 'text-right',
            render: (row: any) => (
                <div className="flex justify-end gap-1">
                    <button
                        onClick={() => {
                            setEditingRecord(row)
                            setIsFormOpen(true)
                        }}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 hover:bg-danger/5 rounded-xl text-slate-400 hover:text-danger transition-all"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-blue-50/10 border-blue-500/10 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4 opacity-80">Campaign Control</p>
                    <button
                        onClick={() => {
                            setEditingRecord(null)
                            setIsFormOpen(true)
                        }}
                        className="w-full h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 font-bold text-[10px] tracking-widest uppercase border border-blue-400/20"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Record
                    </button>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <CardHeader
                    title="Meta Ads Records"
                    subtitle="Campaign performance and spend tracking"
                    icon={<Database className="w-4 h-4" />}
                    action={
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[9px] font-bold text-emerald-600 uppercase tracking-widest">
                            <Zap className="w-3.5 h-3.5" /> Real-time Node Sync
                        </div>
                    }
                />
                <div className="px-1 pb-1">
                    <DataTable
                        data={ads}
                        columns={columns}
                        emptyMessage="No campaign records found."
                    />
                </div>
            </Card>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] border border-white/20 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl p-8 bg-white border border-slate-200/60 rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/10 shadow-sm">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-none mb-1.5">{editingRecord ? 'Edit Record' : 'Add New Record'}</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-80">Campaign Management Node</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setIsFormOpen(false)
                                    setEditingRecord(null)
                                }}
                                className="p-2 hover:bg-slate-50 rounded-xl transition-all group"
                            >
                                <X className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                            </button>
                        </div>
                        <MetaAdsForm
                            onClose={() => {
                                setIsFormOpen(false)
                                setEditingRecord(null)
                            }}
                            initialData={editingRecord}
                        />
                    </Card>
                </div>
            )}
        </div>
    )
}
