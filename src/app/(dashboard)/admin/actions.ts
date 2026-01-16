'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type ActionResponse = {
    success: boolean
    error?: string
}

export async function createRecord(table: string, data: any): Promise<ActionResponse> {
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from(table).insert(data)
        if (error) throw error

        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e: any) {
        // Safe degrade: If column missing, retry without it
        if (e.message?.includes("Could not find the") && e.message?.includes("column")) {
            // Extract column name, strict regex to be safe
            const match = e.message.match(/'([^']+)' column/)
            if (match && match[1]) {
                const badColumn = match[1]
                console.warn(`Column '${badColumn}' missing in '${table}'. Retrying without it.`)
                const { [badColumn]: removed, ...newData } = data
                return createRecord(table, newData) // Recursive retry
            }
        }
        return { success: false, error: (e as Error).message }
    }
}

export async function updateRecord(table: string, id: string, data: any): Promise<ActionResponse> {
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from(table).update(data).eq('id', id)
        if (error) throw error

        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e: any) {
        // Safe degrade: If column missing, retry without it
        if (e.message?.includes("Could not find the") && e.message?.includes("column")) {
            const match = e.message.match(/'([^']+)' column/)
            if (match && match[1]) {
                const badColumn = match[1]
                console.warn(`Column '${badColumn}' missing in '${table}'. Retrying without it.`)
                const { [badColumn]: removed, ...newData } = data
                return updateRecord(table, id, newData) // Recursive retry
            }
        }
        return { success: false, error: (e as Error).message }
    }
}

export async function deleteRecord(table: string, id: string, softDelete = true): Promise<ActionResponse> {
    try {
        const supabase = createAdminClient()
        if (softDelete) {
            const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id)
            if (error) throw new Error(error.message)
        } else {
            const { error } = await supabase.from(table).delete().eq('id', id)
            if (error) throw new Error(error.message)
        }
        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e) {
        return { success: false, error: (e as Error).message }
    }
}

export async function restoreRecord(table: string, id: string): Promise<ActionResponse> {
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from(table).update({ deleted_at: null }).eq('id', id)
        if (error) throw new Error(error.message)
        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e) {
        return { success: false, error: (e as Error).message }
    }
}

export async function getCampaignsList() {
    try {
        const supabase = createAdminClient()
        const { data } = await supabase
            .from('meta_ads')
            .select('campaign_id, campaign_name')
            .is('deleted_at', null)
            .order('campaign_name')

        if (!data) return []

        const unique = Array.from(new Map(data.map(c => [c.campaign_id, c])).values())
        return unique
    } catch (e) {
        console.error("Error fetching campaigns:", e)
        return []
    }
}
