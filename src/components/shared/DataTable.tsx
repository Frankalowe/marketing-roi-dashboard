import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
    header: string
    render: (item: T) => ReactNode
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    emptyMessage?: string
    onRowClick?: (item: T) => void
    isLoading?: boolean
}

export function DataTable<T>({
    data,
    columns,
    emptyMessage = "No records found.",
    onRowClick,
    isLoading
}: DataTableProps<T>) {
    return (
        <div className="w-full bg-white overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-slate-50/40">
                            {columns.map((column, i) => (
                                <th
                                    key={i}
                                    className={cn(
                                        "px-6 py-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 first:pl-8 last:pr-8",
                                        column.className
                                    )}
                                >
                                    {column.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="px-8 py-20 text-center">
                                    <div className="flex justify-center">
                                        <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, i) => (
                                <tr
                                    key={i}
                                    onClick={() => onRowClick?.(item)}
                                    className={cn(
                                        "group transition-all duration-200",
                                        onRowClick ? "cursor-pointer hover:bg-slate-50/80" : "hover:bg-slate-50/40"
                                    )}
                                >
                                    {columns.map((column, j) => (
                                        <td key={j} className={cn("px-6 py-4 border-b border-transparent group-last:border-none first:pl-8 last:pr-8", column.className)}>
                                            {column.render(item)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-8 py-20 text-center">
                                    <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">{emptyMessage}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
