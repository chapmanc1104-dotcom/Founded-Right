import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getProfile, upsertProfile,
  getChecklist, toggleChecklistItem,
  getNaicsCodes, addNaicsCode, removeNaicsCode,
  getCachedGrants, saveGrantCache,
  getChatHistory, saveChatMessage, clearChatHistory,
  getApplications, upsertApplication, deleteApplication,
} from '../lib/db.js'

const DEBOUNCE_MS = 800

export function useAppState(user) {
  const [state, setState] = useState({
    loaded: false,
    businessName: '',
    onboarded: false,
    onboardStep: 0,
    profile: {
      state: 'MD', industry: '', stage: 'pre-revenue', demographics: [],
      ownerName: '', email: '', phone: '', zipCode: '',
      yearsInBusiness: '0', employees: '1', annualRevenue: '0',
      fundingGoals: [], entityType: 'LLC', missionStatement: '',
      certifications: [], naicsCodes: [], fundingAmount: '',
    },
    checklist: {},
    naicsResults: [],
    naicsCodes: [],
    liveGrants: [],
    grantsFetched: false,
    chatHistory: [],
    applications: [],
  })

  const profileTimer = useRef(null)

  // ── Load all data on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      try {
        const [profile, checklist, naics, grants, chat, apps] = await Promise.all([
          getProfile(user.id),
          getChecklist(user.id),
          getNaicsCodes(user.id),
          getCachedGrants(user.id),
          getChatHistory(user.id),
          getApplications(user.id),
        ])

        if (cancelled) return

        setState(prev => ({
          ...prev,
          loaded: true,
          businessName: profile?.business_name ?? '',
          onboarded: profile?.onboarded ?? false,
          onboardStep: 0,
          profile: {
            state: profile?.state ?? 'MD',
            industry: profile?.industry ?? '',
            stage: profile?.stage ?? 'pre-revenue',
            ownerName: profile?.owner_name ?? '',
            email: profile?.contact_email ?? '',
            phone: profile?.contact_phone ?? '',
            zipCode: profile?.zip_code ?? '',
            yearsInBusiness: String(profile?.years_in_business ?? '0'),
            employees: String(profile?.employees ?? '1'),
            annualRevenue: String(profile?.annual_revenue ?? '0'),
            fundingGoals: profile?.funding_goals ?? [],
            entityType: profile?.entity_type ?? 'LLC',
            missionStatement: profile?.mission_statement ?? '',
            certifications: profile?.certifications ?? [],
            fundingAmount: profile?.funding_amount ?? '',
            demographics: profile?.demographics ?? [],
          },
          checklist,
          naicsResults: [],
          naicsCodes: naics.map(n => ({
            code: n.code, title: n.title, description: n.description,
            relevance: n.relevance, govContractTip: n.gov_contract_tip,
          })),
          liveGrants: grants.map(g => ({
            id: g.grant_id, title: g.title, agency: g.agency, type: g.type,
            amount: g.amount, deadline: g.deadline, repayable: g.repayable,
            matchScore: g.match_score, eligibility: g.eligibility,
            applyUrl: g.apply_url, matchReason: g.match_reason,
            requiredSteps: g.required_steps ?? [],
          })),
          grantsFetched: grants.length > 0,
          chatHistory: chat.map(m => ({ role: m.role, content: m.content })),
          applications: apps,
        }))
      } catch (err) {
        console.error('Failed to load user data:', err)
        setState(prev => ({ ...prev, loaded: true }))
      }
    }

    load()
    return () => { cancelled = true }
  }, [user?.id])

  // ── Updater functions ─────────────────────────────────────────────────────

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  // Debounced profile save
  const updateProfile = useCallback((profilePatch) => {
    setState(prev => {
      const newProfile = { ...prev.profile, ...profilePatch }
      // Debounce the DB write
      clearTimeout(profileTimer.current)
      profileTimer.current = setTimeout(() => {
        if (!user) return
        upsertProfile(user.id, {
          business_name: prev.businessName,
          onboarded: prev.onboarded,
          state: newProfile.state,
          industry: newProfile.industry,
          stage: newProfile.stage,
          owner_name: newProfile.ownerName,
          contact_email: newProfile.email,
          contact_phone: newProfile.phone,
          zip_code: newProfile.zipCode,
          years_in_business: newProfile.yearsInBusiness,
          employees: newProfile.employees,
          annual_revenue: newProfile.annualRevenue,
          funding_goals: newProfile.fundingGoals,
          entity_type: newProfile.entityType,
          mission_statement: newProfile.missionStatement,
          certifications: newProfile.certifications,
          funding_amount: newProfile.fundingAmount,
          demographics: newProfile.demographics,
        }).catch(console.error)
      }, DEBOUNCE_MS)
      return { ...prev, profile: newProfile }
    })
  }, [user])

  const completeOnboarding = useCallback(async (businessName) => {
    if (!user) return
    setState(prev => ({ ...prev, onboarded: true, businessName }))
    try {
      await upsertProfile(user.id, {
        business_name: businessName,
        onboarded: true,
      })
    } catch (err) {
      console.error('Failed to save onboarding:', err)
    }
  }, [user])

  const updateBusinessName = useCallback(async (name) => {
    setState(prev => ({ ...prev, businessName: name }))
    if (!user) return
    clearTimeout(profileTimer.current)
    profileTimer.current = setTimeout(() => {
      upsertProfile(user.id, { business_name: name }).catch(console.error)
    }, DEBOUNCE_MS)
  }, [user])

  // Checklist toggle — optimistic update + DB write
  const toggleItem = useCallback(async (itemId) => {
    let newVal
    setState(prev => {
      newVal = !prev.checklist[itemId]
      return { ...prev, checklist: { ...prev.checklist, [itemId]: newVal } }
    })
    if (!user) return
    try {
      await toggleChecklistItem(user.id, itemId, newVal)
    } catch (err) {
      console.error('Failed to save checklist item:', err)
      // Revert optimistic update
      setState(prev => ({ ...prev, checklist: { ...prev.checklist, [itemId]: !newVal } }))
    }
  }, [user])

  // NAICS codes
  const addNaics = useCallback(async (item) => {
    setState(prev => {
      if (prev.naicsCodes.find(n => n.code === item.code)) return prev
      return { ...prev, naicsCodes: [...prev.naicsCodes, item] }
    })
    if (!user) return
    try {
      await addNaicsCode(user.id, {
        code: item.code, title: item.title, description: item.description,
        relevance: item.relevance, gov_contract_tip: item.govContractTip,
      })
    } catch (err) { console.error('Failed to save NAICS code:', err) }
  }, [user])

  const removeNaics = useCallback(async (code) => {
    setState(prev => ({ ...prev, naicsCodes: prev.naicsCodes.filter(n => n.code !== code) }))
    if (!user) return
    try {
      await removeNaicsCode(user.id, code)
    } catch (err) { console.error('Failed to remove NAICS code:', err) }
  }, [user])

  // Grants
  const saveGrants = useCallback(async (grants) => {
    setState(prev => ({ ...prev, liveGrants: grants, grantsFetched: true }))
    if (!user) return
    try {
      await saveGrantCache(user.id, grants)
    } catch (err) { console.error('Failed to cache grants:', err) }
  }, [user])

  // Chat
  const addChatMessage = useCallback(async (role, content) => {
    setState(prev => ({ ...prev, chatHistory: [...prev.chatHistory, { role, content }] }))
    if (!user) return
    try {
      await saveChatMessage(user.id, role, content)
    } catch (err) { console.error('Failed to save chat message:', err) }
  }, [user])

  const resetChat = useCallback(async () => {
    setState(prev => ({ ...prev, chatHistory: [] }))
    if (!user) return
    try { await clearChatHistory(user.id) } catch (err) { console.error(err) }
  }, [user])

  // Applications
  const saveApplication = useCallback(async (application) => {
    const saved = await upsertApplication(user.id, application)
    setState(prev => {
      const existing = prev.applications.findIndex(a => a.id === saved.id)
      const apps = existing >= 0
        ? prev.applications.map((a, i) => i === existing ? saved : a)
        : [saved, ...prev.applications]
      return { ...prev, applications: apps }
    })
    return saved
  }, [user])

  const removeApplication = useCallback(async (id) => {
    await deleteApplication(user.id, id)
    setState(prev => ({ ...prev, applications: prev.applications.filter(a => a.id !== id) }))
  }, [user])

  return {
    state, update, updateProfile, completeOnboarding,
    updateBusinessName, toggleItem,
    addNaics, removeNaics, saveGrants,
    addChatMessage, resetChat,
    saveApplication, removeApplication,
  }
}
