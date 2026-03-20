import { useAuth } from './hooks/useAuth.js'
import { useAppState } from './hooks/useAppState.js'
import AuthScreen from './screens/AuthScreen.jsx'
import BizLaunchApp from './BizLaunchApp.jsx'

export default function Root() {
  const auth = useAuth()
  const appState = useAppState(auth.user)

  if (auth.loading || (auth.user && !appState.state.loaded)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0a0a0c', fontFamily: 'system-ui, sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: '#555' }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>🚀</div>
          <div style={{ fontSize: 13 }}>Loading BizLaunch...</div>
        </div>
      </div>
    )
  }

  if (!auth.user) {
    return <AuthScreen auth={auth} />
  }

  return <BizLaunchApp auth={auth} appState={appState} />
}
