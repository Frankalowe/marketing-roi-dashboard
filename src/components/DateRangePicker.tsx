'use client'

import { useState, useEffect, useRef } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfDay, endOfDay, parseISO, subDays } from 'date-fns'

export default function DateRangePicker() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    // Get dates from URL or default to null
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    const [startDate, setStartDate] = useState<Date | null>(fromParam ? parseISO(fromParam) : null)
    const [endDate, setEndDate] = useState<Date | null>(toParam ? parseISO(toParam) : null)

    const containerRef = useRef<HTMLDivElement>(null)

    const handlePreset = (days: number) => {
        const end = new Date()
        const start = subDays(end, days)
        setStartDate(start)
        setEndDate(end)
        // Auto apply
        const params = new URLSearchParams(searchParams.toString())
        params.set('from', format(start, 'yyyy-MM-dd'))
        params.set('to', format(end, 'yyyy-MM-dd'))
        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date)
            setEndDate(null)
        } else if (startDate && !endDate) {
            if (date < startDate) {
                setEndDate(startDate)
                setStartDate(date)
            } else {
                setEndDate(date)
            }
        }
    }

    const applyRange = () => {
        const params = new URLSearchParams(searchParams.toString())
        if (startDate) params.set('from', format(startDate, 'yyyy-MM-dd'))
        else params.delete('from')

        if (endDate) params.set('to', format(endDate, 'yyyy-MM-dd'))
        else params.delete('to')

        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const clearRange = () => {
        setStartDate(null)
        setEndDate(null)
        const params = new URLSearchParams(searchParams.toString())
        params.delete('from')
        params.delete('to')
        router.push(`?${params.toString()}`)
        setIsOpen(false)
    }

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const startDayOfWeek = startOfMonth(currentMonth).getDay()
    const blanks = Array(startDayOfWeek).fill(null)

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-[#141414] border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-medium text-gray-300"
            >
                <CalendarIcon className="w-4 h-4 text-blue-500" />
                <span>
                    {startDate ? (
                        endDate ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` : format(startDate, 'MMM d')
                    ) : 'Select Date Range'}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 z-50 w-80 bg-[#0d0d0d] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-white/5 grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handlePreset(7)}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all border border-white/5"
                        >
                            Last 7 Days
                        </button>
                        <button
                            onClick={() => handlePreset(30)}
                            className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all border border-white/5"
                        >
                            Last 30 Days
                        </button>
                    </div>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                            <ChevronLeft className="w-4 h-4 text-gray-400" />
                        </button>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h3>
                        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-7 mb-4">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-gray-600 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-1">
                            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                            {days.map(day => {
                                const isSelected = (startDate && isSameDay(day, startDate)) || (endDate && isSameDay(day, endDate))
                                const isInRange = startDate && endDate && isWithinInterval(day, { start: startDate, end: endDate })

                                return (
                                    <button
                                        key={day.toString()}
                                        onClick={() => handleDateClick(day)}
                                        className={cn(
                                            "aspect-square flex items-center justify-center text-sm rounded-xl transition-all relative",
                                            !isSameMonth(day, currentMonth) ? "text-gray-800" : "text-gray-300 hover:bg-white/5",
                                            isSelected && "bg-blue-600 text-white shadow-lg shadow-blue-600/40 z-10",
                                            isInRange && !isSelected && "bg-blue-600/10 text-blue-400 rounded-none",
                                            startDate && endDate && isSameDay(day, startDate) && "rounded-r-none",
                                            startDate && endDate && isSameDay(day, endDate) && "rounded-l-none"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-3">
                        <button
                            onClick={clearRange}
                            className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-all"
                        >
                            Reset
                        </button>
                        <button
                            onClick={applyRange}
                            disabled={!startDate}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                        >
                            Apply Filter
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
