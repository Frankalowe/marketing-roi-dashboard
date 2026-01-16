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
        if (error) throw new Error(error.message)
        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e) {
        return { success: false, error: (e as Error).message }
    }
}

export async function updateRecord(table: string, id: string, data: any): Promise<ActionResponse> {
    try {
        const supabase = createAdminClient()
        const { error } = await supabase.from(table).update(data).eq('id', id)
        if (error) throw new Error(error.message)
        revalidatePath('/admin/' + table.replace('_', '-'))
        revalidatePath('/overview')
        return { success: true }
    } catch (e) {
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
