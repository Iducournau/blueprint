# COCKPIT — Spécifications Projet

> Dernière mise à jour : 2 janvier 2026

## 🎯 Vision

COCKPIT est un outil de pilotage de projets pour le Product Builder de YouSchool. Il centralise le cadrage, la documentation et le suivi de chaque projet interne.

---

## 📐 Architecture de l'information

### Hiérarchie

```
Projet
├── Type (Plateforme, Landing Page, Dashboard, Outil interne, Intégration)
├── Avec/Sans modules
│
├── [Si SANS modules] → Onglets directement sur le projet
│   ├── Objectifs (Problème, Solution, KPIs)
│   ├── Rôles
│   ├── Architecture
│   ├── Fonctionnalités
│   ├── Roadmap
│   └── Notice
│
└── [Si AVEC modules] → Liste de modules
    └── Module
        ├── Objectifs
        ├── Rôles
        ├── Architecture
        ├── Fonctionnalités
        ├── Roadmap
        └── Notice
```

### Types de projet

| Type | Description | Exemple | Modules ? |
|------|-------------|---------|-----------|
| Plateforme | App avec plusieurs modules | Hub | Souvent oui |
| Landing Page | Page unique, A/B test | LP Mode | Non |
| Dashboard | Visualisation de données | Analytics | Parfois |
| Outil interne | App métier spécifique | Calculateur | Rarement |
| Intégration | Connecteur, API, automation | Sync CRM | Non |

### Onglets standard

| Onglet | Blocs | Description |
|--------|-------|-------------|
| **Objectifs** | Problème, Solution, KPIs | Cadrage stratégique |
| **Rôles** | Acteurs, Responsabilités | Qui fait quoi (swimlane) |
| **Architecture** | Stack, Schémas | Choix techniques |
| **Fonctionnalités** | Liste features | Ce qu'on construit |
| **Roadmap** | Jalons, Versions | Planning |
| **Notice** | Documentation | Guide utilisateur |

---

## 🗄️ Structure Base de Données (Supabase)

### Table `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| name | text | Nom du projet |
| description | text | Description courte |
| type | text | plateforme, landing, dashboard, outil, integration |
| has_modules | boolean | Avec ou sans modules |
| user_id | uuid (FK) | Propriétaire |
| created_at | timestamptz | Date création |

### Table `modules`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| project_id | uuid (FK) | Projet parent |
| name | text | Nom du module |
| description | text | Description |
| created_at | timestamptz | Date création |

### Table `blocks`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| project_id | uuid (FK) | Projet (si sans modules) |
| module_id | uuid (FK) | Module (si avec modules) |
| tab | text | Onglet (objectifs, architecture...) |
| type | text | Type de bloc (problem, solution...) |
| content | text | Contenu du bloc |
| order | int4 | Ordre d'affichage |
| created_at | timestamptz | Date création |

---

## 🛣️ Parcours Utilisateur

### Parcours principal

```
1. Login (/login)
   └── Email + Password
   
2. Liste des projets (/)
   ├── Voir tous mes projets
   ├── Créer un projet → /project/new
   └── Cliquer sur un projet → /project/[id]

3a. Page projet SANS modules (/project/[id])
    ├── Header (nom, type, description)
    ├── Onglets (Objectifs, Rôles, Architecture...)
    └── Blocs éditables via Drawer

3b. Page projet AVEC modules (/project/[id])
    ├── Header (nom, type, description)
    ├── Liste des modules
    ├── Créer un module
    └── Cliquer sur module → /project/[id]/module/[moduleId]

4. Page module (/project/[id]/module/[moduleId])
   ├── Header (nom module)
   ├── Onglets (Objectifs, Rôles, Architecture...)
   └── Blocs éditables via Drawer
```

---

## 👥 Rôles Utilisateurs (V2+)

| Rôle | Voir | Éditer | Commenter | Valider | Créer | Gérer users |
|------|------|--------|-----------|---------|-------|-------------|
| Owner | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Viewer | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 🎨 Design System

| Élément | Valeur |
|---------|--------|
| Font logo | DM Serif Display 400 |
| Font body | Inter (via Next.js) |
| Couleur primaire | Indigo (shadcn default) |
| Icons | Lucide React |
| Composants | shadcn/ui |
| Style | Tailwind CSS |

---

## 📱 Responsive

| Device | Priorité | Usage |
|--------|----------|-------|
| Desktop | 🥇 Principal | Édition, création |
| Tablet | 🥈 Secondaire | Consultation |
| Mobile | 🥉 Lecture seule | Consultation rapide |
