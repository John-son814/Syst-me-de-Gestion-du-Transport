import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

// Icônes SVG inline simples pour éviter les dépendances externes
const icons = {
  dashboard:      '▦',
  vehicle:        '⬡',
  schedule:       '◷',
  alerts:         '⚡',
  infra:          '⬡',
  history:        '◴',
  admin:          '⚙',
  ai:             '◈',
  driver:         '◉',
  logout:         '⇥',
}

const navItems = [
  { to: '/dashboard',      label: 'Tableau de bord',    icon: icons.dashboard  },
  { to: '/vehicles',       label: 'Véhicules',          icon: icons.vehicle    },
  { to: '/schedule',       label: 'Horaires',           icon: icons.schedule   },
  { to: '/alerts',         label: 'Alertes & Incidents',icon: icons.alerts     },
  { to: '/infrastructure', label: 'Infrastructure',     icon: icons.infra      },
  { to: '/history',        label: 'Historique',         icon: icons.history    },
  { to: '/ai',             label: 'Assistant IA',       icon: icons.ai         },
  { to: '/admin',          label: 'Administration',     icon: icons.admin      },
  { to: '/driver',         label: 'Interface embarquée',icon: icons.driver     },
]

export default function Sidebar() {
  const logout = useAuthStore(s => s.logout)
  const user   = useAuthStore(s => s.user)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0,
      width: 'var(--sidebar-width)', height: '100vh',
      background: 'var(--color-bg-surface)',
      borderRight: '0.5px solid var(--color-border)',
      display: 'flex', flexDirection: 'column',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '0.5px solid var(--color-border)' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-accent)', letterSpacing: 2 }}>MTMS</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>Supervision Multimodale</div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 'var(--radius-sm)',
              fontSize: 13, fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              background: isActive ? 'var(--color-bg-hover)' : 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            })}
          >
            <span style={{ fontSize: 16, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Profil + déconnexion */}
      <div style={{ padding: '12px 8px', borderTop: '0.5px solid var(--color-border)' }}>
        <div style={{ padding: '8px 12px', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {user?.prenom} {user?.nom}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
            {user?.role}
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            width: '100%', padding: '9px 12px',
            borderRadius: 'var(--radius-sm)', background: 'transparent',
            color: 'var(--color-text-secondary)', fontSize: 13,
            transition: 'all var(--transition)',
          }}
        >
          <span style={{ fontSize: 16 }}>{icons.logout}</span>
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
