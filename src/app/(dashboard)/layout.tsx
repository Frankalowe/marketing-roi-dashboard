'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    BarChart3,
    LayoutDashboard,
    Target,
    PhoneCall,
    Filter,
    TrendingUp,
    LogOut,
    Menu,
    X,
    PieChart,
    ArrowRightLeft,
    ChevronRight,
    Database,
    Globe,
    Settings,
    RefreshCw,
    Moon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '../(auth)/login/actions'
import { useState } from 'react'

const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
]

const adminNavigation = [
    { name: 'Meta Ads', href: '/admin/meta-ads', icon: Database },
    { name: 'Hotline Inquiries', href: '/admin/calls', icon: PhoneCall },
]

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        router.refresh()
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    return (
        <div className="flex h-screen bg-slate-50 text-foreground font-sans selection:bg-primary/10 transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-[#0f172a] flex flex-col transition-all duration-500 ease-in-out lg:translate-x-0 overflow-hidden shadow-2xl shadow-slate-900/40",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}>
                <div className="p-7 pb-4">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 shadow-lg shadow-blue-500/20">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">NEXUS</span>
                        </div>
                        <button
                            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-6 overflow-y-auto pt-2 scrollbar-hide">
                    <div>
                        <p className="px-4 mb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-80">Insights</p>
                        <div className="space-y-0.5">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all group",
                                        pathname === item.href
                                            ? "bg-blue-500/10 text-white ring-1 ring-blue-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4 transition-transform", pathname === item.href ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                    <span className="text-xs font-semibold tracking-wide">{item.name}</span>
                                    {pathname === item.href && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="px-4 mb-2 text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] opacity-80">Data Admin</p>
                        <div className="space-y-0.5">
                            {adminNavigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-lg transition-all group",
                                        pathname === item.href
                                            ? "bg-blue-500/10 text-white ring-1 ring-blue-500/20"
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4 transition-transform", pathname === item.href ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                    <span className="text-xs font-semibold tracking-wide">{item.name}</span>
                                    {pathname === item.href && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="p-4 mt-auto">
                    <div className="p-4 bg-slate-900/50 border border-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-700">
                                AU
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate text-white">Admin User</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">PRO PLAN</p>
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-750 rounded-lg transition-all text-[9px] font-bold uppercase tracking-widest active:scale-[0.98]"
                        >
                            <LogOut className="w-3 h-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden lg:pl-64">
                <header className="h-16 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleRefresh}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-[10px] font-bold uppercase tracking-widest",
                                isRefreshing ? "bg-blue-500/10 text-blue-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
                            {isRefreshing ? 'Syncing...' : 'Sync Data'}
                        </button>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        <div className="flex items-center gap-3">
                            <button className="p-2 text-slate-400 hover:text-slate-900 transition-all rounded-lg hover:bg-slate-50">
                                <Settings className="w-4 h-4" />
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                Live
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto px-8 py-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8 pb-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
