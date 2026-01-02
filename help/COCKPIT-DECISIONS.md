# COCKPIT — Contraintes & Décisions

> Journal des contraintes projet et décisions techniques

---

## 🚧 Contraintes

### Budget
| Contrainte | Valeur | Impact |
|------------|--------|--------|
| Budget MVP | 0€ | Free tiers uniquement |
| Supabase | 2 projets max (free) | Partager entre projets |
| Vercel | Free tier | Suffisant pour usage interne |

### Utilisateurs
| Contrainte | Valeur | Impact |
|------------|--------|--------|
| Utilisateur principal | Product Builder (Isa) | Éditeur unique pour V1 |
| Lecteurs | CMO, CPO | Lecture seule pour V1 |
| Pas d'inscription publique | Comptes créés manuellement | Sécurité |

### Technique
| Contrainte | Valeur | Impact |
|------------|--------|--------|
| Device principal | Desktop | Mobile = lecture seule |
| Navigateurs | Modernes (Chrome, Safari, Firefox) | Pas d'IE |
| Offline | Non supporté | Connexion requise |

---

## ✅ Décisions prises

### 2 janvier 2026 — Stack technique

| Décision | Choix | Raison |
|----------|-------|--------|
| Frontend | Next.js 15 + App Router | Contrôle total, scalable |
| UI | shadcn/ui + Tailwind | Flexible, moderne |
| Backend | Supabase | Auth + BDD gratuit |
| Hébergement | Vercel | Intégration native Next.js |
| Icons | Lucide React | Léger, complet |

**Alternatives rejetées :**
- WeWeb : Plugin auth introuvable, frustrant
- Lovable : Prometteur mais crédits limités
- Bubble : Réservé pour formation, watermark en free

### 2 janvier 2026 — Structure projet

| Décision | Choix | Raison |
|----------|-------|--------|
| Hiérarchie | Projet → (Module) → Onglets → Blocs | Flexibilité |
| Types projet | Liste fixe (5 types) | Simplicité V1 |
| Modules | Optionnels par projet | S'adapte aux besoins |
| Onglets | 6 onglets standards | Couvre tous les aspects |

### 2 janvier 2026 — Auth

| Décision | Choix | Raison |
|----------|-------|--------|
| Méthode | Email + Password | Simple |
| Inscription | Désactivée (comptes manuels) | Sécurité usage interne |
| Mot de passe oublié | À implémenter | UX standard |

### 2 janvier 2026 — UX

| Décision | Choix | Raison |
|----------|-------|--------|
| Édition | Drawer latéral | Pattern Notion-like |
| Navigation | Tabs pour onglets | Familier |
| Logo | "Cockpit." en DM Serif Display | Minimaliste |

---

## 🤔 Décisions en attente

| Question | Options | À décider |
|----------|---------|-----------|
| Markdown dans blocs ? | Oui / Non / Optionnel | V1 ou V2 |
| Dark mode | Toggle / System pref / Non | V1 |
| Export projet | PDF / Markdown / Non | V2 |
| Notifications | Email / In-app / Non | V3 |

---

## 🔮 Hypothèses à valider

| Hypothèse | Comment valider |
|-----------|-----------------|
| Les 6 onglets couvrent tous les besoins | Usage réel sur premiers projets |
| La structure avec modules est utile | Tester avec Hub |
| L'édition par bloc est suffisante | Feedback utilisateurs |
