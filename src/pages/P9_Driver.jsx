// ===========================================
// P9_Driver — Interface opérateur embarqué
// Rôles : Conducteurs · Pilotes · Capitaines
// Fonctionnalités :
//   Fonc. 13  — Vue smartphone : prochain arrêt, ETA, retard
//   Fonc. 13b — Signaler un incident via MQTT/GSM
//   Fonc. 13c — Statut connexion réseau
//   Fonc. 13d — Instructions du centre de contrôle
// ===========================================

export default function P9_DriverPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card">
        <h2 style={{ marginBottom: 8, fontSize: 16 }}>Interface opérateur embarqué</h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
          TODO : implémenter les fonctionnalités de cette page.
          Voir les commentaires en haut du fichier pour le détail.
        </p>
      </div>
    </div>
  )
}
