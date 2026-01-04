# BLUEPRINT — Vision Produit

> Document issu du brainstorm du 2 janvier 2026

---

## 💬 Le pitch

> **"Dans Blueprint, un problème devient un brief, un brief devient un projet, un projet devient une solution digitale. Et chaque solution continue de vivre et d'évoluer."**

---

## 🎯 Positionnement

Blueprint n'est pas un outil de documentation. C'est un **outil de pilotage vivant** qui :

1. **Structure la naissance des projets** — Plus de briefs fantômes
2. **Trace les validations** — Plus de mails perdus
3. **Facilite la communication** — Plus de reformulation manuelle
4. **Suit le cycle de vie** — Du brief initial à la V4.2.0

---

## 🏗️ Architecture en 3 espaces

```
BLUEPRINT
│
├── 📝 Briefs       → Les problèmes à analyser
│
├── 🚀 Projets      → Ce qu'on construit
│
└── ✅ Solutions    → Ce qui est live (et continue de vivre)
```

| Espace | Rôle | Ce qui s'y passe |
|--------|------|------------------|
| **Briefs** | Naissance | Problème soumis → Analyse → Propositions → Arbitrage |
| **Projets** | Construction | Cadrage → Conception → Dev → Recette → Déploiement |
| **Solutions** | Vie & Évolution | Suivi KPIs, bugs, optimisations, nouvelles versions |

---

## 🔥 Les 6 fractures identifiées

| # | Fracture | Problème | Solution Blueprint |
|---|----------|----------|-------------------|
| 1 | **Brief fantôme** 👻 | Projets reçus sans contexte ni "pourquoi" | Formulaire de brief structuré obligatoire |
| 2 | **Info éclatée** 🧩 | Brief, maquettes, décisions dans 10 outils | Point de convergence unique |
| 3 | **Communication descendante** 📢 | CMO doit reformuler pour chaque manager | Vues exportables auto-générées |
| 4 | **Projet qui dérive** 🌊 | Priorités/scope changent sans trace | Historique des changements visible |
| 5 | **Projet zombie** 🧟 | Projets ni vivants ni morts qui traînent | Statuts explicites + alertes inactivité |
| 6 | **Validation dans les limbes** 🕳️ | Validé par mail, perdu, non tracé | Validation traçable avec signature + date |

---

## 📝 Espace Briefs

### Philosophie

> Le demandeur décrit le **problème**. Le Product Builder propose la **solution**.

C'est un changement de posture fondamental : on ne reçoit plus des demandes de "fais-moi un dashboard", mais des problèmes à résoudre.

### Statuts du brief

| Statut | Signification |
|--------|---------------|
| 🟡 **En attente d'analyse** | Brief soumis, pas encore étudié |
| 🔵 **En cours d'analyse** | Product Builder travaille dessus |
| 🟣 **Propositions prêtes** | Solutions proposées, en attente d'arbitrage |
| ✅ **Validé → Projet** | Solution choisie, projet créé |
| ⚫ **Classé sans suite** | Pas un vrai projet (tâche simple, doublon, non prioritaire) |
| 🔴 **Rejeté** | Pas pertinent / hors scope |

### Formulaire de brief (tunnel conversationnel)

**Principes :**
- Une question = un écran
- Ton conversationnel
- Pas de champs obligatoires (V1)
- Durée cible : 90 secondes à 2 minutes

**Questions :**

| # | Écran | Question | Donnée collectée |
|---|-------|----------|------------------|
| 1 | Intro | "Décris-nous ton besoin" | — |
| 2 | Nom | "Donne un nom à cette demande" | `brief.name` |
| 3 | Problème | "Quel problème cherches-tu à résoudre ?" | `brief.problem` |
| 4 | Impactés | "Qui souffre de ce problème ?" | `brief.affected_users` |
| 5 | Impact | "Quel est l'impact aujourd'hui ?" | `brief.impact` |
| 6 | Contraintes | "Y a-t-il des contraintes à connaître ?" | `brief.constraints` |
| 7 | Idée | "Tu as peut-être déjà une idée ?" *(optionnel)* | `brief.initial_idea` |
| 8 | Urgence | "C'est urgent ?" | `brief.urgency` |
| 9 | Contexte | "Autre chose qu'on devrait savoir ?" *(optionnel)* | `brief.context` |
| 10 | Récap | Résumé + validation | — |

**Ce que le demandeur NE remplit PAS :**
- Solution (c'est le job du Product Builder)
- KPIs précis (définis après analyse)
- Type de projet (expertise Product Builder)
- Stack technique (expertise Product Builder)

### Notification brief

| Événement | Destinataire | Canal | Condition |
|-----------|--------------|-------|-----------|
| Brief soumis | Product Builder | 📧 Email + in-app | Sauf si c'est elle qui l'a créé |

---

## 💡 L'Analyse (Product Builder)

Après réception d'un brief, le Product Builder :

1. Étudie le problème
2. Propose 1 à 3 solutions

### Format des propositions

```
💡 Propositions de solutions
│
├── Option A — [Nom]
│   ├── Description : [Ce qu'on fait]
│   ├── Format : [Module / Intégration / Dashboard / LP / Automatisation]
│   ├── Effort : 🟢 Faible / 🟡 Moyen / 🔴 Élevé
│   ├── Avantages : [Points positifs]
│   └── Limites : [Points de vigilance]
│
├── Option B — [Nom]
│   └── ...
│
└── Option C — [Nom]
    └── ...
```

### Arbitrage

En point avec le CMO (ou async) :
- Choix d'une option
- Raison du choix
- Ajustements éventuels

→ Le brief est converti en **Projet**

---

## 🚀 Espace Projets

### Infos héritées du brief

| Champ projet | Source |
|--------------|--------|
| Problème | `brief.problem` |
| Acteurs | `brief.affected_users` |
| Contraintes | `brief.constraints` |
| Solution | Rédigée par Product Builder |
| Origine | Lien vers le brief d'origine |

### Statuts projet

| Statut | Signification |
|--------|---------------|
| 🟡 **Cadrage** | Définition des specs |
| 🔵 **Conception** | Maquettes, architecture |
| 🟠 **Développement** | En cours de build |
| 🟣 **Recette** | Tests, validation |
| 🟢 **Live** | En production → passe dans Solutions |
| ⏸️ **En pause** | Suspendu temporairement |
| ⚫ **Abandonné** | Annulé |

---

## ✅ Espace Solutions (V2+)

Les projets terminés deviennent des **Solutions** — des produits vivants qu'on continue de faire évoluer.

### Ce qu'on y trouve

| Élément | Description |
|---------|-------------|
| **Fiche produit** | Résumé de la solution, son historique, ses KPIs |
| **Versions** | Hub v1.0.0, v2.0.0, v4.2.0... |
| **Évolutions** | Nouveaux briefs/projets rattachés à cette solution |
| **Métriques** | Suivi des KPIs définis |
| **Incidents** | Bugs, problèmes remontés |

### Le cycle vertueux

```
Solution live (Hub v3)
        │
        ▼
Nouveau problème identifié
        │
        ▼
Nouveau Brief rattaché à Hub
        │
        ▼
Nouveau Projet (Hub v4)
        │
        ▼
Solution mise à jour (Hub v4)
```

---

## ✅ Système de validation

### Deux niveaux de validation

| Niveau | Usage | Granularité |
|--------|-------|-------------|
| **Validation de contenu** | "Ce que j'ai écrit est-il correct ?" | Par bloc |
| **Validation de jalon** | "Peut-on passer à la phase suivante ?" | Par phase |

### Validation par bloc

| État | Signification |
|------|---------------|
| ⬜ | Pas encore soumis |
| 🟡 | En attente de validation |
| ✅ | Validé |
| ❌ | Refusé (avec commentaire) |
| 💬 | Commentaire / question |

Chaque validation inclut :
- Qui a validé
- Date et heure
- Commentaire (si refus ou question)

### Workflow de validation

```
1. Product Builder clique "Demander validation" sur un bloc
2. Assigne à quelqu'un (CMO, CPO...)
3. Le validateur reçoit une notification (in-app, email en V2)
4. Le validateur : ✅ Valide / ❌ Refuse / 💬 Commente
5. Product Builder voit le résultat
```

### Vue "En attente de validation"

| Projet | Bloc | En attente de | Depuis | Deadline |
|--------|------|---------------|--------|----------|
| Hub | Objectifs > KPIs | Paul (CMO) | 5 jours | 15/01 ⚠️ |

---

## 🔔 Notifications (V1 → V2)

| Événement | V1 | V2 | Canal |
|-----------|----|----|-------|
| Brief soumis | ✅ | ✅ | Email + in-app |
| Validation demandée | — | ✅ | Email + in-app |
| Relance auto J+3, J+7 | — | ✅ | Email |
| Validation reçue | ✅ | ✅ | In-app |
| Brief → Projet converti | ✅ | ✅ | In-app |

---

## 📊 Priorisation

### V1 — Must-have

| Feature | Catégorie |
|---------|-----------|
| Formulaire de brief conversationnel | Brief |
| Vue liste des briefs avec statuts | Brief |
| Propositions de solutions sur un brief | Analyse |
| Conversion brief → projet | Workflow |
| Statut projet (Cadrage/Dev/Live/Pause/Abandonné) | Projet |
| Validation par bloc (✅/❌/💬) avec signature + date | Validation |
| Bouton "Demander validation" + assignation | Validation |
| Vue "En attente de validation" | Validation |
| Email à la soumission d'un brief | Notifications |
| Dashboard projets avec filtres par statut | Vision |

### V1 — Nice-to-have

| Feature | Catégorie |
|---------|-----------|
| Brief "brouillon" tant qu'incomplet | Brief |
| Historique de genèse (qui a demandé, quand) | Brief |
| Vue "Résumé exécutif" auto-générée | Communication |

### V2

| Feature | Catégorie |
|---------|-----------|
| Espace Solutions | Architecture |
| Email sur demande de validation | Notifications |
| Relance auto J+3, J+7 | Notifications |
| Validation de jalon (passage de phase) | Phases |
| Lien public lecture seule | Communication |
| Historique des validations | Validation |
| Alerte projet zombie (inactif > 30 jours) | Vision |
| Score de maturité projet | Vision |

### V3+

| Feature | Catégorie |
|---------|-----------|
| Versioning des solutions | Solutions |
| Export PDF | Communication |
| Mode présentation (slides) | Communication |
| Résumé hebdo par email | Notifications |
| Suggestions IA | Automatisation |
| Timeline croisée multi-projets | Vision |

---

## 🗄️ Impact sur la base de données

### Nouvelle table `briefs`

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

### Nouvelle table `brief_proposals`

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

### Modification table `projects`

| Nouvelle colonne | Type | Description |
|------------------|------|-------------|
| brief_id | uuid (FK) | Brief d'origine (nullable) |
| status | text | Statut projet |

### Nouvelle table `validations`

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| block_id | uuid (FK) | Bloc concerné |
| status | text | ✅/❌/💬/🟡 |
| comment | text | Commentaire (si refus/question) |
| requested_by | uuid (FK) | Qui a demandé |
| requested_at | timestamptz | Date demande |
| validated_by | uuid (FK) | Qui a validé |
| validated_at | timestamptz | Date validation |

### Nouvelle table `solutions` (V2+)

| Colonne | Type | Description |
|---------|------|-------------|
| id | uuid (PK) | Identifiant unique |
| name | text | Nom de la solution |
| description | text | Description |
| current_version | text | Version actuelle (ex: v4.2.0) |
| project_id | uuid (FK) | Projet d'origine |
| status | text | active / deprecated / retired |
| launched_at | timestamptz | Date de mise en prod |
| created_at | timestamptz | Date création |

---

## 📐 Schéma du flux complet

```
┌─────────────────────────────────────────────────────────────────────┐
│                            BLUEPRINT                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📝 BRIEFS           🚀 PROJETS           ✅ SOLUTIONS              │
│  ──────────          ──────────           ────────────              │
│                                                                     │
│  ┌───────────┐       ┌───────────┐       ┌───────────┐              │
│  │ Problème  │       │  Cadrage  │       │  Hub v3   │              │
│  │ soumis    │       │     ↓     │       │  (live)   │              │
│  └─────┬─────┘       │Conception │       └─────┬─────┘              │
│        ↓             │     ↓     │             │                    │
│  ┌───────────┐       │   Dev     │      Nouveau problème            │
│  │ Analyse   │       │     ↓     │             │                    │
│  │ + Props   │       │ Recette   │             ▼                    │
│  └─────┬─────┘       │     ↓     │       ┌───────────┐              │
│        ↓             │   Live ───┼──────▶│  Hub v4   │              │
│  ┌───────────┐       └───────────┘       │  (brief)  │              │
│  │ Arbitrage │──────▶                    └───────────┘              │
│  └───────────┘                                                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

*Dernière mise à jour : 02/01/2026*
