'use server'

import { createClient } from '@/lib/supabase/server'

export async function getTableStates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('table_states')
    .select('*')

  if (error) {
    console.error('Error fetching table states:', error)
    return []
  }

  return data ?? []
}

export async function occupyTable(tableId: string, guestsCount: number, notes: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('table_states')
    .upsert({
      table_id: tableId,
      status: 'occupied',
      guests_count: guestsCount,
      notes,
      is_eating: false,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'table_id' })

  if (error) {
    console.error('Error occupying table:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function freeTable(tableId: string) {
  const supabase = await createClient()

  // Buscar estado atual para salvar no histórico
  const { data: current } = await supabase
    .from('table_states')
    .select('*')
    .eq('table_id', tableId)
    .single()

  if (current && current.status !== 'available') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Apagar histórico de dias anteriores
    await supabase
      .from('occupancy_history')
      .delete()
      .lt('started_at', today.toISOString())

    // Salvar no histórico
    await supabase
      .from('occupancy_history')
      .insert({
        table_id: tableId,
        guests_count: current.guests_count,
        notes: current.notes,
        started_at: current.started_at,
        ended_at: new Date().toISOString(),
      })
  }

  // Atualizar para disponível
  const { error } = await supabase
    .from('table_states')
    .upsert({
      table_id: tableId,
      status: 'available',
      guests_count: 0,
      notes: '',
      is_eating: false,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'table_id' })

  if (error) {
    console.error('Error freeing table:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function markEating(tableId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('table_states')
    .update({
      is_eating: true,
      updated_at: new Date().toISOString(),
    })
    .eq('table_id', tableId)

  if (error) {
    console.error('Error marking table as eating:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function reserveTable(tableId: string, notes: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('table_states')
    .upsert({
      table_id: tableId,
      status: 'reserved',
      guests_count: 0,
      notes: notes || 'Reservada',
      is_eating: false,
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'table_id' })

  if (error) {
    console.error('Error reserving table:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getTableHistory(tableId: string) {
  const supabase = await createClient()

  // Buscar histórico de hoje
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('occupancy_history')
    .select('*')
    .eq('table_id', tableId)
    .gte('started_at', today.toISOString())
    .order('started_at', { ascending: false })

  if (error) {
    console.error('Error fetching table history:', error)
    return []
  }

  return data ?? []
}
