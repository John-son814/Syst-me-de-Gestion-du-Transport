# MTMS Frontend — Système de Supervision Multimodale des Transports

## Installation

```bash
npm install
npm run dev
```

Le projet tourne sur http://localhost:3000

## Structure du projet

```
src/
├── main.jsx                  # Point d'entrée React
├── App.jsx                   # Routeur principal + gestion auth
│
├── styles/
│   └── global.css            # Design system complet (variables, composants)
│
├── pages/                    # Une page = un fichier
│   ├── P0_Login.jsx          # Authentification
│   ├── P1_Dashboard.jsx      # Tableau de bord principal (carte + KPI)
│   ├── P2_Vehicle.jsx        # Fiche véhicule (multimode)
│   ├── P3_Schedule.jsx       # Gestion des horaires et escales
│   ├── P4_Alerts.jsx         # Alertes et incidents
│   ├── P5_Infrastructure.jsx # État du réseau et infrastructures
│   ├── P6_History.jsx        # Historique et rapports
│   ├── P7_Admin.jsx          # Administration
│   ├── P8_AI.jsx             # Module IA / Assistant LLM
│   └── P9_Driver.jsx         # Interface opérateur embarqué (mobile)
│
├── components/
│   ├── common/               # Composants partagés
│   │   ├── AppLayout.jsx     # Layout principal (sidebar + header + contenu)
│   │   ├── Sidebar.jsx       # Navigation latérale
│   │   ├── Header.jsx        # Barre supérieure (titre + réseau + alertes + horloge)
│   │   ├── NetworkStatus.jsx # Indicateur GSM/4G/WiFi/hors ligne
│   │   └── AlertBadge.jsx    # Badge flottant alertes critiques
│   │
│   ├── dashboard/            # Composants de la carte (P1)
│   ├── vehicle/              # Composants fiche véhicule (P2)
│   ├── schedule/             # Composants horaires (P3)
│   ├── alerts/               # Composants alertes (P4)
│   ├── infrastructure/       # Composants réseau (P5)
│   ├── history/              # Composants historique (P6)
│   ├── admin/                # Composants admin (P7)
│   ├── ai/                   # Composants LLM (P8)
│   └── driver/               # Composants interface embarquée (P9)
│
├── store/                    # État global (Zustand)
│   ├── authStore.js          # Auth : utilisateur connecté + token JWT
│   ├── vehicleStore.js       # Véhicules : liste + filtres + mises à jour temps réel
│   └── alertStore.js         # Alertes : liste + compteur non lus
│
├── services/                 # Communication backend
│   ├── api.js                # Axios : tous les appels REST (auth, véhicules, voyages...)
│   └── socket.js             # WebSocket : positions et alertes temps réel
│
└── utils/
    └── constants.js          # Constantes, labels multimode, fonctions utilitaires
```

## Logique multimode (train / avion / bateau)

Chaque véhicule a un champ `type` : `'train'`, `'avion'` ou `'bateau'`.

Les composants adaptent leur affichage selon ce champ :
- Labels : `LABELS.arret[type]`, `LABELS.operateur[type]`, etc.
- Données techniques P2 : affichage conditionnel par type
- Carte P5 : score qualité adapté par type d'infrastructure
- Filtres P1/P3 : filtre par type de transport

## Connexion backend

1. Backend : `http://localhost:5000`
2. API REST : `/api/...` (proxied via vite.config.js)
3. WebSocket : `socket.io` sur la même URL

Les données MOCK sont dans chaque page (commentées `// MOCK`).
Remplacer par les vrais appels API quand le backend est prêt.

## Technologies

| Technologie     | Usage                              |
|-----------------|------------------------------------|
| React 18        | Framework UI                       |
| React Router 6  | Navigation entre pages             |
| Zustand         | État global (auth, véhicules, alertes) |
| Axios           | Appels API REST                    |
| Socket.io-client| WebSocket temps réel               |
| React-Leaflet   | Carte OpenStreetMap (à implémenter)|
| Recharts        | Graphiques historique              |
| date-fns        | Manipulation des dates             |
