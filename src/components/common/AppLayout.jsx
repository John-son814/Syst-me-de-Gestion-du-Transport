import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AlertBadge from './AlertBadge'

// Layout commun à toutes les pages protégées
// Contient : Sidebar gauche + Header haut + contenu (Outlet)

export default function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
      <AlertBadge />
    </div>
  )
}
