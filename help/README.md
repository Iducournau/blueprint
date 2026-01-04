# BLUEPRINT — Documentation Projet

> **"Dans Blueprint, un problème devient un brief, un brief devient un projet, un projet devient une solution. Et chaque solution continue de vivre."**

Ce dossier contient toute la documentation pour continuer le développement de Blueprint sur plusieurs conversations.

---

## 📁 Fichiers

| Fichier | Contenu | Quand le consulter |
|---------|---------|-------------------|
| `BLUEPRINT-VISION.md` | Pitch, architecture 3 espaces, workflow, priorisation | Pour comprendre la vision |
| `BLUEPRINT-SPECS.md` | Architecture info, BDD, parcours utilisateur | Pour les specs détaillées |
| `BLUEPRINT-ARBO.md` | Structure des fichiers Next.js | Pour savoir où coder |
| `BLUEPRINT-GLOSSARY.md` | Définitions des termes | Si doute sur un terme |
| `BLUEPRINT-DECISIONS.md` | Contraintes et choix techniques | Pour comprendre les "pourquoi" |
| `BLUEPRINT-CHANGELOG.md` | Historique et roadmap | Pour voir l'avancement |
| `CLAUDE.md` | Instructions pour Claude | Config de l'assistant |
| `LEARNING.md` | Carnet d'apprentissage | Notions apprises |

---

## 🏗️ Architecture Blueprint

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

## 🔄 Comment continuer sur une nouvelle conversation

### Option 1 : Partager les fichiers
1. Upload les fichiers `.md` pertinents au début de la conversation
2. Dis "Voici la doc Blueprint, on continue le développement"

### Option 2 : Résumé rapide
Copie-colle ce prompt :

```
Je continue le développement de Blueprint, un outil de pilotage de projets.

Pitch : "Dans Blueprint, un problème devient un brief, un brief devient un projet, un projet devient une solution. Et chaque solution continue de vivre."

Architecture : 3 espaces (Briefs → Projets → Solutions)
Stack : Next.js 15 + Supabase + shadcn/ui + Tailwind
Déployé sur : Vercel

État actuel (v0.2.0) :
- ✅ Auth fonctionnelle
- ✅ CRUD projets
- ✅ Page projet avec onglets
- ✅ Blocs éditables via drawer
- 🔄 En cours : Espace Briefs + Validation

Prochaine étape : [ce que tu veux faire]
```

### Option 3 : Utiliser CLAUDE.md
Ajoute ces fichiers dans le dossier de ton projet pour que Claude y ait accès automatiquement.

---

## ✏️ Comment mettre à jour la doc

### Après chaque session de dev :
1. Met à jour `BLUEPRINT-CHANGELOG.md` avec ce qui a été fait
2. Met à jour `BLUEPRINT-ARBO.md` si nouveaux fichiers
3. Met à jour `BLUEPRINT-DECISIONS.md` si nouvelles décisions

### Après changement de specs :
1. Met à jour `BLUEPRINT-SPECS.md`
2. Met à jour `BLUEPRINT-GLOSSARY.md` si nouveaux termes
3. Met à jour `BLUEPRINT-VISION.md` si évolution majeure

---

## 🚀 Commandes utiles

```bash
# Lancer en local
cd blueprint
npm run dev

# Déployer (auto via git push)
git add .
git commit -m "Description des changements"
git push

# Ajouter un composant shadcn
npx shadcn@latest add [composant]
```

---

## 🔗 Liens

- **Repo GitHub** : https://github.com/Iducournau/blueprint *(à renommer)*
- **App déployée** : https://blueprint.vercel.app *(à renommer)*
- **Supabase** : https://supabase.com/dashboard
- **Vercel** : https://vercel.com/dashboard
