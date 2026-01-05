# 🚀 Sprint 1 — Installation

## Prérequis

Tu dois avoir Blueprint déjà installé avec :
- Next.js 15
- Supabase configuré
- shadcn/ui installé

---

## Étape 1 : Base de données Supabase

1. Va dans ton projet Supabase → **SQL Editor**
2. Copie-colle le contenu de `supabase/001_create_briefs_tables.sql`
3. Clique sur **Run**

**Résultat attendu** : Tables `briefs` et `brief_proposals` créées ✅

---

## Étape 2 : Composants shadcn/ui supplémentaires

Vérifie que tu as tous ces composants. Si non, installe-les :

```bash
# Composants potentiellement manquants
npx shadcn@latest add progress
npx shadcn@latest add radio-group
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add select
npx shadcn@latest add alert-dialog
npx shadcn@latest add label
```

---

## Étape 3 : Dépendance date-fns

```bash
npm install date-fns
```

---

## Étape 4 : Copier les fichiers

### Types
Copie le contenu de `lib/brief-types.ts` dans ton fichier `lib/types.ts` existant (ou crée-le).

### Composants partagés
```
components/shared/StatusBadge.tsx  → Créer le fichier
```

### Composants Briefs
```
components/briefs/BriefCard.tsx    → Créer le fichier
components/briefs/BriefForm.tsx    → Créer le fichier
```

### Pages
```
app/briefs/page.tsx                → Créer le dossier + fichier
app/briefs/new/page.tsx            → Créer le dossier + fichier
app/briefs/[id]/page.tsx           → Créer le dossier + fichier
```

---

## Étape 5 : Tester

1. Lance le serveur : `npm run dev`
2. Va sur `http://localhost:3000/briefs`
3. Crée un brief via "Nouveau brief"
4. Vérifie que le brief apparaît dans la liste
5. Clique dessus pour voir le détail

---

## Structure finale

```
app/
├── briefs/
│   ├── page.tsx              ← Liste des briefs
│   ├── new/
│   │   └── page.tsx          ← Formulaire conversationnel
│   └── [id]/
│       └── page.tsx          ← Détail brief
│
components/
├── briefs/
│   ├── BriefCard.tsx
│   └── BriefForm.tsx
└── shared/
    └── StatusBadge.tsx
```

---

## Checklist Sprint 1 — Semaine 1-2

### ✅ Jour 1-2 : Setup BDD
- [x] Table `briefs` créée
- [x] Table `brief_proposals` créée
- [x] RLS configuré
- [x] Types TypeScript

### ✅ Jour 3-4 : Liste des briefs
- [x] Page `/briefs`
- [x] Composant `BriefCard`
- [x] Filtres par statut
- [x] Bouton "Nouveau brief"

### ✅ Jour 5 : Navigation
- [ ] Mettre à jour le header pour ajouter "Briefs"

### ✅ Jour 6-8 : Formulaire conversationnel
- [x] Page `/briefs/new`
- [x] Composant `BriefForm` (10 écrans)
- [x] Navigation entre écrans
- [x] Sauvegarde en BDD

### ✅ Jour 9-10 : Page brief
- [x] Page `/briefs/[id]`
- [x] Affichage des infos
- [x] Changement de statut
- [x] Suppression avec confirmation
- [ ] Bouton "Modifier" (drawer d'édition)

---

## Prochaine étape

Une fois tout validé, on passe au **Sprint 2** :
- Propositions de solutions
- Arbitrage
- Conversion brief → projet
