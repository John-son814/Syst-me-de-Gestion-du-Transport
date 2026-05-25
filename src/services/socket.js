import { io } from 'socket.io-client'
import { useVehicleStore } from '../store/vehicleStore'
import { useAlertStore } from '../store/alertStore'

let socket = null

export function connectSocket(token) {
  if (socket?.connected) return

  socket = io('/', {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  })

  socket.on('connect', () => {
    console.log('[WebSocket] Connecté au serveur temps réel')
  })

  socket.on('disconnect', () => {
    console.warn('[WebSocket] Déconnecté')
  })

  // Mise à jour position / statut d'un véhicule
  socket.on('vehicle:update', (data) => {
    useVehicleStore.getState().updateVehicle(data.id, data)
  })

  // Nouvelle alerte temps réel
  socket.on('alert:new', (alert) => {
    useAlertStore.getState().addAlert(alert)
  })

  // Mise à jour statut alerte
  socket.on('alert:update', ({ id, statut }) => {
    useAlertStore.getState().updateStatus(id, statut)
  })
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function getSocket() {
  return socket
}
