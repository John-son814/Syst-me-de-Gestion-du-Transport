import { useState, useEffect } from 'react'

// Indicateur de connexion réseau en temps réel
// Dans la version finale, ce composant reçoit le statut depuis le WebSocket

export default function NetworkStatus() {
  const [status, setStatus] = useState('4G')   // '4G' | 'GSM' | 'WiFi' | 'Hors ligne'
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline  = () => { setOnline(true);  setStatus('4G') }
    const handleOffline = () => { setOnline(false); setStatus('Hors ligne') }
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online',  handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: online ? 'var(--color-success)' : 'var(--color-danger)',
        animation: online ? 'pulse 2s infinite' : 'none',
      }} />
      <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
        {status}
      </span>
    </div>
  )
}
