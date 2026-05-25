import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleAPI } from '../services/api'
import { LABELS, formatTime, getDelayColor } from '../utils/constants'

// ═══════════════════════════════════════════
// P2 — Fiche véhicule (multimode)
// Rôles : Opérateurs · Techniciens
// Fonctionnalités :
//   Fonc. 2  — Données temps réel : position, vitesse, cap, statut
//   Fonc. 3  — Données techniques adaptatives selon type_transport
//   Fonc. 3b — Mini-carte trajet + prochains arrêts
//   Fonc. 3c — ETA recalculée dynamiquement
//   Fonc. 3d — Opérateur embarqué (conducteur/pilote/capitaine)
//   Fonc. 3e — 5 dernières alertes du véhicule
//   Fonc. 3f — Bouton "Déclarer un incident"
// ═══════════════════════════════════════════

export default function VehiclePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // TODO: const res = await vehicleAPI.getById(id)
        // setVehicle(res.data)
        setVehicle(MOCK_VEHICLE) // MOCK temporaire
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div style={{ padding: 24, color: 'var(--color-text-muted)' }}>Chargement…</div>
  if (!vehicle) return <div style={{ padding: 24, color: 'var(--color-danger)' }}>Véhicule introuvable.</div>

  const type = vehicle.type // 'train' | 'avion' | 'bateau'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* En-tête */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">← Retour</button>
            <h2>{vehicle.nom}</h2>
            <span className={`badge badge-${type}`}>{type}</span>
            <span className={`badge ${vehicle.statut === 'en_marche' ? 'badge-success' : vehicle.statut === 'retard' ? 'badge-warning' : 'badge-danger'}`}>
              {vehicle.statut.replace('_', ' ')}
            </span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, paddingLeft: 100 }}>
            ID · {vehicle.id} &nbsp;·&nbsp; {LABELS.operateur[type]} : {vehicle.operateur?.nom}
          </div>
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {/* TODO: ouvrir modal incident */}}
        >
          ⚡ Déclarer un incident
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Fonc. 2 — Données temps réel */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Données temps réel</span>
            <div className="dot-live" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <DataItem label="Vitesse"   value={`${vehicle.vitesse} km/h`} />
            <DataItem label="Cap"       value={`${vehicle.cap}°`} />
            <DataItem label="Latitude"  value={vehicle.position.lat} mono />
            <DataItem label="Longitude" value={vehicle.position.lng} mono />
            <DataItem label="ETA" value={formatTime(vehicle.eta)} color={getDelayColor(vehicle.retard_min)} />
            <DataItem label="Retard"    value={vehicle.retard_min !== null ? `+${vehicle.retard_min} min` : '—'} color={getDelayColor(vehicle.retard_min)} />
          </div>
        </div>

        {/* Fonc. 3 — Données techniques adaptatives */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Données techniques</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{type}</span>
          </div>
          <TechnicalData type={type} data={vehicle.technique} />
        </div>

        {/* Fonc. 3b — Prochains arrêts */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Prochains {LABELS.escale[type]}s</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {vehicle.prochains_arrets.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '0.5px solid var(--color-border)' }}>
                <span style={{ color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  {i === 0 ? '→ ' : ''}{a.nom}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {formatTime(a.heure_prevue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fonc. 3e — Dernières alertes */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Dernières alertes</span>
          </div>
          {vehicle.alertes_recentes.length === 0
            ? <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Aucune alerte récente</div>
            : vehicle.alertes_recentes.map(a => (
              <div key={a.id} style={{ fontSize: 12, color: 'var(--color-text-secondary)', padding: '6px 0', borderBottom: '0.5px solid var(--color-border)' }}>
                <span className={`badge badge-${a.severite === 'critique' ? 'danger' : a.severite === 'moyen' ? 'warning' : 'muted'}`} style={{ marginRight: 8 }}>{a.severite}</span>
                {a.message}
              </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}

// ── Données techniques selon type_transport ──
function TechnicalData({ type, data }) {
  if (!data) return <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Données indisponibles</div>

  const fields = {
    train: [
      { label: 'Régime moteur', value: `${data.regime_moteur} rpm` },
      { label: 'Pression freins', value: `${data.pression_freins} bar` },
      { label: 'Température moteur', value: `${data.temp_moteur}°C` },
      { label: 'Codes panne', value: data.codes_panne?.join(', ') || 'Aucun' },
    ],
    avion: [
      { label: 'Altitude', value: `${data.altitude} ft` },
      { label: 'Carburant', value: `${data.carburant}%` },
      { label: 'Pression cabine', value: `${data.pression_cabine} hPa` },
      { label: 'Codes système', value: data.codes_systeme?.join(', ') || 'Aucun' },
    ],
    bateau: [
      { label: 'Tirant d\'eau', value: `${data.tirant_eau} m` },
      { label: 'Carburant', value: `${data.carburant}%` },
      { label: 'État moteurs', value: data.etat_moteurs },
      { label: 'Météo marine', value: data.meteo_marine },
    ],
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {(fields[type] || []).map((f, i) => (
        <DataItem key={i} label={f.label} value={f.value} />
      ))}
    </div>
  )
}

function DataItem({ label, value, mono, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: color || 'var(--color-text-primary)', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>
        {value}
      </div>
    </div>
  )
}

// ── MOCK ────────────────────────────────────
const MOCK_VEHICLE = {
  id: 1, nom: 'Train 001', type: 'train', statut: 'retard',
  vitesse: 65, cap: 142, retard_min: 12,
  eta: new Date(Date.now() + 25 * 60000).toISOString(),
  position: { lat: 3.8480, lng: 11.5021 },
  operateur: { nom: 'NGUEMA Paul', matricule: 'DR-042' },
  technique: { regime_moteur: 1400, pression_freins: 6.2, temp_moteur: 88, codes_panne: [] },
  prochains_arrets: [
    { nom: 'Gare de Yaoundé',   heure_prevue: new Date(Date.now() + 25*60000).toISOString() },
    { nom: 'Gare de Belabo',    heure_prevue: new Date(Date.now() + 90*60000).toISOString() },
    { nom: 'Gare de Ngaoundéré',heure_prevue: new Date(Date.now() + 240*60000).toISOString() },
  ],
  alertes_recentes: [
    { id: 1, severite: 'moyen', message: 'Retard de 12 min détecté à Mbalmayo' },
  ]
}
