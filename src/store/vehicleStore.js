import { create } from 'zustand'

// Store global des véhicules — mis à jour via WebSocket/MQTT en temps réel

export const useVehicleStore = create((set, get) => ({
  vehicles: [],          // Liste complète des véhicules actifs
  selectedId: null,      // ID du véhicule sélectionné sur la carte
  filterType: 'all',     // 'all' | 'train' | 'avion' | 'bateau'

  // Met à jour la position/statut d'un véhicule en temps réel
  updateVehicle: (id, data) => set(state => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...data } : v)
  })),

  // Remplace toute la liste (chargement initial)
  setVehicles: (vehicles) => set({ vehicles }),

  // Ajoute un nouveau véhicule
  addVehicle: (vehicle) => set(state => ({
    vehicles: [...state.vehicles, vehicle]
  })),

  setSelectedId: (id) => set({ selectedId: id }),
  setFilterType: (type) => set({ filterType: type }),

  // Véhicules filtrés selon le type sélectionné
  getFiltered: () => {
    const { vehicles, filterType } = get()
    if (filterType === 'all') return vehicles
    return vehicles.filter(v => v.type === filterType)
  }
}))
