// ============================================
// MTMS — Constantes et utilitaires
// ============================================

// Types de transport
export const TRANSPORT_TYPES = {
  TRAIN:  'train',
  AVION:  'avion',
  BATEAU: 'bateau',
}

// Statuts de véhicule
export const VEHICLE_STATUS = {
  EN_MARCHE: 'en_marche',
  A_LARRET:  'a_larret',
  RETARD:    'retard',
  EN_PANNE:  'en_panne',
}

// Sévérité des alertes
export const SEVERITY = {
  CRITIQUE: 'critique',
  MOYEN:    'moyen',
  FAIBLE:   'faible',
}

// Statuts d'alerte
export const ALERT_STATUS = {
  OUVERT:       'ouvert',
  EN_TRAITEMENT:'en_traitement',
  RESOLU:       'resolu',
}

// Rôles utilisateur
export const ROLES = {
  ADMIN:         'admin',
  OPERATEUR:     'operateur',
  CHEF_TERMINAL: 'chef_terminal',
  TECHNICIEN:    'technicien',
  CONDUCTEUR:    'conducteur',
}

// Libellés adaptés par type de transport
export const LABELS = {
  arret: {
    train:  'Gare',
    avion:  'Aéroport',
    bateau: 'Port',
  },
  operateur: {
    train:  'Conducteur',
    avion:  'Pilote',
    bateau: 'Capitaine',
  },
  escale: {
    train:  'Arrêt',
    avion:  'Escale',
    bateau: 'Escale maritime',
  },
  infrastructure: {
    train:  'Voie ferrée',
    avion:  'Couloir aérien',
    bateau: 'Voie maritime',
  }
}

// ── FONCTIONS UTILITAIRES ──────────────────────

// Formate une date en HH:MM
export function formatTime(dateStr) {
  if (!dateStr) return '--:--'
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

// Formate une date en DD/MM/YYYY
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

// Calcule le retard en minutes entre deux timestamps
export function getDelayMinutes(planned, actual) {
  if (!planned || !actual) return null
  return Math.round((new Date(actual) - new Date(planned)) / 60000)
}

// Retourne la couleur de statut de retard
export function getDelayColor(minutes) {
  if (minutes === null) return 'var(--color-text-muted)'
  if (minutes <= 0)  return 'var(--color-success)'
  if (minutes <= 30) return 'var(--color-warning)'
  return 'var(--color-danger)'
}

// Retourne le label de sévérité
export function getSeverityLabel(severity) {
  const map = { critique: 'Critique', moyen: 'Moyen', faible: 'Faible' }
  return map[severity] || severity
}

// Retourne la couleur par type de transport
export function getTransportColor(type) {
  const map = {
    train:  'var(--color-train)',
    avion:  'var(--color-avion)',
    bateau: 'var(--color-bateau)',
  }
  return map[type] || 'var(--color-text-secondary)'
}

// Tronque un texte long
export function truncate(str, n = 40) {
  if (!str) return ''
  return str.length > n ? str.slice(0, n) + '…' : str
}
