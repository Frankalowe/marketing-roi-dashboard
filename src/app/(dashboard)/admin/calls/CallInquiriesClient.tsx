'use client'

import { useState, useMemo } from 'react'
import { Plus, Filter, Edit2, Trash2, Calendar, Phone, Zap, Globe, MessageCircle, Activity, X } from 'lucide-react'
import { format } from 'date-fns'
import CallInquiryForm from '@/components/admin/CallInquiryForm'
import { deleteRecord } from '@/app/(dashboard)/admin/actions'
import { Card, CardHeader, CardContent } from '@/components/shared/Card'
import { DataTable } from '@/components/shared/DataTable'
import { cn } from '@/lib/utils'

interface CallInquiriesClientProps {
    initialInquiries: any[]
    campaigns: any[]
}

export default function CallInquiriesClient({ initialInquiries, campaigns }: CallInquiriesClientProps) {
    const [inquiries, setInquiries] = useState(initialInquiries)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingRecord, setEditingRecord] = useState<any>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return
        try {
            await deleteRecord('call_inquiries', id)
            setInquiries(inquiries.filter(i => i.id !== id))
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
            header: 'Market',
            render: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-sm text-slate-900 font-bold uppercase tracking-tight">{row.country_name}</span>
                    <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">{row.iso_code} · {row.dialing_code}</span>
                </div>
            )
        },
        {
            header: 'Channel',
            render: (row: any) => (
                <div className={cn(
                    "inline-flex items-center gap-2 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest",
                    row.call_type === 'whatsapp'
                        ? "bg-success/5 text-success border border-success/10"
                        : "bg-primary/5 text-primary border border-primary/10"
                )}>
                    {row.call_type === 'whatsapp' ? <MessageCircle className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                    {row.call_type === 'local' ? 'hotline' : row.call_type}
                </div>
            )
        },
        {
            header: 'Language',
            render: (row: any) => (
                <div className="flex items-center gap-2 text-slate-500">
                    <Globe className="w-3 h-3" />
                    <span className="text-sm font-medium capitalize">{row.language}</span>
                </div>
            )
        },
        {
            header: 'Total Inquiries',
            render: (row: any) => (
                <span className="text-sm text-slate-900 font-extrabold tabular-nums">{row.total_calls}</span>
            )
        },
        {
            header: 'Quotes Sent',
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-900 font-extrabold tabular-nums">{row.quotation_sent}</span>
                </div>
            )
        },
        {
            header: 'Wins',
            render: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-success font-extrabold tabular-nums">{row.wins || 0}</span>
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
                <Card className="p-6 bg-emerald-50/10 border-emerald-500/10 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4 opacity-80">Engagement Control</p>
                    <button
                        onClick={() => {
                            setEditingRecord(null)
                            setIsFormOpen(true)
                        }}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 font-bold text-[10px] tracking-widest uppercase border border-emerald-400/20"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Log Inquiry
                    </button>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
                </Card>
            </div>

            <Card className="p-0 overflow-hidden">
                <CardHeader
                    title="Hotline & Message Inquiries"
                    subtitle="Detailed record of customer engagement"
                    icon={<Activity className="w-4 h-4" />}
                    action={
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                            <Zap className="w-3.5 h-3.5" /> Nodes Synchronized
                        </div>
                    }
                />
                <div className="px-1 pb-1">
                    <DataTable
                        data={inquiries}
                        columns={columns}
                        emptyMessage="No inquiry records found."
                    />
                </div>
            </Card>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] border border-white/20 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <Card className="w-full max-w-2xl p-8 bg-white border border-slate-200/60 rounded-[24px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10 shadow-sm">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 leading-none mb-1.5">{editingRecord ? 'Edit Inquiry' : 'Log New Inquiry'}</h2>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-80">Performance Node Update</p>
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
                        <CallInquiryForm
                            onSuccess={() => {
                                setIsFormOpen(false)
                                setEditingRecord(null)
                            }}
                            onCancel={() => {
                                setIsFormOpen(false)
                                setEditingRecord(null)
                            }}
                            initialData={editingRecord}
                            campaigns={campaigns}
                        />
                    </Card>
                </div>
            )}
        </div>
    )
}
