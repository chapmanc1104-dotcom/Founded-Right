/**
 * Anthropic API helper
 *
 * In production: replace fetch() here with a call to your own
 * backend endpoint (e.g. /api/ai) so the API key is never in
 * the browser bundle.
 *
 * For local dev: uses VITE_ANTHROPIC_API_KEY directly.
 */

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

export async function callClaude({ messages, system, maxTokens = 1000 }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      ...(system ? { system } : {}),
      messages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? ''
}

export async function callClaudeJSON({ messages, system, maxTokens = 1500 }) {
  const text = await callClaude({ messages, system, maxTokens })
  const cleaned = text.replace(/```json|```/g, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`Failed to parse JSON from Claude response: ${cleaned.slice(0, 200)}`)
  }
}
