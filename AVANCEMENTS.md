# Niche Founder — Suivi des avancements

> Dernière mise à jour : 10 juin 2026  
> Projet : `/Users/gaspardnepple/saas2`  
> URL locale : [http://localhost:3002](http://localhost:3002)  
> Port **3002** (Slidy tourne sur 3000/3001)

---

## Résumé du projet

**Niche Founder** est un SaaS d'analyse de marché. L'utilisateur recherche une niche SaaS (ex. « CRM pour freelancers ») et obtient un rapport avec pain points, concurrents, score d'opportunité et verdict.

**Stack :** Next.js 14 · TypeScript · Tailwind CSS · Supabase · App Router

---

## ✅ Ce qui est fait

### 1. Setup initial
- [x] Projet Next.js 14 créé dans `saas2` (séparé de Slidy)
- [x] Tailwind CSS configuré
- [x] Supabase installé (`@supabase/supabase-js`, `@supabase/ssr`)
- [x] Port dev fixé sur **3002** pour éviter les conflits avec Slidy
- [x] Police **Inter** (Google Fonts)
- [x] Thème : fond off-white `#f8f9fc`, texte navy, accent violet `#7F77DD`

### 2. Landing page complète
- [x] **Navbar** sticky — logo, Pricing, Sign in, Start free
- [x] **Hero** — headline, subheadline, barre de recherche, CTA, 3 chips cliquables, social proof
- [x] **How it works** — 3 étapes avec icônes
- [x] **Report preview** — mockup du rapport + blur + CTA « Sign up free »
- [x] **Testimonials** — 3 témoignages avec avatars initiales
- [x] **Pricing** — plans Free (€0) et Pro (€29/mois, mis en avant)
- [x] **Footer** — logo, tagline, liens, « Built by a solo founder »
- [x] Scroll fluide entre sections
- [x] Design responsive mobile + desktop

### 3. Authentification
- [x] Modale **Sign in** cliquable avec onglets **Se connecter** / **S'inscrire**
- [x] Formulaire email + mot de passe
- [x] Intégration Supabase Auth (signIn, signUp, signOut)
- [x] Contexte React `AuthContext` + `AuthProvider`
- [x] Table `profiles` (plan `free` ou `pro`) avec trigger auto à l'inscription

### 4. Contrôle d'accès aux rapports
- [x] Sans connexion **ou** sans plan **Pro** → recherche redirige vers **#pricing**
- [x] Message sous la barre de recherche pour les utilisateurs non-Pro
- [x] API `/api/analyze` protégée (erreur 403 si pas Pro)
- [x] Vérification côté client (Hero) et serveur (API)

### 5. API & données
- [x] `POST /api/analyze` — génère un rapport mock et le sauvegarde en base
- [x] `GET /api/reports/[id]` — récupère un rapport sauvegardé
- [x] Composant `ReportCard` — métriques, pain points (barres), concurrents, verdict
- [x] Types TypeScript (`AnalyzeReport`, `Competitor`, `PainPoint`, `Profile`)

### 6. Base de données Supabase
- [x] Migration `reports` — rapports principaux
- [x] Migration `pain_points` — pain points liés aux rapports
- [x] Migration `competitors` — concurrents liés aux rapports
- [x] Migration `profiles` — profils utilisateurs avec plan
- [x] RLS activé sur toutes les tables
- [x] Fonctions `saveReport()` et `getReportById()` dans `src/lib/db/reports.ts`

### 7. Design & branding
- [x] Rebrand : NicheRadar → NichePulse → NicheSignal → NicheScope → **Niche Founder**
- [x] Logo coloré (cible + pulse, dégradés bleu/violet)
- [x] Style premium : ombres, glassmorphism navbar, cartes avec hover
- [x] Palette `signal` (violet #7F77DD) + `navy` dans Tailwind

---

## 📁 Structure du projet

```
saas2/
├── AVANCEMENTS.md              ← ce fichier
├── .env.local.example
├── package.json
├── supabase/
│   └── migrations/
│       ├── 20260610000000_initial_schema.sql   # reports, pain_points, competitors
│       └── 20260610100000_profiles.sql           # profiles + trigger auth
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── analyze/route.ts
    │   │   └── reports/[id]/route.ts
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── landing/
    │   │   ├── AuthModal.tsx
    │   │   ├── Footer.tsx
    │   │   ├── Hero.tsx
    │   │   ├── HowItWorks.tsx
    │   │   ├── Navbar.tsx
    │   │   ├── Pricing.tsx
    │   │   ├── ReportPreview.tsx
    │   │   └── Testimonials.tsx
    │   ├── providers/Providers.tsx
    │   ├── Logo.tsx
    │   └── ReportCard.tsx
    ├── contexts/AuthContext.tsx
    ├── lib/
    │   ├── auth/access.ts
    │   ├── auth/server.ts
    │   ├── db/reports.ts
    │   ├── navigation.ts
    │   └── supabase/ (client, server, admin)
    └── types/
        ├── auth.ts
        └── market-report.ts
```

---

## 🔧 Configuration requise

Copier `.env.local.example` vers `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_CHECKOUT_URL=https://buy.stripe.com/ton-lien
```

### Migrations Supabase à exécuter (SQL Editor)
1. `supabase/migrations/20260610000000_initial_schema.sql`
2. `supabase/migrations/20260610100000_profiles.sql`

### Passer un utilisateur en Pro (test manuel)
```sql
UPDATE profiles SET plan = 'pro' WHERE email = 'ton@email.com';
```

---

## 🚀 Commandes

```bash
cd /Users/gaspardnepple/saas2
npm run dev      # → http://localhost:3002
npm run build
npm run start
```

### En cas d'erreur `Cannot find module './682.js'`
```bash
rm -rf .next node_modules
npm install
npm run dev
```

---

## 📋 Règles métier actuelles

| Action | Non connecté | Connecté Free | Connecté Pro |
|--------|--------------|---------------|--------------|
| Voir la landing | ✅ | ✅ | ✅ |
| Rechercher / analyser | ❌ → Pricing | ❌ → Pricing | ✅ |
| Voir rapport complet | ❌ | ❌ | ✅ |

---

## ⏳ À faire (prochaines étapes)

### Priorité haute
- [ ] Brancher **Stripe Checkout** + webhook pour passer automatiquement en `plan = 'pro'`
- [ ] Remplacer les données **mock** de `/api/analyze` par une vraie analyse (IA, scraping, etc.)
- [ ] Page dashboard post-connexion (historique des rapports)
- [ ] Limiter le plan Free à 2 rapports/jour (actuellement Free = aucun accès)

### Priorité moyenne
- [ ] Confirmation email Supabase à l'inscription
- [ ] Export PDF des rapports (feature Pro)
- [ ] Page Blog
- [ ] Gestion des erreurs UX (toast, messages plus clairs)
- [ ] Tests e2e sur le flux auth → recherche → rapport

### Priorité basse
- [ ] Internationalisation FR/EN
- [ ] Analytics (Plausible, Posthog…)
- [ ] SEO (meta, OG images)
- [ ] Déploiement Vercel + variables d'env prod

---

## 📝 Historique des sessions

| Date | Avancement |
|------|------------|
| 09/06/2026 | Création initiale NicheRadar (Next.js 14, Tailwind, Supabase) |
| 09/06/2026 | Suppression + recréation dans saas2, port 3002 |
| 09/06/2026 | Composant ReportCard + API `/api/analyze` mock |
| 09/06/2026 | Base de données Supabase (reports, pain_points, competitors) |
| 10/06/2026 | Rebrand NichePulse → design blanc/bleu premium |
| 10/06/2026 | Landing page complète Niche Founder (toutes sections) |
| 10/06/2026 | Modale auth Se connecter / S'inscrire |
| 10/06/2026 | Gating : recherche → redirect Pricing si pas Pro |
| 10/06/2026 | Table profiles + AuthContext Supabase |

---

## 🔗 Fichiers clés par fonctionnalité

| Fonctionnalité | Fichier(s) |
|----------------|------------|
| Landing page | `src/app/page.tsx`, `src/components/landing/*` |
| Recherche + redirect Pricing | `src/components/landing/Hero.tsx` |
| Auth modale | `src/components/landing/AuthModal.tsx` |
| État utilisateur | `src/contexts/AuthContext.tsx` |
| Protection API | `src/app/api/analyze/route.ts`, `src/lib/auth/server.ts` |
| Sauvegarde rapports | `src/lib/db/reports.ts` |
| Affichage rapport | `src/components/ReportCard.tsx` |
| Plans & Stripe | `src/components/landing/Pricing.tsx` |

---

*Fichier maintenu pour suivre l'avancement du projet. Mettre à jour à chaque nouvelle fonctionnalité.*
