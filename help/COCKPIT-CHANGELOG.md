# COCKPIT — Changelog

> Historique des modifications du projet

---

## [0.2.0] - 2 janvier 2026 (en cours)

### 🆕 Ajouté
- Champ `type` sur les projets (5 types disponibles)
- Champ `has_modules` sur les projets
- Table `modules` dans Supabase
- Formulaire de création avec sélection type + toggle modules

### 🔄 Modifié
- Page création projet avec nouveau formulaire

### 📋 À faire
- [ ] Adapter page projet pour afficher modules si `has_modules = true`
- [ ] Créer page module `/project/[id]/module/[moduleId]`
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
- Logo "Cockpit." en DM Serif Display
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
- [ ] Types de projet
- [ ] Support modules
- [ ] Tous les onglets (Rôles, Fonctionnalités, Roadmap, Notice)
- [ ] Mot de passe oublié
- [ ] Dark mode

### V2 — Édition avancée
- [ ] Markdown dans les blocs
- [ ] Créer/supprimer/réorganiser des blocs
- [ ] Créer/renommer/supprimer des onglets personnalisés

### V3 — Collaboration
- [ ] Rôles (Owner, Editor, Viewer)
- [ ] Commentaires sur les blocs
- [ ] Système de validation (✅/❌/💬)

### V4 — Suivi
- [ ] Dashboard de suivi projet
- [ ] Historique des modifications

### V5 — Automatisation
- [ ] Intégrations (Notion, Slack...)
- [ ] Notifications
- [ ] Agents IA
