# BLUEPRINT — Changelog

> Historique des modifications du projet

---

## [0.3.0] - 2 janvier 2026 (à venir)

### 🆕 Rebranding
- Renommage COCKPIT → **Blueprint**
- Nouveau pitch : "Dans Blueprint, un problème devient un brief, un brief devient un projet, un projet devient une solution. Et chaque solution continue de vivre."
- Architecture en 3 espaces : Briefs → Projets → Solutions

### 🆕 Espace Briefs (à développer)
- [ ] Formulaire de brief conversationnel (10 écrans)
- [ ] Liste des briefs avec filtres par statut
- [ ] Page brief avec propositions de solutions
- [ ] Conversion brief → projet
- [ ] Email notification à la soumission

### 🆕 Système de validation (à développer)
- [ ] Validation par bloc (✅/❌/💬)
- [ ] Signature + date sur chaque validation
- [ ] Bouton "Demander validation"
- [ ] Vue "En attente de validation"

---

## [0.2.0] - 2 janvier 2026

### 🆕 Ajouté
- Champ `type` sur les projets (5 types disponibles)
- Champ `has_modules` sur les projets
- Table `modules` dans Supabase
- Formulaire de création avec sélection type + toggle modules

### 🔄 Modifié
- Page création projet avec nouveau formulaire

### 📋 À faire
- [ ] Adapter page projet pour afficher modules si `has_modules = true`
- [ ] Créer page module `/projects/[id]/modules/[moduleId]`
- [ ] Créer/supprimer des modules

---

## [0.1.0] - 2 janvier 2026

### 🆕 Ajouté
- Setup Next.js 15 + Tailwind + shadcn/ui
- Client Supabase configuré
- Page Login avec auth email/password
- Page d'accueil avec liste des projets
- Page création de projet
- Page projet avec 2 onglets (Objectifs, Architecture)
- 4 blocs éditables (Problème, Solution, KPIs, Stack)
- Drawer d'édition pour les blocs
- Déploiement Vercel

### 🗄️ Base de données
- Table `projects` (id, name, description, user_id, created_at)
- Table `blocks` (id, project_id, tab, type, content, order, created_at)
- RLS activé avec policies pour utilisateurs authentifiés

### 🎨 Design
- Logo "Blueprint." en DM Serif Display
- Style minimaliste
- Composants shadcn/ui (button, card, input, tabs, sheet, dialog)

---

## [0.0.0] - 2 janvier 2026

### 🧪 Speed Dating
- Test WeWeb : abandonné (plugin auth introuvable)
- Test Lovable : prometteur mais crédits épuisés
- Test Next.js : ✅ choisi comme stack finale

---

## Roadmap

### V1 — MVP (en cours)
- [x] Auth (login/logout)
- [x] CRUD projets
- [x] Page projet avec onglets
- [x] Blocs éditables
- [x] Déploiement Vercel
- [x] Types de projet
- [ ] **Espace Briefs**
- [ ] Formulaire brief conversationnel
- [ ] Propositions de solutions
- [ ] Conversion brief → projet
- [ ] Validation par bloc
- [ ] Support modules
- [ ] Tous les onglets (Rôles, Fonctionnalités, Roadmap, Notice)
- [ ] Mot de passe oublié
- [ ] Dark mode

### V2 — Collaboration & Notifications
- [ ] **Espace Solutions**
- [ ] Email sur demande de validation
- [ ] Relance auto J+3, J+7
- [ ] Lien public lecture seule
- [ ] Validation de jalon
- [ ] Alerte projet zombie
- [ ] Rôles (Owner, Editor, Viewer)
- [ ] Commentaires sur les blocs

### V3 — Évolution & Intelligence
- [ ] Versioning des solutions (Hub v1, v2, v3...)
- [ ] Dashboard de suivi projet
- [ ] Historique des modifications
- [ ] Export PDF
- [ ] Suggestions IA

### V4 — Automatisation
- [ ] Intégrations (Notion, Slack...)
- [ ] Notifications avancées
- [ ] Agents IA
