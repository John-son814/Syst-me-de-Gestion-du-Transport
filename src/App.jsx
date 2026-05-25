import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layout
import AppLayout from './components/common/AppLayout'

// Pages
import LoginPage        from './pages/P0_Login'
import DashboardPage    from './pages/P1_Dashboard'
import VehicleListPage  from './pages/P2_VehicleList'
import VehiclePage      from './pages/P2_Vehicle'
import SchedulePage     from './pages/P3_Schedule'
import AlertsPage       from './pages/P4_Alerts'
import InfraPage        from './pages/P5_Infrastructure'
import HistoryPage      from './pages/P6_History'
import AdminPage        from './pages/P7_Admin'
import AIPage           from './pages/P8_AI'
import DriverPage       from './pages/P9_Driver'

// Route protégée — redirige vers login si non connecté
function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Page publique */}
      <Route path="/login" element={<LoginPage />} />

      {/* Pages protégées avec layout commun */}
      <Route path="/" element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route index                    element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"         element={<DashboardPage />} />
        <Route path="vehicles"          element={<VehicleListPage />} />
        <Route path="vehicle/:id"       element={<VehiclePage />} />
        <Route path="schedule"          element={<SchedulePage />} />
        <Route path="alerts"            element={<AlertsPage />} />
        <Route path="infrastructure"    element={<InfraPage />} />
        <Route path="history"           element={<HistoryPage />} />
        <Route path="admin"             element={<AdminPage />} />
        <Route path="ai"                element={<AIPage />} />
        <Route path="driver"            element={<DriverPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
