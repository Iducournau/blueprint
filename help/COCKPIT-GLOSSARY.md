# COCKPIT — Glossaire

> Définitions des termes utilisés dans le projet

---

## Concepts métier

| Terme | Définition |
|-------|------------|
| **Projet** | Unité principale de travail. Représente une solution digitale à construire (app, dashboard, LP...) |
| **Module** | Sous-partie d'un projet de type "Plateforme". Ex: Hub contient les modules OGS, Bibles, etc. |
| **Onglet** | Section thématique d'un projet ou module (Objectifs, Architecture, Roadmap...) |
| **Bloc** | Unité de contenu éditable à l'intérieur d'un onglet (Problème, Solution, Stack...) |
| **Drawer** | Panneau latéral qui s'ouvre pour éditer le contenu d'un bloc |
| **Swimlane** | Représentation visuelle des rôles et responsabilités (qui fait quoi) |

---

## Types de projet

| Type | Description |
|------|-------------|
| **Plateforme** | Application complexe avec plusieurs modules. Ex: Hub |
| **Landing Page** | Page web unique, souvent utilisée pour A/B testing. Ex: LP Mode |
| **Dashboard** | Interface de visualisation de données et KPIs |
| **Outil interne** | Application métier pour un besoin spécifique |
| **Intégration** | Connecteur entre systèmes, API, automatisation |

---

## Types de blocs

| Bloc | Onglet | Description |
|------|--------|-------------|
| **problem** | Objectifs | Le problème à résoudre |
| **solution** | Objectifs | La solution proposée |
| **kpis** | Objectifs | Indicateurs de succès |
| **actors** | Rôles | Les acteurs impliqués |
| **responsibilities** | Rôles | Qui fait quoi |
| **stack** | Architecture | Technologies utilisées |
| **schemas** | Architecture | Schémas techniques |
| **features** | Fonctionnalités | Liste des features |
| **milestones** | Roadmap | Jalons du projet |
| **versions** | Roadmap | Versioning |
| **doc** | Notice | Documentation utilisateur |

---

## Termes techniques

| Terme | Définition |
|-------|------------|
| **Next.js** | Framework React pour applications web (notre stack frontend) |
| **Supabase** | Backend-as-a-Service : base de données PostgreSQL + auth |
| **shadcn/ui** | Librairie de composants UI pour React |
| **Tailwind CSS** | Framework CSS utilitaire |
| **RLS** | Row Level Security — sécurité au niveau des lignes dans Supabase |
| **Vercel** | Plateforme d'hébergement pour Next.js |
| **UUID** | Identifiant unique universel (format des IDs dans Supabase) |

---

## Rôles utilisateur (V2+)

| Rôle | Description |
|------|-------------|
| **Owner** | Créateur du projet, tous les droits |
| **Editor** | Peut voir et éditer, pas créer de projets |
| **Viewer** | Lecture seule |
| **Reviewer** | (V3) Peut commenter et valider, pas éditer |

---

## Acronymes

| Acronyme | Signification |
|----------|---------------|
| **MVP** | Minimum Viable Product |
| **CRUD** | Create, Read, Update, Delete |
| **UI/UX** | User Interface / User Experience |
| **API** | Application Programming Interface |
| **LP** | Landing Page |
| **OGS** | (Module Hub) Organic Growth & SEO |
