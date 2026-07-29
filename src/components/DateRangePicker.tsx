'use client'

import { useState, useEffect, useRef, useTransition } from 'react'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, parseISO, subDays } from 'date-fns'

export default function DateRangePicker() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [isPending, startTransition] = useTransition()

    // Get dates from URL
    const fromParam = searchParams.get('from')
    const toParam = searchParams.get('to')

    const [startDate, setStartDate] = useState<Date | null>(fromParam ? parseISO(fromParam) : null)
    const [endDate, setEndDate] = useState<Date | null>(toParam ? parseISO(toParam) : null)

    const containerRef = useRef<HTMLDivElement>(null)

    // Determine active preset
    const isLast7Days = startDate && endDate && isSameDay(startDate, subDays(new Date(), 7)) && isSameDay(endDate, new Date())
    const isLast30Days = startDate && endDate && isSameDay(startDate, subDays(new Date(), 30)) && isSameDay(endDate, new Date())

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const updateUrl = (start: Date | null, end: Date | null) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (start) params.set('from', format(start, 'yyyy-MM-dd'))
            else params.delete('from')
            
            if (end) params.set('to', format(end, 'yyyy-MM-dd'))
            else params.delete('to')
            
            router.push(`?${params.toString()}`)
        })
    }

    const handlePreset = (days: number) => {
        const end = new Date()
        const start = subDays(end, days)
        setStartDate(start)
        setEndDate(end)
        updateUrl(start, end)
        setIsOpen(false)
        setShowCalendar(false)
    }

    const handleCustomClick = () => {
        setShowCalendar(true)
    }

    const handleDateClick = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date)
            setEndDate(null)
        } else if (startDate && !endDate) {
            let newStart = startDate
            let newEnd = date
            if (date < startDate) {
                newEnd = startDate
                newStart = date
            }
            setStartDate(newStart)
            setEndDate(newEnd)
        }
    }

    const applyCustomRange = () => {
        updateUrl(startDate, endDate)
        setIsOpen(false)
    }

    const clearRange = () => {
        setStartDate(null)
        setEndDate(null)
        updateUrl(null, null)
        setIsOpen(false)
        setShowCalendar(false)
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
                disabled={isPending}
                className="flex items-center gap-3 px-4 py-2 bg-[#141414] border border-white/5 rounded-2xl hover:bg-white/10 transition-all text-sm font-medium text-gray-300 disabled:opacity-50"
            >
                {isPending ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin" /> : <CalendarIcon className="w-4 h-4 text-blue-500" />}
                <span>
                    {isLast7Days ? 'Last 7 Days' : 
                     isLast30Days ? 'Last 30 Days' :
                     startDate && endDate ? `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}` : 
                     'Select Date Range'}
                </span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 z-50 w-80 bg-[#0d0d0d] border border-white/10 rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                    
                    {/* Presets List */}
                    {!showCalendar && (
                        <div className="p-2 space-y-1">
                            <button
                                onClick={() => handlePreset(7)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                    isLast7Days ? "bg-blue-600/10 text-blue-500" : "text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <span>Last 7 Days</span>
                                {isLast7Days && <Check className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={() => handlePreset(30)}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                    isLast30Days ? "bg-blue-600/10 text-blue-500" : "text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <span>Last 30 Days</span>
                                {isLast30Days && <Check className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleCustomClick}
                                className={cn(
                                    "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                                    (!isLast7Days && !isLast30Days && startDate) ? "bg-blue-600/10 text-blue-500" : "text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <span>Custom Range...</span>
                                <ChevronRight className="w-4 h-4 opacity-50" />
                            </button>
                        </div>
                    )}

                    {/* Calendar View */}
                    {showCalendar && (
                        <div className="animate-in slide-in-from-right-4 duration-200">
                             <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <button onClick={() => setShowCalendar(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all text-gray-400">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span className="text-xs font-bold text-white uppercase tracking-widest">Select Range</span>
                                <div className="w-8" /> 
                            </div>
                            
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                                </button>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</h3>
                                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <div className="p-4">
                                <div className="grid grid-cols-7 mb-2">
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
                                    onClick={applyCustomRange}
                                    disabled={!startDate}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
