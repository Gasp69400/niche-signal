# NicheSignal

Outil d'intelligence marché pour identifier des niches SaaS sous-exploitées.

> **Projet indépendant de Slidy** — repo GitHub, Supabase et déploiement séparés.

## Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Supabase (auth + PostgreSQL)
- i18n EN / FR

## Démarrage local

```bash
npm install
cp .env.local.example .env.local   # clés du projet Supabase "niche-signal" uniquement
npm run dev
```

→ [http://localhost:3002/en](http://localhost:3002/en) (port **3002**, Slidy utilise 3000/3001)

## Isolation Slidy / NicheSignal

| Ressource | NicheSignal | Slidy |
|-----------|-------------|-------|
| Repo GitHub | `niche-signal` | repo Slidy |
| Supabase | projet `niche-signal` | projet Slidy |
| Port dev | 3002 | 3000 / 3001 |

## Supabase + GitHub

Guide complet : **[SUPABASE-GITHUB.md](./SUPABASE-GITHUB.md)**

```bash
npm run db:link    # lier au projet Supabase niche-signal
npm run db:push    # pousser les migrations
```
