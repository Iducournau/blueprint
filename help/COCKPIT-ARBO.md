# COCKPIT — Arborescence Technique

> Structure des fichiers du projet Next.js

```
cockpit-speedtest/
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
│   ├── page.tsx                  # Liste des projets (/)
│   ├── globals.css               # Styles Tailwind
│   │
│   ├── login/
│   │   └── page.tsx              # Page connexion
│   │
│   ├── forgot-password/
│   │   └── page.tsx              # (À créer) Mot de passe oublié
│   │
│   └── project/
│       ├── new/
│       │   └── page.tsx          # Créer un projet
│       │
│       └── [id]/
│           ├── page.tsx          # Page projet (avec ou sans modules)
│           │
│           └── module/
│               └── [moduleId]/
│                   └── page.tsx  # (À créer) Page module
│
├── components/
│   └── ui/                       # Composants shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── tabs.tsx
│       ├── sheet.tsx
│       └── dialog.tsx
│
├── lib/
│   ├── supabase.ts               # Client Supabase
│   └── utils.ts                  # Utilitaires (cn, etc.)
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

### `app/page.tsx`
- Liste des projets de l'utilisateur
- Protection auth (redirige vers /login)
- CRUD projets

### `app/project/[id]/page.tsx`
- Affiche projet avec ou sans modules
- Onglets + blocs
- Drawer d'édition

---

## 🔜 Fichiers à créer

| Fichier | Priorité | Description |
|---------|----------|-------------|
| `app/forgot-password/page.tsx` | V1 | Récupération mot de passe |
| `app/project/[id]/module/[moduleId]/page.tsx` | V1 | Page module |
| `components/Header.tsx` | V1 | Header réutilisable |
| `components/ProjectCard.tsx` | V1 | Carte projet |
| `components/BlockCard.tsx` | V1 | Carte bloc |
| `components/ModuleCard.tsx` | V1 | Carte module |
| `lib/types.ts` | V1 | Types TypeScript |
