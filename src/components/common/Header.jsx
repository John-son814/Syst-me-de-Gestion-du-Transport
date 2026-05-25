import { useLocation } from 'react-router-dom'
import NetworkStatus from './NetworkStatus'
import { useAlertStore } from '../../store/alertStore'

const pageTitles = {
  '/dashboard':      'Tableau de bord',
  '/schedule':       'Gestion des horaires',
  '/alerts':         'Alertes & Incidents',
  '/infrastructure': 'État du réseau',
  '/history':        'Historique & Rapports',
  '/ai':             'Assistant IA',
  '/admin':          'Administration',
  '/driver':         'Interface opérateur embarqué',
}

export default function Header() {
  const location = useLocation()
  const unreadCount = useAlertStore(s => s.unreadCount)

  // Titre dynamique selon la route
  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] || 'MTMS'

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'var(--color-bg-surface)',
      borderBottom: '0.5px solid var(--color-border)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
    }}>
      <h1 style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Statut réseau */}
        <NetworkStatus />

        {/* Badge alertes */}
        {unreadCount > 0 && (
          <div style={{
            background: 'var(--color-danger-bg)',
            border: '0.5px solid var(--color-danger)',
            color: 'var(--color-danger)',
            fontSize: 12, fontWeight: 500,
            padding: '3px 10px', borderRadius: 20,
          }}>
            {unreadCount} alerte{unreadCount > 1 ? 's' : ''}
          </div>
        )}

        {/* Heure système */}
        <LiveClock />
      </div>
    </header>
  )
}

function LiveClock() {
  const [time, setTime] = React.useState(new Date())
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
      {time.toLocaleTimeString('fr-FR')}
    </span>
  )
}

// Import React manquant dans le fichier — à ajouter
import React from 'react'
