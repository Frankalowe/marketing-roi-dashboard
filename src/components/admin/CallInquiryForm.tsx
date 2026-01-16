'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { createRecord, updateRecord } from '@/app/(dashboard)/admin/actions'
import { Check, Loader2, X, Search, ChevronDown, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { countries, Country } from '@/lib/countries'

interface CallInquiryFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export default function CallInquiryForm({ initialData, onSuccess, onCancel }: CallInquiryFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        initialData ? {
            name: initialData.country_name,
            code: initialData.iso_code,
            dial_code: initialData.dialing_code
        } : null
    )
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const filteredCountries = useMemo(() => {
        if (!searchQuery) return countries
        const q = searchQuery.toLowerCase()
        return countries.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q) ||
            c.dial_code.includes(q)
        )
    }, [searchQuery])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!selectedCountry) {
            setError('Please select a country')
            return
        }
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const data = {
            date: formData.get('date'),
            call_type: formData.get('call_type'),
            country_name: selectedCountry.name,
            iso_code: selectedCountry.code,
            dialing_code: selectedCountry.dial_code,
            language: formData.get('language'),
            total_calls: parseInt(formData.get('total_calls') as string),
            quotation_sent: parseInt(formData.get('quotation_sent') as string),
            wins: parseInt(formData.get('wins') as string),
        }

        try {
            if (initialData?.id) {
                await updateRecord('call_inquiries', initialData.id, data)
            } else {
                await createRecord('call_inquiries', data)
            }
            onSuccess()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Date</label>
                    <input
                        name="date"
                        type="date"
                        required
                        defaultValue={initialData?.date || new Date().toISOString().split('T')[0]}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-slate-900 tracking-tight"
                    />
                </div>


                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Channel</label>
                    <select
                        name="call_type"
                        required
                        defaultValue={initialData?.call_type || 'local'}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none font-bold text-slate-900 tracking-tight"
                    >
                        <option value="local">Hotline Call</option>
                        <option value="whatsapp">WhatsApp</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Language</label>
                    <select
                        name="language"
                        required
                        defaultValue={initialData?.language || 'english'}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all appearance-none font-bold text-slate-900 tracking-tight"
                    >
                        <option value="english">English</option>
                        <option value="sinhala">Sinhala</option>
                    </select>
                </div>

                {/* Searchable Country Selector */}
                <div className="md:col-span-2 space-y-2 relative" ref={dropdownRef}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Country Selection</label>
                    <div
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-full bg-slate-50 border rounded-xl py-3 px-4 cursor-pointer flex items-center justify-between transition-all",
                            isOpen ? "border-primary ring-2 ring-primary/10" : "border-slate-100"
                        )}
                    >
                        {selectedCountry ? (
                            <div className="flex items-center gap-3">
                                <Globe className="w-4 h-4 text-blue-500" />
                                <span className="font-bold text-slate-900 tracking-tight text-sm">
                                    {selectedCountry.name} <span className="text-slate-400 ml-1">({selectedCountry.code}) {selectedCountry.dial_code}</span>
                                </span>
                            </div>
                        ) : (
                            <span className="text-slate-400 text-sm font-medium">Search and select a country...</span>
                        )}
                        <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", isOpen && "rotate-180")} />
                    </div>

                    {isOpen && (
                        <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-3 border-b border-slate-50">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        autoFocus
                                        placeholder="Search by name, code, or dialing code..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-lg py-2 pl-9 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="max-h-64 overflow-y-auto overflow-x-hidden">
                                {filteredCountries.length > 0 ? (
                                    filteredCountries.map((country) => (
                                        <div
                                            key={country.code}
                                            onClick={() => {
                                                setSelectedCountry(country)
                                                setIsOpen(false)
                                                setSearchQuery('')
                                            }}
                                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-6 rounded bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 group-hover:border-blue-100">
                                                    {country.code}
                                                </span>
                                                <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600">
                                                    {country.name}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400 tabular-nums">
                                                {country.dial_code}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No countries found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>


                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Total Inquiries</label>
                    <input
                        name="total_calls"
                        type="number"
                        min="0"
                        required
                        defaultValue={initialData?.total_calls || 0}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-slate-900 tracking-tight"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Quotes Sent</label>
                    <input
                        name="quotation_sent"
                        type="number"
                        min="0"
                        required
                        defaultValue={initialData?.quotation_sent || 0}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-bold text-slate-900 tracking-tight"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Confirmed Wins</label>
                    <input
                        name="wins"
                        type="number"
                        min="0"
                        required
                        defaultValue={initialData?.wins || 0}
                        className="w-full bg-success/5 border border-success/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-success/50 outline-none transition-all text-success font-extrabold"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-danger/5 border border-danger/10 text-danger text-xs font-bold py-3 px-4 rounded-xl text-center uppercase tracking-widest">
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <X className="w-5 h-5" />
                    Cancel
                </button>
                <button
                    disabled={loading}
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-widest py-3.5 rounded-xl shadow-sm shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    {initialData ? 'Update Inquiry' : 'Create Inquiry'}
                </button>
            </div>
        </form>
    )
}
