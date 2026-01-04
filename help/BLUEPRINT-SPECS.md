# BLUEPRINT — Spécifications Projet

> Dernière mise à jour : 2 janvier 2026

## 🎯 Vision

**Blueprint** est un outil de pilotage de projets pour le Product Builder de YouSchool. Il centralise le cadrage, la documentation et le suivi de chaque projet interne — du brief initial jusqu'aux évolutions futures.

> **"Dans Blueprint, un problème devient un brief, un brief devient un projet, un projet devient une solution. Et chaque solution continue de vivre."**

---

## 🏗️ Architecture en 3 espaces

```
BLUEPRINT
│
├── 📝 Briefs       → Les problèmes à analyser
│
├── 🚀 Projets      → Ce qu'on construit
│
└── ✅ Solutions    → Ce qui est live (V2+)
```

---

## 📐 Architecture de l'information

### Hiérarchie d'un Projet

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

### Table `briefs`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| name | text | Nom du brief |
| problem | text | Description du problème |
| affected_users | text[] | Utilisateurs impactés |
| impact | text | Impact actuel |
| constraints | text | Contraintes connues |
| initial_idea | text | Idée du demandeur (optionnel) |
| urgency | text | Niveau d'urgence |
| context | text | Contexte additionnel |
| status | text | Statut du brief |
| created_by | uuid (FK) | Auteur du brief |
| created_at | timestamptz | Date création |

### Table `brief_proposals`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| brief_id | uuid (FK) | Brief parent |
| name | text | Nom de l'option |
| description | text | Description |
| format | text | Type de livrable |
| effort | text | Niveau d'effort |
| pros | text | Avantages |
| cons | text | Limites |
| is_selected | boolean | Option retenue ? |
| created_at | timestamptz | Date création |

### Table `projects`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| name | text | Nom du projet |
| description | text | Description courte |
| type | text | plateforme, landing, dashboard, outil, integration |
| has_modules | boolean | Avec ou sans modules |
| status | text | cadrage, conception, dev, recette, live, pause, abandonné |
| brief_id | uuid (FK) | Brief d'origine (nullable) |
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

### Table `validations`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| block_id | uuid (FK) | Bloc concerné |
| status | text | pending, approved, rejected, commented |
| comment | text | Commentaire (si refus/question) |
| requested_by | uuid (FK) | Qui a demandé |
| requested_at | timestamptz | Date demande |
| validated_by | uuid (FK) | Qui a validé |
| validated_at | timestamptz | Date validation |

---

## 🛣️ Parcours Utilisateur

### Parcours Brief → Projet

```
1. Login (/login)
   └── Email + Password
   
2. Soumettre un brief (/briefs/new)
   └── Formulaire conversationnel (10 écrans)
   
3. Liste des briefs (/briefs)
   ├── Voir tous les briefs
   ├── Filtrer par statut
   └── Cliquer sur un brief → /briefs/[id]

4. Page brief (/briefs/[id])
   ├── Voir le problème soumis
   ├── Ajouter des propositions de solutions
   ├── Arbitrer (choisir une option)
   └── Convertir en projet → /projects/[id]
```

### Parcours Projet

```
5. Liste des projets (/projects)
   ├── Voir tous les projets
   ├── Filtrer par statut, type
   └── Cliquer sur un projet → /projects/[id]

6a. Page projet SANS modules (/projects/[id])
    ├── Header (nom, type, statut, description)
    ├── Onglets (Objectifs, Rôles, Architecture...)
    ├── Blocs éditables via Drawer
    └── Demander validation sur chaque bloc

6b. Page projet AVEC modules (/projects/[id])
    ├── Header (nom, type, statut, description)
    ├── Liste des modules
    ├── Créer un module
    └── Cliquer sur module → /projects/[id]/modules/[moduleId]

7. Page module (/projects/[id]/modules/[moduleId])
   ├── Header (nom module)
   ├── Onglets (Objectifs, Rôles, Architecture...)
   └── Blocs éditables via Drawer
```

---

## 👥 Rôles Utilisateurs

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
