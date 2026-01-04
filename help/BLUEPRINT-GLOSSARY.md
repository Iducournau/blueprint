# BLUEPRINT — Glossaire

> Définitions des termes utilisés dans le projet

---

## Concepts métier

| Terme | Définition |
|-------|------------|
| **Blueprint** | L'outil de pilotage. Le plan de référence de tous les projets digitaux internes. |
| **Brief** | Demande soumise décrivant un problème à résoudre. Point de départ du workflow. |
| **Proposition** | Solution imaginée par le Product Builder en réponse à un brief. |
| **Projet** | Solution en cours de construction, après arbitrage d'un brief. |
| **Solution** | Produit digital live, qui continue de vivre et d'évoluer (V2+). |
| **Module** | Sous-partie d'un projet de type "Plateforme". Ex: Hub contient les modules OGS, Bibles, etc. |
| **Onglet** | Section thématique d'un projet ou module (Objectifs, Architecture, Roadmap...) |
| **Bloc** | Unité de contenu éditable à l'intérieur d'un onglet (Problème, Solution, Stack...) |
| **Drawer** | Panneau latéral qui s'ouvre pour éditer le contenu d'un bloc |
| **Validation** | Approbation d'un bloc par un validateur (CMO, CPO...) |
| **Swimlane** | Représentation visuelle des rôles et responsabilités (qui fait quoi) |

---

## Le workflow Blueprint

| Étape | Description |
|-------|-------------|
| **1. Brief** | Un problème est soumis via le formulaire conversationnel |
| **2. Analyse** | Le Product Builder étudie le brief |
| **3. Propositions** | Le Product Builder propose 1 à 3 solutions |
| **4. Arbitrage** | CMO + Product Builder choisissent une direction |
| **5. Projet** | La solution retenue devient un projet |
| **6. Construction** | Cadrage → Conception → Dev → Recette |
| **7. Solution** | Le projet live devient une Solution (V2+) |
| **8. Évolution** | Nouvelles versions, optimisations |

---

## Statuts des briefs

| Statut | Description |
|--------|-------------|
| 🟡 **En attente d'analyse** | Brief soumis, pas encore étudié |
| 🔵 **En cours d'analyse** | Product Builder travaille dessus |
| 🟣 **Propositions prêtes** | Solutions proposées, en attente d'arbitrage |
| ✅ **Validé → Projet** | Solution choisie, projet créé |
| ⚫ **Classé sans suite** | Pas un vrai projet |
| 🔴 **Rejeté** | Non pertinent |

---

## Statuts des projets

| Statut | Description |
|--------|-------------|
| 🟡 **Cadrage** | Définition des specs |
| 🔵 **Conception** | Maquettes, architecture |
| 🟠 **Développement** | En cours de build |
| 🟣 **Recette** | Tests, validation |
| 🟢 **Live** | En production |
| ⏸️ **En pause** | Suspendu temporairement |
| ⚫ **Abandonné** | Annulé |

---

## Statuts de validation

| Statut | Description |
|--------|-------------|
| ⬜ **Non soumis** | Pas encore demandé |
| 🟡 **En attente** | Validation demandée |
| ✅ **Validé** | Approuvé |
| ❌ **Refusé** | Rejeté (avec commentaire) |
| 💬 **Commenté** | Question ou remarque |

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

## Rôles utilisateur

| Rôle | Description |
|------|-------------|
| **Owner** | Créateur du projet, tous les droits (Product Builder) |
| **Editor** | Peut voir et éditer, pas créer de projets (CMO/CPO) |
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
