import { useEffect, useState } from 'react'
import { useVehicleStore } from '../store/vehicleStore'
import { vehicleAPI } from '../services/api'
import { TRANSPORT_TYPES } from '../utils/constants'

// ═══════════════════════════════════════════
// P1 — Tableau de bord principal
// Rôles : Tous les profils
// Fonctionnalités :
//   Fonc. 1  — Carte OpenStreetMap temps réel avec pictogrammes
//   Fonc. 1b — 4 KPI globaux (véhicules, retards, alertes, réseau)
//   Fonc. 1c — Sidebar navigation (dans AppLayout)
//   Fonc. 1d — Filtre par type de transport
//   Fonc. 1e — Statut réseau (dans Header)
//   Fonc. 1f — Badge alertes flottant (dans AlertBadge)
//   Fonc. 1g — Profil + déconnexion (dans Sidebar)
// ═══════════════════════════════════════════

export default function DashboardPage() {
  const { vehicles, setVehicles, filterType, setFilterType, getFiltered } = useVehicleStore()
  const [loading, setLoading] = useState(true)

  // Chargement initial des véhicules
  useEffect(() => {
    async function load() {
      try {
        // TODO: remplacer par appel API réel
        // const res = await vehicleAPI.getAll()
        // setVehicles(res.data)

        // MOCK temporaire
        setVehicles(MOCK_VEHICLES)
      } catch (err) {
        console.error('Erreur chargement véhicules:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = getFiltered()

  // KPI calculés
  const kpis = {
    enCirculation: filtered.filter(v => v.statut === 'en_marche').length,
    retards:       filtered.filter(v => v.statut === 'retard').length,
    alertes:       filtered.filter(v => v.alertes_actives > 0).length,
    disponibilite: filtered.length > 0
      ? Math.round((filtered.filter(v => v.statut !== 'en_panne').length / filtered.length) * 100)
      : 100
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>

      {/* Filtres type transport */}
      <div style={{ display: 'flex', gap: 8 }}>
        {['all', ...Object.values(TRANSPORT_TYPES)].map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-ghost'}`}
          >
            {type === 'all' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard label="En circulation"   value={kpis.enCirculation} color="var(--color-success)" />
        <KPICard label="Retards actifs"   value={kpis.retards}       color="var(--color-warning)" />
        <KPICard label="Alertes ouvertes" value={kpis.alertes}       color="var(--color-danger)"  />
        <KPICard label="Disponibilité"    value={`${kpis.disponibilite}%`} color="var(--color-accent)" />
      </div>

      {/* Carte principale */}
      {/* TODO: remplacer le placeholder par le composant MapView avec Leaflet */}
      <div className="card" style={{ flex: 1, minHeight: 400 }}>
        <div className="card-header">
          <span className="card-title">Carte du réseau — Temps réel</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {filtered.length} véhicule{filtered.length > 1 ? 's' : ''}
          </span>
        </div>
        {/* TODO: <MapView vehicles={filtered} /> */}
        <MapPlaceholder vehicles={filtered} />
      </div>

    </div>
  )
}

// ── Sous-composants ────────────────────────

function KPICard({ label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
      <div style={{ fontSize: 28, fontWeight: 600, color, fontFamily: 'var(--font-mono)' }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{label}</div>
    </div>
  )
}

function MapPlaceholder({ vehicles }) {
  // Placeholder — à remplacer par react-leaflet MapContainer
  return (
    <div style={{
      flex: 1, background: 'var(--color-bg)',
      borderRadius: 'var(--radius-md)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 340, flexDirection: 'column', gap: 12,
      border: '1px dashed var(--color-border)',
    }}>
      <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
        Carte OpenStreetMap — react-leaflet
      </div>
      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
        {vehicles.length} véhicule(s) à afficher
      </div>
      {/* TODO: implémenter MapContainer + TileLayer + Marker par véhicule */}
    </div>
  )
}

// ── MOCK data ──────────────────────────────
const MOCK_VEHICLES = [
  { id: 1, nom: 'Train 001', type: 'train',  statut: 'en_marche', lat: 3.848, lng: 11.502, vitesse: 80,  alertes_actives: 0 },
  { id: 2, nom: 'Train 002', type: 'train',  statut: 'retard',    lat: 4.061, lng: 9.737,  vitesse: 45,  alertes_actives: 1 },
  { id: 3, nom: 'Vol CM401', type: 'avion',  statut: 'en_marche', lat: 5.010, lng: 10.421, vitesse: 850, alertes_actives: 0 },
  { id: 4, nom: 'Cargo BKO', type: 'bateau', statut: 'a_larret',  lat: 3.700, lng: 9.300,  vitesse: 0,   alertes_actives: 0 },
]
