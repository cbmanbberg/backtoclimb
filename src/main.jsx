import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

class ErrorBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      const e = this.state.error
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', fontSize: 13, color: '#c00', background: '#fff', minHeight: '100vh' }}>
          <b>Render Error:</b><br /><br />
          {e.message}<br /><br />
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 11 }}>{e.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

const mount = () =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  )

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(import.meta.env.BASE_URL + 'sw.js').catch(() => {})
  })
}

// Ask the browser to exempt our storage from automatic eviction
// (e.g. Safari's cleanup for rarely visited sites).
if (navigator.storage?.persist) {
  navigator.storage.persist().catch(() => {})
}
