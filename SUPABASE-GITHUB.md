# Connecter Niche Founder (GitHub) à Supabase

Ce guide relie le dépôt GitHub au projet Supabase pour que les migrations SQL se déploient automatiquement.

## ⚠️ Projet 100 % séparé de Slidy

**Niche Founder** et **Slidy** sont deux produits distincts. Ne réutilise **jamais** :

| | Niche Founder ✅ | Slidy ❌ (ne pas utiliser) |
|--|----------------|---------------------------|
| **Dossier local** | `saas2/` | autre dossier |
| **Repo GitHub** | `niche-signal` (nouveau repo) | repo Slidy existant |
| **Projet Supabase** | `niche-signal` (nouveau projet) | projet Supabase Slidy |
| **Port local** | `3002` | `3000` / `3001` |
| **`.env.local`** | clés du projet `niche-signal` | clés Slidy |

Avant de lier quoi que ce soit, vérifie :
- L'URL Supabase contient bien le projet **niche-signal**, pas Slidy
- Le remote Git pointe vers `github.com/.../niche-signal`, pas le repo Slidy
- Dans Vercel, crée un **nouveau projet** importé depuis `niche-signal`

## 1. Créer un **nouveau** projet Supabase

1. Va sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** (pas « ouvrir Slidy ») → nomme-le **`niche-signal`**
3. Choisis une région (ex. `West EU`)
4. Note le **mot de passe** de la base de données

## 2. Récupérer les clés API

Dans **Project Settings → API** :

| Variable | Où la trouver |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** uniquement : `https://xxx.supabase.co` — **sans** `/rest/v1` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Publishable key** (ex-anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (secret, jamais côté client) |

Copie `.env.local.example` vers `.env.local` et remplis les valeurs :

```bash
cp .env.local.example .env.local
```

## 3. Appliquer les migrations (première fois)

### Option A — SQL Editor (rapide)

> ⚠️ **Ne colle pas le nom du fichier** (`supabase/migrations/...`) dans SQL Editor — ça provoque l'erreur `syntax error at or near "supabase"`.  
> Tu dois **ouvrir le fichier dans Cursor**, tout sélectionner, copier, et coller le **contenu SQL** dans Supabase.

**Méthode la plus simple** : ouvre `supabase/setup-all.sql` dans Cursor → Cmd+A → Cmd+C → colle dans SQL Editor → **Run**.

Ou en 2 étapes, copie le contenu (pas le chemin) de :
1. `supabase/migrations/20260610000000_initial_schema.sql` → Run
2. `supabase/migrations/20260610100000_profiles.sql` → Run

### Option B — CLI locale

```bash
# Installer la CLI
brew install supabase/tap/supabase

# Se connecter
supabase login

# Lier le projet (remplace PROJECT_REF par l'ID dans l'URL du dashboard)
supabase link --project-ref PROJECT_REF

# Pousser les migrations
supabase db push
```

Le **PROJECT_REF** est la chaîne dans l'URL :  
`https://supabase.com/dashboard/project/abcdefghijklmnop`

## 4. Créer un **nouveau** repo GitHub et pousser le code

Sur GitHub : **New repository** → nom **`niche-signal`** (ne pas pousser dans le repo Slidy).

```bash
cd /Users/gaspardnepple/saas2

# Vérifie qu'aucun remote Slidy n'est configuré
git remote -v

# Si un mauvais remote existe : git remote remove origin

git add .
git commit -m "feat: connect Supabase + migrations"
git remote add origin https://github.com/TON_USER/niche-signal.git
git push -u origin main
```

## 5. Lier GitHub à Supabase (intégration dashboard)

1. Dashboard Supabase → projet **`niche-signal`** uniquement → **Project Settings**
2. **Integrations** → **GitHub** → **Authorize GitHub**
3. Sélectionne **uniquement** le dépôt `niche-signal` — **pas** le repo Slidy
4. Active **Automatic branching** si tu veux des previews par branche (optionnel)

## 6. Secrets GitHub (migrations automatiques)

Le workflow `.github/workflows/supabase-migrations.yml` applique les migrations à chaque push sur `main`.

Dans **GitHub → ton repo → Settings → Secrets and variables → Actions**, ajoute :

| Secret | Valeur |
|--------|--------|
| `SUPABASE_ACCESS_TOKEN` | [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) → Generate new token |
| `SUPABASE_PROJECT_REF` | ID du projet (ex. `abcdefghijklmnop`) |

À chaque modification dans `supabase/migrations/`, GitHub poussera le schéma vers Supabase.

## 7. Déploiement Vercel (recommandé)

1. Sur [vercel.com](https://vercel.com) → **Add New Project** → importe **`niche-signal`** (nouveau projet Vercel, pas celui de Slidy)
2. **Settings → Environment Variables** — clés du projet Supabase **`niche-signal`** + `NEXT_PUBLIC_STRIPE_CHECKOUT_URL`
3. Si tu lies Supabase dans Vercel, choisis le projet **`niche-signal`**, pas Slidy

## 8. Configuration Auth (Supabase Dashboard)

**Authentication → URL Configuration** :

| Champ | Valeur |
|-------|--------|
| **Site URL** | `http://localhost:3002` |
| **Redirect URLs** | `http://localhost:3002/**` |

> Niche Founder tourne sur le port **3002**, pas 3000 (Slidy).

## 9. Vérifier que tout fonctionne

```bash
npm run dev
```

- Ouvre `http://localhost:3002/en`
- Clique **Login** → crée un compte
- Vérifie dans Supabase **Authentication → Users** qu'un user apparaît
- Vérifie dans **Table Editor → profiles** que le profil `free` est créé

## Structure Supabase du projet

```
supabase/
├── config.toml
└── migrations/
    ├── 20260610000000_initial_schema.sql   # reports, pain_points, competitors
    └── 20260610100000_profiles.sql         # profiles + trigger auth
```

## Dépannage

| Problème | Solution |
|----------|----------|
| `Supabase non configuré` | Vérifie `.env.local` et redémarre `npm run dev` |
| Migrations GitHub échouent | Vérifie les secrets `SUPABASE_*` dans GitHub Actions |
| Pas de profil après signup | Ré-exécute `20260610100000_profiles.sql` dans SQL Editor |
