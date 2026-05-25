// ═══════════════════════════════════════════
// P3 — Gestion des horaires et escales
// Rôles : Chefs de terminal · Opérateurs
// Fonctionnalités :
//   Fonc. 4  — Tableau horaires planifiés vs réels avec code couleur
//   Fonc. 5  — Saisie manuelle de passage en terminal
//   Fonc. 5b — Filtres : ligne/route, direction, date, type transport
//   Fonc. 5c — Résumé du jour (planifiés/en cours/terminés/annulés)
//   Fonc. 5d — Annuler ou reprogrammer un voyage
//   Fonc. 5e — Affichage des correspondances
// ═══════════════════════════════════════════

import { useState } from 'react'
import { formatTime, getDelayColor, getDelayMinutes } from '../utils/constants'

export default function SchedulePage() {
  const [filters, setFilters] = useState({ type: 'all', date: new Date().toISOString().split('T')[0], ligne: '' })
  const [showSaisie, setShowSaisie] = useState(false)

  // Résumé du jour
  const summary = {
    planifies: MOCK_VOYAGES.length,
    en_cours:  MOCK_VOYAGES.filter(v => v.statut === 'en_cours').length,
    termines:  MOCK_VOYAGES.filter(v => v.statut === 'termine').length,
    annules:   MOCK_VOYAGES.filter(v => v.statut === 'annule').length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Résumé du jour — Fonc. 5c */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Planifiés',  value: summary.planifies, color: 'var(--color-accent)' },
          { label: 'En cours',   value: summary.en_cours,  color: 'var(--color-success)' },
          { label: 'Terminés',   value: summary.termines,  color: 'var(--color-text-muted)' },
          { label: 'Annulés',    value: summary.annules,   color: 'var(--color-danger)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color, fontFamily: 'var(--font-mono)' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres — Fonc. 5b */}
      <div className="card" style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input className="input" style={{ width: 160 }} type="date" value={filters.date}
            onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
          <select className="select" style={{ width: 140 }}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
            <option value="all">Tous les types</option>
            <option value="train">Train</option>
            <option value="avion">Avion</option>
            <option value="bateau">Bateau</option>
          </select>
          <input className="input" style={{ width: 180 }} placeholder="Ligne / route…"
            onChange={e => setFilters(f => ({ ...f, ligne: e.target.value }))} />
          <button className="btn btn-primary btn-sm" onClick={() => setShowSaisie(true)}>
            + Saisie manuelle
          </button>
        </div>
      </div>

      {/* Tableau principal — Fonc. 4 */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Véhicule</th>
              <th>Type</th>
              <th>Origine</th>
              <th>Destination</th>
              <th>Départ prévu</th>
              <th>Départ réel</th>
              <th>Arrivée prévue</th>
              <th>Retard</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_VOYAGES.map(v => {
              const retard = getDelayMinutes(v.heure_depart_prevue, v.heure_depart_reelle)
              return (
                <tr key={v.id}>
                  <td style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{v.vehicule_nom}</td>
                  <td><span className={`badge badge-${v.type}`}>{v.type}</span></td>
                  <td>{v.origine}</td>
                  <td>{v.destination}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatTime(v.heure_depart_prevue)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatTime(v.heure_depart_reelle) || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>{formatTime(v.heure_arrivee_prevue)}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: getDelayColor(retard) }}>
                    {retard !== null ? `+${retard} min` : '—'}
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20,
                      background: v.statut === 'en_cours' ? 'var(--color-success-bg)' : v.statut === 'annule' ? 'var(--color-danger-bg)' : 'var(--color-info-bg)',
                      color: v.statut === 'en_cours' ? 'var(--color-success)' : v.statut === 'annule' ? 'var(--color-danger)' : 'var(--color-info)',
                    }}>
                      {v.statut}
                    </span>
                    {/* Fonc. 5e — Correspondance */}
                    {v.correspondance && (
                      <span title="En attente d'un correspondant" style={{ marginLeft: 6, fontSize: 11, color: 'var(--color-warning)' }}>⇄</span>
                    )}
                  </td>
                  <td>
                    {/* Fonc. 5d */}
                    <button className="btn btn-ghost btn-sm" style={{ fontSize: 11 }}>Modifier</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal saisie manuelle — Fonc. 5 */}
      {showSaisie && (
        <SaisieModal onClose={() => setShowSaisie(false)} />
      )}
    </div>
  )
}

function SaisieModal({ onClose }) {
  const [form, setForm] = useState({ vehicule_id: '', heure_passage: '', observations: '' })
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
      <div className="card" style={{ width: 400 }}>
        <h3 style={{ marginBottom: 16 }}>Saisie de passage manuel</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <select className="select" onChange={e => setForm(f => ({ ...f, vehicule_id: e.target.value }))}>
            <option value="">Sélectionner un véhicule</option>
            <option value="1">Train 001</option>
            <option value="2">Train 002</option>
          </select>
          <input className="input" type="datetime-local" onChange={e => setForm(f => ({ ...f, heure_passage: e.target.value }))} />
          <textarea className="input" rows={3} placeholder="Observations…" style={{ resize: 'vertical' }}
            onChange={e => setForm(f => ({ ...f, observations: e.target.value }))} />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary btn-sm" onClick={() => { /* TODO: appel API */ onClose() }}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const now = Date.now()
const MOCK_VOYAGES = [
  { id: 1, vehicule_nom: 'Train 001', type: 'train', origine: 'Douala', destination: 'Yaoundé', heure_depart_prevue: new Date(now - 30*60000).toISOString(), heure_depart_reelle: new Date(now - 18*60000).toISOString(), heure_arrivee_prevue: new Date(now + 90*60000).toISOString(), statut: 'en_cours', correspondance: false },
  { id: 2, vehicule_nom: 'Train 002', type: 'train', origine: 'Yaoundé', destination: 'Ngaoundéré', heure_depart_prevue: new Date(now + 60*60000).toISOString(), heure_depart_reelle: null, heure_arrivee_prevue: new Date(now + 300*60000).toISOString(), statut: 'planifie', correspondance: true },
  { id: 3, vehicule_nom: 'Vol CM401', type: 'avion', origine: 'Douala', destination: 'Libreville', heure_depart_prevue: new Date(now - 120*60000).toISOString(), heure_depart_reelle: new Date(now - 120*60000).toISOString(), heure_arrivee_prevue: new Date(now - 30*60000).toISOString(), statut: 'termine', correspondance: false },
]
