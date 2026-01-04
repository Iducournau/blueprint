# BLUEPRINT — Roadmap Sprints V1

> Planification détaillée pour atteindre la V1
> Durée estimée : 6 semaines (3 sprints de 2 semaines)

---

## Vue d'ensemble

| Sprint | Objectif | Durée |
|--------|----------|-------|
| **Sprint 1** | Espace Briefs | 2 semaines |
| **Sprint 2** | Validation + Conversion brief → projet | 2 semaines |
| **Sprint 3** | Notifications + Modules + Polish | 2 semaines |

---

# Sprint 1 — Espace Briefs

**Objectif** : Pouvoir soumettre un brief et le consulter
**Durée** : 2 semaines

---

## Semaine 1 — Base de données + Liste des briefs

### Jour 1-2 : Setup BDD

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 1.1 | Créer la table `briefs` | Dans Supabase, avec tous les champs | 30min | ☐ |
| 1.2 | Créer la table `brief_proposals` | Liée à briefs | 20min | ☐ |
| 1.3 | Configurer les policies RLS | Lecture/écriture pour users authentifiés | 30min | ☐ |
| 1.4 | Créer les types TypeScript | `Brief`, `BriefProposal`, statuts | 30min | ☐ |
| 1.5 | Tester avec des données manuelles | Insérer 2-3 briefs de test via Supabase | 15min | ☐ |

**Checkpoint** : Tu as des briefs de test visibles dans Supabase ✅

---

### Jour 3-4 : Liste des briefs

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 2.1 | Créer la page `/briefs` | Structure de base, fetch des briefs | 1h | ☐ |
| 2.2 | Créer le composant `BriefCard` | Affiche nom, statut, date, demandeur | 1h | ☐ |
| 2.3 | Afficher la liste des briefs | Map sur les briefs, afficher les cards | 30min | ☐ |
| 2.4 | Ajouter le badge de statut | Composant `StatusBadge` réutilisable | 45min | ☐ |
| 2.5 | Ajouter les filtres par statut | Tabs ou dropdown pour filtrer | 1h | ☐ |
| 2.6 | Ajouter le bouton "Nouveau brief" | Lien vers `/briefs/new` | 15min | ☐ |

**Checkpoint** : Tu vois la liste des briefs avec leurs statuts ✅

---

### Jour 5 : Navigation + Header

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 3.1 | Mettre à jour la navigation | Ajouter "Briefs" dans le header/menu | 30min | ☐ |
| 3.2 | Page d'accueil | Rediriger `/` vers `/briefs` ou dashboard | 30min | ☐ |
| 3.3 | Créer un layout partagé | Header avec nav Briefs / Projets | 1h | ☐ |

**Checkpoint** : Tu peux naviguer entre Briefs et Projets ✅

---

## Semaine 2 — Formulaire conversationnel + Page brief

### Jour 6-8 : Formulaire conversationnel

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 4.1 | Créer la page `/briefs/new` | Structure de base | 30min | ☐ |
| 4.2 | Créer le composant `BriefForm` | Gère l'état multi-étapes | 1h | ☐ |
| 4.3 | Écran 1 : Intro | Texte + bouton "C'est parti" | 30min | ☐ |
| 4.4 | Écran 2 : Nom du brief | Input texte | 30min | ☐ |
| 4.5 | Écran 3 : Problème | Textarea | 30min | ☐ |
| 4.6 | Écran 4 : Qui est impacté | Checkboxes | 45min | ☐ |
| 4.7 | Écran 5 : Impact | Textarea | 30min | ☐ |
| 4.8 | Écran 6 : Contraintes | Textarea (optionnel) | 30min | ☐ |
| 4.9 | Écran 7 : Idée en tête | Textarea (optionnel) | 30min | ☐ |
| 4.10 | Écran 8 : Urgence | Radio buttons | 30min | ☐ |
| 4.11 | Écran 9 : Contexte | Textarea (optionnel) | 30min | ☐ |
| 4.12 | Écran 10 : Récap | Afficher toutes les réponses | 1h | ☐ |
| 4.13 | Navigation entre écrans | Boutons Précédent / Suivant / Passer | 1h | ☐ |
| 4.14 | Sauvegarde en BDD | Insert dans Supabase au submit | 1h | ☐ |
| 4.15 | Redirection après création | Vers `/briefs/[id]` | 15min | ☐ |

**Checkpoint** : Tu peux créer un brief via le formulaire ✅

---

### Jour 9-10 : Page brief

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 5.1 | Créer la page `/briefs/[id]` | Fetch du brief par ID | 1h | ☐ |
| 5.2 | Afficher les infos du brief | Problème, impact, contraintes, etc. | 1h | ☐ |
| 5.3 | Afficher le statut | Badge + possibilité de changer | 45min | ☐ |
| 5.4 | Section "Propositions" | Zone vide pour l'instant (Sprint 2) | 30min | ☐ |
| 5.5 | Bouton "Modifier le brief" | Ouvrir un drawer ou page d'édition | 1h30 | ☐ |
| 5.6 | Bouton "Supprimer" | Avec confirmation | 45min | ☐ |

**Checkpoint** : Tu peux voir et modifier un brief ✅

---

## Definition of Done — Sprint 1

- [ ] Je peux voir la liste des briefs
- [ ] Je peux filtrer par statut
- [ ] Je peux créer un brief via le formulaire conversationnel
- [ ] Je peux voir le détail d'un brief
- [ ] Je peux modifier un brief
- [ ] Je peux supprimer un brief
- [ ] La navigation Briefs / Projets fonctionne

---

# Sprint 2 — Validation + Conversion

**Objectif** : Proposer des solutions sur un brief, valider, convertir en projet
**Durée** : 2 semaines

---

## Semaine 3 — Propositions de solutions

### Jour 1-2 : Ajouter des propositions

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 6.1 | Créer le composant `ProposalCard` | Affiche une proposition (nom, description, effort, pros/cons) | 1h | ☐ |
| 6.2 | Afficher les propositions sur la page brief | Liste des proposals liées au brief | 45min | ☐ |
| 6.3 | Bouton "Ajouter une proposition" | Ouvre un drawer/modal | 30min | ☐ |
| 6.4 | Formulaire de proposition | Champs : nom, description, format, effort, avantages, limites | 1h30 | ☐ |
| 6.5 | Sauvegarde en BDD | Insert dans `brief_proposals` | 45min | ☐ |
| 6.6 | Modifier une proposition | Drawer d'édition | 1h | ☐ |
| 6.7 | Supprimer une proposition | Avec confirmation | 30min | ☐ |

**Checkpoint** : Tu peux ajouter et gérer des propositions sur un brief ✅

---

### Jour 3-4 : Arbitrage + Conversion

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 7.1 | Bouton "Sélectionner cette solution" | Marque une proposition comme retenue | 45min | ☐ |
| 7.2 | Affichage visuel de la proposition retenue | Badge ou highlight | 30min | ☐ |
| 7.3 | Champ "Raison du choix" | Texte optionnel pour justifier | 30min | ☐ |
| 7.4 | Bouton "Convertir en projet" | Visible quand une proposition est sélectionnée | 30min | ☐ |
| 7.5 | Logique de conversion | Créer le projet avec les infos du brief | 1h30 | ☐ |
| 7.6 | Lien brief ↔ projet | `brief_id` sur le projet, lien retour | 45min | ☐ |
| 7.7 | Mise à jour statut brief | Passe en "Validé → Projet" | 30min | ☐ |
| 7.8 | Redirection vers le projet | Après conversion | 15min | ☐ |

**Checkpoint** : Tu peux arbitrer et convertir un brief en projet ✅

---

### Jour 5 : Statuts projet

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 8.1 | Ajouter le champ `status` sur projects | Migration BDD si nécessaire | 30min | ☐ |
| 8.2 | Afficher le statut sur la page projet | Badge avec couleur | 30min | ☐ |
| 8.3 | Changer le statut | Dropdown ou boutons | 45min | ☐ |
| 8.4 | Afficher le statut dans la liste des projets | Colonne ou badge | 30min | ☐ |
| 8.5 | Filtrer les projets par statut | Tabs ou dropdown | 45min | ☐ |

**Checkpoint** : Les projets ont des statuts visibles et filtrables ✅

---

## Semaine 4 — Validation par bloc

### Jour 6-7 : Table validations + UI

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 9.1 | Créer la table `validations` | Dans Supabase | 30min | ☐ |
| 9.2 | Configurer les policies RLS | Lecture/écriture users authentifiés | 20min | ☐ |
| 9.3 | Créer les types TypeScript | `Validation`, statuts | 20min | ☐ |
| 9.4 | Créer le composant `ValidationBadge` | Affiche l'état (⬜/🟡/✅/❌/💬) | 45min | ☐ |
| 9.5 | Ajouter le badge sur chaque bloc | Dans la page projet | 45min | ☐ |
| 9.6 | Afficher qui a validé + date | Sous le badge | 30min | ☐ |

**Checkpoint** : Chaque bloc affiche son état de validation ✅

---

### Jour 8-9 : Demander + Donner validation

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 10.1 | Bouton "Demander validation" sur chaque bloc | Icône ou bouton discret | 30min | ☐ |
| 10.2 | Modal/Drawer de demande | Choisir le validateur + message optionnel | 1h | ☐ |
| 10.3 | Créer la validation en BDD | Insert avec status "pending" | 30min | ☐ |
| 10.4 | Boutons de réponse | ✅ Valider / ❌ Refuser / 💬 Commenter | 1h | ☐ |
| 10.5 | Champ commentaire | Obligatoire si refus, optionnel sinon | 30min | ☐ |
| 10.6 | Mettre à jour la validation | Update en BDD | 30min | ☐ |
| 10.7 | Historique des validations | Afficher les validations passées sur un bloc | 1h | ☐ |

**Checkpoint** : Tu peux demander et donner des validations ✅

---

### Jour 10 : Vue "En attente"

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 11.1 | Créer la page ou section "En attente" | Liste des validations pending | 1h | ☐ |
| 11.2 | Afficher : projet, bloc, demandeur, date | Tableau ou liste | 45min | ☐ |
| 11.3 | Lien vers le bloc concerné | Clic → page projet au bon bloc | 30min | ☐ |
| 11.4 | Filtrer : "Ce que j'attends" vs "Ce qu'on attend de moi" | Tabs | 45min | ☐ |
| 11.5 | Compteur dans la nav | Badge avec nombre en attente | 30min | ☐ |

**Checkpoint** : Tu vois toutes les validations en attente ✅

---

## Definition of Done — Sprint 2

- [ ] Je peux ajouter des propositions de solutions sur un brief
- [ ] Je peux sélectionner une proposition et justifier le choix
- [ ] Je peux convertir un brief en projet
- [ ] Le projet garde le lien vers son brief d'origine
- [ ] Les projets ont des statuts (Cadrage → Live)
- [ ] Je peux demander une validation sur un bloc
- [ ] Je peux valider / refuser / commenter un bloc
- [ ] Je vois la liste des validations en attente

---

# Sprint 3 — Notifications + Modules + Polish

**Objectif** : Notifications email, support modules, finitions
**Durée** : 2 semaines

---

## Semaine 5 — Notifications + Modules

### Jour 1-2 : Notification email (brief soumis)

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 12.1 | Choisir le service email | Resend recommandé (gratuit jusqu'à 3000/mois) | 30min | ☐ |
| 12.2 | Créer un compte Resend | + récupérer API key | 15min | ☐ |
| 12.3 | Ajouter la variable d'env | `RESEND_API_KEY` dans `.env.local` et Vercel | 15min | ☐ |
| 12.4 | Créer une Edge Function Supabase | Ou API route Next.js | 1h | ☐ |
| 12.5 | Template email "Nouveau brief" | HTML simple avec infos du brief | 45min | ☐ |
| 12.6 | Déclencher l'envoi à la création | Si `created_by` ≠ Product Builder | 1h | ☐ |
| 12.7 | Tester l'envoi | Créer un brief en tant que CMO | 30min | ☐ |

**Checkpoint** : Tu reçois un email quand un brief est soumis ✅

---

### Jour 3-4 : Support modules

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 13.1 | Vérifier la table `modules` | Déjà créée ? Sinon la créer | 20min | ☐ |
| 13.2 | Page projet : afficher les modules si `has_modules` | Liste des modules au lieu des onglets | 1h | ☐ |
| 13.3 | Créer le composant `ModuleCard` | Nom, description, lien | 45min | ☐ |
| 13.4 | Bouton "Ajouter un module" | Modal avec nom + description | 1h | ☐ |
| 13.5 | Créer la page `/projects/[id]/modules/[moduleId]` | Structure similaire à page projet | 1h30 | ☐ |
| 13.6 | Onglets sur la page module | Objectifs, Rôles, Architecture, etc. | 1h | ☐ |
| 13.7 | Blocs éditables sur les modules | Réutiliser le système existant | 1h | ☐ |
| 13.8 | Navigation module → projet | Breadcrumb ou bouton retour | 30min | ☐ |

**Checkpoint** : Tu peux créer et gérer des modules sur un projet ✅

---

### Jour 5 : Onglets manquants

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 14.1 | Ajouter l'onglet "Rôles" | Blocs : Acteurs, Responsabilités | 30min | ☐ |
| 14.2 | Ajouter l'onglet "Fonctionnalités" | Bloc : Features | 30min | ☐ |
| 14.3 | Ajouter l'onglet "Roadmap" | Blocs : Jalons, Versions | 30min | ☐ |
| 14.4 | Ajouter l'onglet "Notice" | Bloc : Documentation | 30min | ☐ |
| 14.5 | Créer les blocs par défaut | À la création d'un projet | 45min | ☐ |

**Checkpoint** : Tous les onglets standards sont disponibles ✅

---

## Semaine 6 — Polish + Dark mode + Tests

### Jour 6-7 : Dark mode

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 15.1 | Installer `next-themes` | `npm install next-themes` | 10min | ☐ |
| 15.2 | Configurer le ThemeProvider | Dans `layout.tsx` | 30min | ☐ |
| 15.3 | Ajouter le toggle dans le header | Icône soleil/lune | 30min | ☐ |
| 15.4 | Vérifier les couleurs shadcn | Ajuster si nécessaire | 1h | ☐ |
| 15.5 | Tester toutes les pages | Vérifier le contraste | 30min | ☐ |

**Checkpoint** : Le dark mode fonctionne partout ✅

---

### Jour 8 : Page de connexion + Branding

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 16.1 | Mettre à jour le logo | "Blueprint." en DM Serif Display | 30min | ☐ |
| 16.2 | Ajouter le slogan sur la page login | "Un problème. Un plan. Une solution." | 15min | ☐ |
| 16.3 | Améliorer le design login | Centré, propre, accueillant | 1h | ☐ |
| 16.4 | Page mot de passe oublié | Formulaire + envoi email Supabase | 1h30 | ☐ |

**Checkpoint** : La page de connexion est belle et fonctionnelle ✅

---

### Jour 9-10 : Tests + Bugs + Polish

| # | Tâche | Détail | Temps | Fait |
|---|-------|--------|-------|------|
| 17.1 | Parcours complet brief → projet | Tester de A à Z | 1h | ☐ |
| 17.2 | Parcours validation | Demander, valider, refuser | 30min | ☐ |
| 17.3 | Parcours modules | Créer projet avec modules | 30min | ☐ |
| 17.4 | Tester sur mobile | Lecture seule, responsive | 30min | ☐ |
| 17.5 | Corriger les bugs trouvés | Liste à établir | 2-3h | ☐ |
| 17.6 | Optimiser les perfs | Lazy loading, cache | 1h | ☐ |
| 17.7 | Nettoyer le code | Supprimer console.log, code mort | 30min | ☐ |
| 17.8 | Mettre à jour la doc | CHANGELOG, README | 30min | ☐ |

**Checkpoint** : L'app est stable et prête à utiliser ✅

---

## Definition of Done — Sprint 3

- [ ] Je reçois un email quand un brief est soumis (si pas moi)
- [ ] Je peux créer et gérer des modules sur un projet
- [ ] Tous les onglets standards sont disponibles
- [ ] Le dark mode fonctionne
- [ ] La page de connexion a le branding Blueprint
- [ ] Le mot de passe oublié fonctionne
- [ ] L'app est testée et stable

---

# Definition of Done — V1 complète

## Espace Briefs
- [ ] Liste des briefs avec filtres
- [ ] Formulaire conversationnel (10 écrans)
- [ ] Page brief avec détail
- [ ] Propositions de solutions
- [ ] Arbitrage (sélection + justification)
- [ ] Conversion brief → projet
- [ ] Email notification à la soumission

## Espace Projets
- [ ] Liste des projets avec filtres par statut
- [ ] Page projet avec 6 onglets
- [ ] Blocs éditables via drawer
- [ ] Support modules (projets avec sous-parties)
- [ ] Statuts projet (Cadrage → Live)
- [ ] Lien vers brief d'origine

## Validation
- [ ] Validation par bloc (✅/❌/💬)
- [ ] Signature + date
- [ ] Demander validation à quelqu'un
- [ ] Vue "En attente de validation"

## UX
- [ ] Navigation Briefs / Projets
- [ ] Dark mode
- [ ] Page login avec branding
- [ ] Mot de passe oublié

---

# Après la V1...

## V2 — Collaboration & Notifications
- Espace Solutions (produits live)
- Email sur demande de validation
- Relance auto J+3, J+7
- Lien public lecture seule
- Rôles (Owner, Editor, Viewer)

## V3 — Évolution & Intelligence
- Versioning des solutions
- Dashboard de suivi
- Export PDF
- Suggestions IA

---

*Dernière mise à jour : 02/01/2026*
