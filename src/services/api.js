import axios from 'axios'
import { useAuthStore } from '../store/authStore'

// Instance axios avec base URL et intercepteurs
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Injecte le token JWT dans chaque requête
api.interceptors.request.use(config => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Déconnexion automatique si token expiré
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── AUTH ──────────────────────────────────────
export const authAPI = {
  login:  (data)  => api.post('/auth/login', data),
  logout: ()      => api.post('/auth/logout'),
  me:     ()      => api.get('/auth/me'),
}

// ── VÉHICULES ─────────────────────────────────
export const vehicleAPI = {
  getAll:   (params) => api.get('/vehicles', { params }),
  getById:  (id)     => api.get(`/vehicles/${id}`),
  create:   (data)   => api.post('/vehicles', data),
  update:   (id, d)  => api.put(`/vehicles/${id}`, d),
  delete:   (id)     => api.delete(`/vehicles/${id}`),
  getHistory: (id)   => api.get(`/vehicles/${id}/history`),
}

// ── TERMINAUX (gares / aéroports / ports) ──────
export const terminalAPI = {
  getAll:  (params) => api.get('/terminals', { params }),
  getById: (id)     => api.get(`/terminals/${id}`),
  create:  (data)   => api.post('/terminals', data),
  update:  (id, d)  => api.put(`/terminals/${id}`, d),
  delete:  (id)     => api.delete(`/terminals/${id}`),
}

// ── VOYAGES ───────────────────────────────────
export const voyageAPI = {
  getAll:    (params) => api.get('/voyages', { params }),
  getById:   (id)     => api.get(`/voyages/${id}`),
  create:    (data)   => api.post('/voyages', data),
  update:    (id, d)  => api.put(`/voyages/${id}`, d),
  cancel:    (id)     => api.patch(`/voyages/${id}/cancel`),
  reschedule:(id, d)  => api.patch(`/voyages/${id}/reschedule`, d),
}

// ── ARRÊTS / PASSAGES ─────────────────────────
export const arretAPI = {
  getByVoyage: (vid)  => api.get(`/voyages/${vid}/arrets`),
  saisieManuelle: (d) => api.post('/arrets/manual', d),
}

// ── ALERTES & INCIDENTS ───────────────────────
export const alertAPI = {
  getAll:       (params) => api.get('/alerts', { params }),
  getById:      (id)     => api.get(`/alerts/${id}`),
  create:       (data)   => api.post('/alerts', data),
  updateStatus: (id, s)  => api.patch(`/alerts/${id}/status`, { statut: s }),
  addComment:   (id, c)  => api.post(`/alerts/${id}/comments`, { comment: c }),
  getSuggestions: (id)   => api.get(`/alerts/${id}/suggestions`),
  applySuggestion:(id,s) => api.post(`/alerts/${id}/suggestions/apply`, { suggestion: s }),
}

// ── INFRASTRUCTURE ────────────────────────────
export const infraAPI = {
  getSegments:  ()       => api.get('/infrastructure/segments'),
  getById:      (id)     => api.get(`/infrastructure/segments/${id}`),
  report:       (data)   => api.post('/infrastructure/report', data),
  plan:         (id, d)  => api.patch(`/infrastructure/segments/${id}/plan`, d),
}

// ── HISTORIQUE & RAPPORTS ─────────────────────
export const historyAPI = {
  getTrajet:  (vehicleId, date) => api.get('/history/trajet', { params: { vehicleId, date } }),
  getStats:   (params)          => api.get('/history/stats', { params }),
  export:     (params)          => api.get('/history/export', { params, responseType: 'blob' }),
}

// ── ADMIN ─────────────────────────────────────
export const adminAPI = {
  // Utilisateurs
  getUsers:   ()      => api.get('/admin/users'),
  createUser: (data)  => api.post('/admin/users', data),
  updateUser: (id, d) => api.put(`/admin/users/${id}`, d),
  deleteUser: (id)    => api.delete(`/admin/users/${id}`),
  // Lignes
  getLines:   ()      => api.get('/admin/lines'),
  createLine: (data)  => api.post('/admin/lines', data),
  // Personnel
  getStaff:   ()      => api.get('/admin/staff'),
  createStaff:(data)  => api.post('/admin/staff', data),
  // Config
  getConfig:  ()      => api.get('/admin/config'),
  saveConfig: (data)  => api.put('/admin/config', data),
  // Audit
  getAuditLog:(params)=> api.get('/admin/audit', { params }),
}

// ── LLM / IA ──────────────────────────────────
export const aiAPI = {
  getSuggestions: (context) => api.post('/ai/suggest', context),
  getHistory:     ()        => api.get('/ai/history'),
  feedback:       (id, f)   => api.post(`/ai/feedback/${id}`, { decision: f }),
}

export default api
