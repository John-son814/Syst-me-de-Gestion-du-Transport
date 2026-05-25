// Panneau flottant d'alertes critiques (badge visible sur toutes les pages)
// Se développe au clic pour afficher les alertes non lues

import { useState } from 'react'
import { useAlertStore } from '../../store/alertStore'
import { useNavigate } from 'react-router-dom'

export default function AlertBadge() {
  const [open, setOpen] = useState(false)
  const unreadCount = useAlertStore(s => s.unreadCount)
  const alerts      = useAlertStore(s => s.alerts)
  const navigate    = useNavigate()

  // N'affiche rien si pas d'alertes non lues
  if (unreadCount === 0) return null

  const critiques = alerts.filter(a => a.severite === 'critique' && !a.read)

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 200 }}>
      {/* Panneau développé */}
      {open && (
        <div style={{
          position: 'absolute', bottom: 48, right: 0,
          width: 320, background: 'var(--color-bg-card)',
          border: '0.5px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Alertes critiques</span>
            <button onClick={() => { navigate('/alerts'); setOpen(false) }}
              style={{ fontSize: 11, color: 'var(--color-accent)', background: 'none' }}>
              Voir tout
            </button>
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {critiques.length === 0
              ? <div style={{ padding: '16px', fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center' }}>Aucune alerte critique</div>
              : critiques.slice(0, 5).map(a => (
                <div key={a.id} style={{ padding: '10px 16px', borderBottom: '0.5px solid var(--color-border)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                  <div style={{ fontWeight: 500, color: 'var(--color-danger)', marginBottom: 2 }}>{a.type}</div>
                  <div>{a.vehicule_nom} — {a.message}</div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {/* Bouton badge */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'var(--color-danger)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 600, color: '#fff',
          boxShadow: '0 4px 16px rgba(239,68,68,0.4)',
        }}
      >
        {unreadCount}
      </button>
    </div>
  )
}
