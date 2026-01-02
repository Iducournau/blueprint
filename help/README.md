# COCKPIT — Documentation Projet

> Ce dossier contient toute la documentation pour continuer le développement de COCKPIT sur plusieurs conversations.

---

## 📁 Fichiers

| Fichier | Contenu | Quand le consulter |
|---------|---------|-------------------|
| `COCKPIT-SPECS.md` | Vision, architecture info, BDD, parcours | Pour comprendre le projet |
| `COCKPIT-ARBO.md` | Structure des fichiers Next.js | Pour savoir où coder |
| `COCKPIT-GLOSSARY.md` | Définitions des termes | Si doute sur un terme |
| `COCKPIT-DECISIONS.md` | Contraintes et choix techniques | Pour comprendre les "pourquoi" |
| `COCKPIT-CHANGELOG.md` | Historique et roadmap | Pour voir l'avancement |

---

## 🔄 Comment continuer sur une nouvelle conversation

### Option 1 : Partager les fichiers
1. Upload les fichiers `.md` pertinents au début de la conversation
2. Dis "Voici la doc COCKPIT, on continue le développement"

### Option 2 : Résumé rapide
Copie-colle ce prompt :

```
Je continue le développement de COCKPIT, un outil de pilotage de projets.

Stack : Next.js 15 + Supabase + shadcn/ui + Tailwind
Déployé sur : Vercel

État actuel (v0.2.0) :
- ✅ Auth fonctionnelle
- ✅ CRUD projets
- ✅ Page projet avec onglets Objectifs/Architecture
- ✅ Blocs éditables via drawer
- 🔄 En cours : support des types de projet + modules

Prochaine étape : [ce que tu veux faire]
```

### Option 3 : Mettre à jour CLAUDE.md
Ajoute ces fichiers dans le dossier de ton projet pour que Claude y ait accès automatiquement.

---

## ✏️ Comment mettre à jour la doc

### Après chaque session de dev :
1. Met à jour `COCKPIT-CHANGELOG.md` avec ce qui a été fait
2. Met à jour `COCKPIT-ARBO.md` si nouveaux fichiers
3. Met à jour `COCKPIT-DECISIONS.md` si nouvelles décisions

### Après changement de specs :
1. Met à jour `COCKPIT-SPECS.md`
2. Met à jour `COCKPIT-GLOSSARY.md` si nouveaux termes

---

## 🚀 Commandes utiles

```bash
# Lancer en local
cd cockpit-speedtest
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

- **Repo GitHub** : https://github.com/Iducournau/cockpit-speedtest
- **App déployée** : https://cockpit-speedtest.vercel.app
- **Supabase** : https://supabase.com/dashboard
- **Vercel** : https://vercel.com/dashboard
