'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createRecord(table: string, data: any) {
    const supabase = await createClient()
    const { error } = await supabase.from(table).insert(data)
    if (error) throw error
    revalidatePath('/admin/' + table.replace('_', '-'))
    revalidatePath('/overview')
}

export async function updateRecord(table: string, id: string, data: any) {
    const supabase = await createClient()
    const { error } = await supabase.from(table).update(data).eq('id', id)
    if (error) throw error
    revalidatePath('/admin/' + table.replace('_', '-'))
    revalidatePath('/overview')
}

export async function deleteRecord(table: string, id: string, softDelete = true) {
    const supabase = await createClient()
    if (softDelete) {
        const { error } = await supabase.from(table).update({ deleted_at: new Date().toISOString() }).eq('id', id)
        if (error) throw error
    } else {
        const { error } = await supabase.from(table).delete().eq('id', id)
        if (error) throw error
    }
    revalidatePath('/admin/' + table.replace('_', '-'))
    revalidatePath('/overview')
}

export async function restoreRecord(table: string, id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from(table).update({ deleted_at: null }).eq('id', id)
    if (error) throw error
    revalidatePath('/admin/' + table.replace('_', '-'))
    revalidatePath('/overview')
}

export async function getCampaignsList() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('meta_ads')
        .select('campaign_id, campaign_name')
        .is('deleted_at', null)
        .order('campaign_name')

    const unique = Array.from(new Map(data?.map(c => [c.campaign_id, c])).values())
    return unique
}
