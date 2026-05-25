import { create } from 'zustand'

export const useAlertStore = create((set) => ({
  alerts: [],           // Toutes les alertes actives
  unreadCount: 0,

  setAlerts: (alerts) => set({ alerts, unreadCount: alerts.filter(a => !a.read).length }),

  addAlert: (alert) => set(state => ({
    alerts: [alert, ...state.alerts],
    unreadCount: state.unreadCount + 1
  })),

  markRead: (id) => set(state => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, read: true } : a),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  updateStatus: (id, status) => set(state => ({
    alerts: state.alerts.map(a => a.id === id ? { ...a, statut: status } : a)
  })),

  markAllRead: () => set(state => ({
    alerts: state.alerts.map(a => ({ ...a, read: true })),
    unreadCount: 0
  }))
}))
