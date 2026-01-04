# BLUEPRINT — Arborescence Technique

> Structure des fichiers du projet Next.js

```
blueprint/
├── .env.local                    # Variables Supabase (NE PAS COMMIT)
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
│
├── app/
│   ├── layout.tsx                # Layout global + fonts
│   ├── page.tsx                  # Redirection vers /briefs ou /projects
│   ├── globals.css               # Styles Tailwind
│   │
│   ├── login/
│   │   └── page.tsx              # Page connexion
│   │
│   ├── forgot-password/
│   │   └── page.tsx              # (À créer) Mot de passe oublié
│   │
│   ├── briefs/
│   │   ├── page.tsx              # Liste des briefs
│   │   ├── new/
│   │   │   └── page.tsx          # Formulaire conversationnel
│   │   └── [id]/
│   │       └── page.tsx          # Page brief (détail + propositions)
│   │
│   └── projects/
│       ├── page.tsx              # Liste des projets
│       ├── new/
│       │   └── page.tsx          # Créer un projet (sans brief)
│       │
│       └── [id]/
│           ├── page.tsx          # Page projet (avec ou sans modules)
│           │
│           └── modules/
│               └── [moduleId]/
│                   └── page.tsx  # Page module
│
├── components/
│   ├── ui/                       # Composants shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── sheet.tsx
│   │   └── dialog.tsx
│   │
│   ├── briefs/                   # Composants Briefs
│   │   ├── BriefCard.tsx
│   │   ├── BriefForm.tsx         # Formulaire conversationnel
│   │   ├── BriefProposals.tsx    # Liste des propositions
│   │   └── ProposalCard.tsx
│   │
│   ├── projects/                 # Composants Projets
│   │   ├── ProjectCard.tsx
│   │   ├── BlockCard.tsx
│   │   ├── ModuleCard.tsx
│   │   └── ValidationBadge.tsx
│   │
│   └── shared/                   # Composants partagés
│       ├── Header.tsx
│       ├── StatusBadge.tsx
│       └── UserAvatar.tsx
│
├── lib/
│   ├── supabase.ts               # Client Supabase
│   ├── utils.ts                  # Utilitaires (cn, etc.)
│   └── types.ts                  # Types TypeScript
│
└── public/
    └── (assets statiques)
```

---

## 📁 Fichiers clés

### `app/layout.tsx`
- Fonts : Inter, DM Serif Display
- Metadata : title, description
- Structure HTML globale

### `lib/supabase.ts`
- Client Supabase configuré
- Utilise les variables d'environnement

### `app/briefs/page.tsx`
- Liste des briefs avec filtres par statut
- Protection auth

### `app/briefs/new/page.tsx`
- Formulaire conversationnel (tunnel 10 écrans)
- Envoi email au Product Builder (si CMO)

### `app/briefs/[id]/page.tsx`
- Détail du brief
- Ajout/édition des propositions
- Conversion brief → projet

### `app/projects/page.tsx`
- Liste des projets avec filtres
- Protection auth

### `app/projects/[id]/page.tsx`
- Affiche projet avec ou sans modules
- Onglets + blocs
- Drawer d'édition
- Validation par bloc

---

## 🔜 Fichiers à créer

| Fichier | Priorité | Description |
|---------|----------|-------------|
| `app/briefs/page.tsx` | V1 | Liste des briefs |
| `app/briefs/new/page.tsx` | V1 | Formulaire conversationnel |
| `app/briefs/[id]/page.tsx` | V1 | Page brief |
| `components/briefs/BriefForm.tsx` | V1 | Tunnel conversationnel |
| `components/briefs/BriefCard.tsx` | V1 | Carte brief |
| `components/briefs/ProposalCard.tsx` | V1 | Carte proposition |
| `components/projects/ValidationBadge.tsx` | V1 | Badge validation |
| `components/shared/StatusBadge.tsx` | V1 | Badge statut générique |
| `app/forgot-password/page.tsx` | V1 | Récupération mot de passe |
| `lib/types.ts` | V1 | Types TypeScript |
