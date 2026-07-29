'use client'

import { useState, Suspense } from 'react'
import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { BarChart3, Lock as LockIcon, Mail } from 'lucide-react'

function LoginFormContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        await login(formData)
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-900/20 mb-4 scale-110">
                        <BarChart3 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                        Antigravity Analytics
                    </h1>
                    <p className="text-gray-500 mt-2">Marketing ROI Dashboard & Call Tracking</p>
                </div>

                <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-50"></div>

                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="admin@example.com"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all placeholder:text-gray-700"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <p className="text-xs text-gray-600 uppercase tracking-widest font-bold">Admin Only Access</p>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-sm mt-8">
                    © 2026 Antigravity Systems. All rights reserved.
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div></div>}>
            <LoginFormContent />
        </Suspense>
    )
}
