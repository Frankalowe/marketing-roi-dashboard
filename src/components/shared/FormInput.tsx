import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    icon?: React.ReactNode
}

export function FormInput({ label, error, icon, className, ...props }: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    className={cn(
                        "w-full bg-white/[0.03] border border-border-subtle rounded-2xl py-3 px-4 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                        icon && "pl-11",
                        error && "border-danger focus:ring-danger/20 focus:border-danger",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && <p className="text-[10px] font-bold text-danger uppercase tracking-wider px-1">{error}</p>}
        </div>
    )
}

interface FormSelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    label: string
    error?: string
    options: { value: string; label: string }[]
}

export function FormSelect({ label, error, options, className, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-1">
                {label}
            </label>
            <select
                className={cn(
                    "w-full bg-white/[0.03] border border-border-subtle rounded-2xl py-3 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer",
                    error && "border-danger focus:ring-danger/20 focus:border-danger",
                    className
                )}
                {...props}
            >
                {options.map((opt: any) => (
                    <option key={opt.value} value={opt.value} className="bg-surface text-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-[10px] font-bold text-danger uppercase tracking-wider px-1">{error}</p>}
        </div>
    )
}
