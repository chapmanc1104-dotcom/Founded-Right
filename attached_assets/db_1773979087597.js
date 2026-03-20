import { supabase } from './supabase.js'

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function upsertProfile(userId, profile) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Checklist ───────────────────────────────────────────────────────────────

export async function getChecklist(userId) {
  const { data, error } = await supabase
    .from('checklists')
    .select('item_id, completed, completed_at')
    .eq('user_id', userId)
  if (error) throw error
  // Convert to { item_id: true } map
  return Object.fromEntries((data || []).filter(r => r.completed).map(r => [r.item_id, true]))
}

export async function toggleChecklistItem(userId, itemId, completed) {
  const { error } = await supabase
    .from('checklists')
    .upsert({
      user_id: userId,
      item_id: itemId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
}

// ─── NAICS codes ─────────────────────────────────────────────────────────────

export async function getNaicsCodes(userId) {
  const { data, error } = await supabase
    .from('naics_codes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function addNaicsCode(userId, code) {
  const { data, error } = await supabase
    .from('naics_codes')
    .upsert({ user_id: userId, ...code, created_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removeNaicsCode(userId, code) {
  const { error } = await supabase
    .from('naics_codes')
    .delete()
    .eq('user_id', userId)
    .eq('code', code)
  if (error) throw error
}

// ─── Grant cache ──────────────────────────────────────────────────────────────

export async function getCachedGrants(userId) {
  const { data, error } = await supabase
    .from('grant_cache')
    .select('*')
    .eq('user_id', userId)
    .order('match_score', { ascending: false })
  if (error) throw error
  return data || []
}

export async function saveGrantCache(userId, grants) {
  // Delete old cache first
  await supabase.from('grant_cache').delete().eq('user_id', userId)
  if (!grants.length) return
  const rows = grants.map(g => ({
    user_id: userId,
    grant_id: g.id,
    title: g.title,
    agency: g.agency,
    type: g.type,
    amount: g.amount,
    deadline: g.deadline,
    repayable: g.repayable,
    match_score: g.matchScore,
    eligibility: g.eligibility,
    apply_url: g.applyUrl,
    match_reason: g.matchReason,
    required_steps: g.requiredSteps,
    cached_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('grant_cache').insert(rows)
  if (error) throw error
}

// ─── Chat history ─────────────────────────────────────────────────────────────

export async function getChatHistory(userId, limit = 50) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function saveChatMessage(userId, role, content) {
  const { error } = await supabase
    .from('chat_messages')
    .insert({ user_id: userId, role, content, created_at: new Date().toISOString() })
  if (error) throw error
}

export async function clearChatHistory(userId) {
  const { error } = await supabase
    .from('chat_messages')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

// ─── Application tracker ──────────────────────────────────────────────────────

export async function getApplications(userId) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function upsertApplication(userId, application) {
  const { data, error } = await supabase
    .from('applications')
    .upsert({ user_id: userId, ...application, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteApplication(userId, applicationId) {
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', applicationId)
    .eq('user_id', userId)
  if (error) throw error
}
