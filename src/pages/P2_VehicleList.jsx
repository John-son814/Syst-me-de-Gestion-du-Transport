import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicleAPI } from '../services/api'
import { TRANSPORT_TYPES, getTransportColor } from '../utils/constants'

// ═══════════════════════════════════════════
// P2_VehicleList — Liste de tous les véhicules
// Rôles : Opérateurs · Techniciens · Direction
// Accessible via la sidebar → "Véhicules"
// Cliquer sur un véhicule → ouvre P2_Vehicle (fiche détaillée)
// ═══════════════════════════════════════════

const STATUS_CONFIG = {
  en_marche:    { label: 'En service',         color: 'var(--color-success)',       bg: 'var(--color-success-bg)' },
  a_larret:     { label: 'À l\'arrêt',         color: 'var(--color-warning)',       bg: 'var(--color-warning-bg)' },
  retard:       { label: 'Retard',             color: 'var(--color-warning)',       bg: 'var(--color-warning-bg)' },
  en_panne:     { label: 'En panne',           color: 'var(--color-danger)',        bg: 'var(--color-danger-bg)'  },
  maintenance:  { label: 'En maintenance',     color: 'var(--color-info)',          bg: 'var(--color-info-bg)'    },
  hors_service: { label: 'Hors service',       color: 'var(--color-text-muted)',    bg: 'rgba(90,106,128,0.1)'   },
  planifie:     { label: 'Bientôt en service', color: 'var(--color-accent)',        bg: 'var(--color-accent-glow)'},
}

export default function VehicleListPage() {
  const [vehicles, setVehicles]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch]       = useState('')
  const [view, setView]           = useState('grid') // 'grid' | 'table'
  const navigate = useNavigate()

  useEffect(() => {
    async function load() {
      try {
        // TODO: const res = await vehicleAPI.getAll()
        // setVehicles(res.data)
        setVehicles(MOCK_VEHICLES)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Filtrage
  const filtered = vehicles.filter(v => {
    const matchType   = filterType   === 'all' || v.type   === filterType
    const matchStatus = filterStatus === 'all' || v.statut === filterStatus
    const matchSearch = v.nom.toLowerCase().includes(search.toLowerCase()) ||
                        v.immatriculation?.toLowerCase().includes(search.toLowerCase())
    return matchType && matchStatus && matchSearch
  })

  // Compteurs par statut
  const counts = {
    total:       vehicles.length,
    en_service:  vehicles.filter(v => v.statut === 'en_marche').length,
    indisponible:vehicles.filter(v => ['en_panne','maintenance','hors_service'].includes(v.statut)).length,
    planifie:    vehicles.filter(v => v.statut === 'planifie').length,
  }

  if (loading) return <div style={{ padding: 24, color: 'var(--color-text-muted)', fontSize: 13 }}>Chargement de la flotte…</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* KPI rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
        {[
          { label: 'Total enregistrés',    value: counts.total,        color: 'var(--color-accent)'  },
          { label: 'En service',           value: counts.en_service,   color: 'var(--color-success)' },
          { label: 'Indisponibles',        value: counts.indisponible, color: 'var(--color-danger)'  },
          { label: 'Bientôt en service',   value: counts.planifie,     color: 'var(--color-info)'    },
        ].map(k => (
          <div key={k.label} className="card" style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: k.color, fontFamily: 'var(--font-mono)' }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Barre de filtres */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Recherche */}
          <input
            className="input"
            style={{ width: 220 }}
            placeholder="Rechercher un véhicule…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          {/* Filtre type */}
          <select className="select" style={{ width: 140 }} value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="all">Tous les types</option>
            <option value="train">Train</option>
            <option value="avion">Avion</option>
            <option value="bateau">Bateau</option>
          </select>

          {/* Filtre statut */}
          <select className="select" style={{ width: 180 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tous les statuts</option>
            <option value="en_marche">En service</option>
            <option value="a_larret">À l'arrêt</option>
            <option value="retard">Retard</option>
            <option value="en_panne">En panne</option>
            <option value="maintenance">En maintenance</option>
            <option value="hors_service">Hors service</option>
            <option value="planifie">Bientôt en service</option>
          </select>

          {/* Toggle vue */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
            {['grid','table'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-ghost'}`}>
                {v === 'grid' ? '⊞ Cartes' : '≡ Tableau'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Résultat */}
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
        {filtered.length} véhicule{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
      </div>

      {/* Vue grille */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {filtered.map(v => (
            <VehicleCard key={v.id} vehicle={v} onClick={() => navigate(`/vehicle/${v.id}`)} />
          ))}
        </div>
      )}

      {/* Vue tableau */}
      {view === 'table' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Nom / ID</th>
                <th>Type</th>
                <th>Immatriculation</th>
                <th>Ligne / Route</th>
                <th>Statut</th>
                <th>Vitesse</th>
                <th>Opérateur</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => {
                const s = STATUS_CONFIG[v.statut] || STATUS_CONFIG.hors_service
                return (
                  <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/vehicle/${v.id}`)}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{v.nom}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>#{v.id}</div>
                    </td>
                    <td><span className={`badge badge-${v.type}`}>{v.type}</span></td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{v.immatriculation || '—'}</td>
                    <td style={{ fontSize: 12 }}>{v.ligne || '—'}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                      {v.vitesse != null ? `${v.vitesse} km/h` : '—'}
                    </td>
                    <td style={{ fontSize: 12 }}>{v.operateur || '—'}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); navigate(`/vehicle/${v.id}`) }}>
                        Voir →
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  )
}

// ── Carte véhicule (vue grille) ─────────────
function VehicleCard({ vehicle: v, onClick }) {
  const s = STATUS_CONFIG[v.statut] || STATUS_CONFIG.hors_service
  return (
    <div
      onClick={onClick}
      className="card"
      style={{ cursor: 'pointer', transition: 'all 0.15s', padding: 16 }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-border-light)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
    >
      {/* En-tête carte */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 3 }}>{v.nom}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            {v.immatriculation || `ID #${v.id}`}
          </div>
        </div>
        <span className={`badge badge-${v.type}`}>{v.type}</span>
      </div>

      {/* Statut */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.color, fontWeight: 500 }}>
          {s.label}
        </span>
      </div>

      {/* Infos rapides */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 1 }}>Vitesse</div>
          <div style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
            {v.vitesse != null ? `${v.vitesse} km/h` : '—'}
          </div>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 1 }}>Ligne</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{v.ligne || '—'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 1 }}>Opérateur</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>{v.operateur || '—'}</div>
        </div>
        <div>
          <div style={{ color: 'var(--color-text-muted)', fontSize: 11, marginBottom: 1 }}>Alertes</div>
          <div style={{ color: v.alertes > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)' }}>
            {v.alertes > 0 ? `${v.alertes} active${v.alertes > 1 ? 's' : ''}` : 'Aucune'}
          </div>
        </div>
      </div>

      {/* Pied de carte */}
      <div style={{ marginTop: 12, paddingTop: 10, borderTop: '0.5px solid var(--color-border)', fontSize: 11, color: 'var(--color-accent)' }}>
        Voir la fiche complète →
      </div>
    </div>
  )
}

// ── MOCK ────────────────────────────────────
const MOCK_VEHICLES = [
  { id: 1,  nom: 'Train 001',    type: 'train',  immatriculation: 'CM-TR-001', ligne: 'Douala–Yaoundé',    statut: 'en_marche',   vitesse: 80,  operateur: 'NGUEMA Paul',    alertes: 0 },
  { id: 2,  nom: 'Train 002',    type: 'train',  immatriculation: 'CM-TR-002', ligne: 'Yaoundé–Ngaoundéré',statut: 'retard',      vitesse: 45,  operateur: 'BIYA Jean',      alertes: 1 },
  { id: 3,  nom: 'Train 003',    type: 'train',  immatriculation: 'CM-TR-003', ligne: 'Douala–Kumba',      statut: 'a_larret',    vitesse: 0,   operateur: 'ATEBA Marc',     alertes: 0 },
  { id: 4,  nom: 'Train 004',    type: 'train',  immatriculation: 'CM-TR-004', ligne: 'Ngaoundéré–Douala', statut: 'en_panne',    vitesse: 0,   operateur: null,             alertes: 2 },
  { id: 5,  nom: 'Train 005',    type: 'train',  immatriculation: 'CM-TR-005', ligne: null,               statut: 'maintenance', vitesse: null,operateur: null,             alertes: 0 },
  { id: 6,  nom: 'Train 006',    type: 'train',  immatriculation: 'CM-TR-006', ligne: 'Douala–Yaoundé',    statut: 'planifie',    vitesse: null,operateur: 'FOUDA Serge',    alertes: 0 },
  { id: 7,  nom: 'Vol CM401',    type: 'avion',  immatriculation: 'TJ-AAB',    ligne: 'Douala–Libreville', statut: 'en_marche',   vitesse: 850, operateur: 'Cpt. MBARGA',   alertes: 0 },
  { id: 8,  nom: 'Vol CM502',    type: 'avion',  immatriculation: 'TJ-AAC',    ligne: 'Yaoundé–Paris',     statut: 'a_larret',    vitesse: 0,   operateur: 'Cpt. ESSAMA',   alertes: 0 },
  { id: 9,  nom: 'Vol CM610',    type: 'avion',  immatriculation: 'TJ-AAD',    ligne: null,               statut: 'hors_service', vitesse: null,operateur: null,             alertes: 0 },
  { id: 10, nom: 'Cargo Wouri',  type: 'bateau', immatriculation: 'CMR-001',   ligne: 'Port Douala–Lagos', statut: 'en_marche',   vitesse: 22,  operateur: 'Cap. MOUNDI',   alertes: 0 },
  { id: 11, nom: 'Ferry Mungo',  type: 'bateau', immatriculation: 'CMR-002',   ligne: 'Douala–Limbé',      statut: 'a_larret',    vitesse: 0,   operateur: 'Cap. ELANGO',   alertes: 0 },
  { id: 12, nom: 'Barge Sanaga', type: 'bateau', immatriculation: 'CMR-003',   ligne: null,               statut: 'planifie',    vitesse: null,operateur: null,             alertes: 0 },
]
