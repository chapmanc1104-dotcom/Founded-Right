import { useState } from 'react'

export default function AuthScreen({ auth }) {
  const [mode, setMode] = useState('signin') // signin | signup | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'signin') {
        await auth.signIn(email, password)
      } else if (mode === 'signup') {
        await auth.signUp(email, password, fullName)
        setSuccess('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      } else {
        await auth.resetPassword(email)
        setSuccess('Password reset link sent — check your email.')
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0c', fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=Syne:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .auth-input{width:100%;background:#0f0f11;border:1px solid #2a2a30;border-radius:8px;padding:11px 14px;font-size:14px;color:#f0ede8;font-family:inherit;outline:none;transition:border-color 0.15s}
        .auth-input:focus{border-color:#7f77dd66}
        .auth-btn{width:100%;background:#7f77dd;color:white;font-size:15px;font-weight:500;padding:13px;border-radius:10px;font-family:'Syne',sans-serif;border:none;cursor:pointer;transition:background 0.15s;margin-top:4px}
        .auth-btn:hover{background:#9b93e8}
        .auth-btn:disabled{background:#333;color:#666;cursor:not-allowed}
        .google-btn{width:100%;background:#1a1a20;color:#d0cdc8;font-size:14px;font-weight:400;padding:11px;border-radius:10px;font-family:inherit;border:1px solid #2a2a30;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;justify-content:center;gap:10px}
        .google-btn:hover{background:#222230;border-color:#444}
        .link-btn{background:none;border:none;color:#9b8ff0;font-size:13px;cursor:pointer;padding:0;font-family:inherit;text-decoration:underline}
        .field-label{font-size:11px;color:#666;font-weight:500;text-transform:uppercase;letter-spacing:0.07em;margin-bottom:6px;display:block}
        .field-wrap{margin-bottom:14px}
        .divider{display:flex;align-items:center;gap:12px;margin:16px 0;color:#444;font-size:12px}
        .divider::before,.divider::after{content:'';flex:1;height:0.5px;background:#2a2a30}
      `}</style>

      <div style={{
        background: '#141416', border: '1px solid #1e1e22', borderRadius: 16,
        padding: 40, maxWidth: 420, width: '100%', margin: '0 16px',
      }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, color: '#f0ede8', marginBottom: 4 }}>
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'}
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>
            {mode === 'signin' ? 'Sign in to your BizLaunch account' :
             mode === 'signup' ? 'Structure your business for grants and contracts' :
             'Enter your email to receive a reset link'}
          </div>
        </div>

        {error && (
          <div style={{ background: '#E24B4A18', border: '1px solid #E24B4A30', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E24B4A', marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#1D9E7518', border: '1px solid #1D9E7530', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1D9E75', marginBottom: 16 }}>
            {success}
          </div>
        )}

        <form onSubmit={handle}>
          {mode === 'signup' && (
            <div className="field-wrap">
              <label className="field-label">Full name</label>
              <input className="auth-input" placeholder="Jane Smith" value={fullName}
                onChange={e => setFullName(e.target.value)} required />
            </div>
          )}
          <div className="field-wrap">
            <label className="field-label">Email</label>
            <input className="auth-input" type="email" placeholder="you@yourbusiness.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          {mode !== 'reset' && (
            <div className="field-wrap">
              <label className="field-label">Password</label>
              <input className="auth-input" type="password" placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
                value={password} onChange={e => setPassword(e.target.value)}
                required minLength={mode === 'signup' ? 8 : 1} />
            </div>
          )}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'signin' ? 'Sign in →' : mode === 'signup' ? 'Create account →' : 'Send reset link →'}
          </button>
        </form>

        {mode !== 'reset' && (
          <>
            <div className="divider">or</div>
            <button className="google-btn" onClick={auth.signInWithGoogle} disabled={loading}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>
          </>
        )}

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#555', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mode === 'signin' && <>
            <span>Don't have an account? <button className="link-btn" onClick={() => setMode('signup')}>Sign up free</button></span>
            <button className="link-btn" onClick={() => setMode('reset')}>Forgot password?</button>
          </>}
          {mode === 'signup' && <span>Already have an account? <button className="link-btn" onClick={() => setMode('signin')}>Sign in</button></span>}
          {mode === 'reset' && <button className="link-btn" onClick={() => setMode('signin')}>← Back to sign in</button>}
        </div>
      </div>
    </div>
  )
}
