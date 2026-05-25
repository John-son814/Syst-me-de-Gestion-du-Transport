import { create } from 'zustand'

// Store global d'authentification (Zustand)
// Remplace le contenu par l'appel API réel quand le backend est prêt

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  user: null,          // { id, nom, prenom, role, email }
  token: null,

  login: (userData, token) => set({
    isAuthenticated: true,
    user: userData,
    token
  }),

  logout: () => set({
    isAuthenticated: false,
    user: null,
    token: null
  }),
}))
