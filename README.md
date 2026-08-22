# ⚜️ WECRAFT — Mono-repo

> **Le wiki-streaming de nos aventures** : un espace unique qui recense partenaires, aventures et events, pensé façon Netflix — placé sous le signe du **phénix**, symbole d'élévation et d'ambition.

## 📂 Structure

```
WECRAFT/
├── apps/
│   ├── frontend/           Next.js 14 + TailwindCSS + TypeScript
│   ├── worker/             Cloudflare Workers API
│   └── admin/              Panneau admin (HTML/JS)
├── packages/               (Futur : types/utils partagés)
├── package.json            (Root workspace)
└── README.md
```

## 🚀 Démarrage rapide

### 1. Installation

```bash
cd WECRAFT
npm install
```

### 2. Variables d'environnement

**Frontend** (`apps/frontend/.env.local`):
```env
NEXT_PUBLIC_WORKER_URL=https://relink-auth.refugeemeraudien-direction.workers.dev
NEXT_PUBLIC_DISCORD_CLIENT_ID=YOUR_DISCORD_CLIENT_ID
NEXT_PUBLIC_DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback
```

### 3. Développement

**Frontend**:
```bash
cd apps/frontend
npm run dev
# http://localhost:3000
```

**Worker**:
```bash
cd apps/worker
wrangler dev
# http://localhost:8787
```

### 4. Déploiement

**Frontend** → Vercel (auto via GitHub)  
**Worker** → Cloudflare:
```bash
cd apps/worker
wrangler deploy --env production
```

## 🔑 Secrets Cloudflare

Configurer via `wrangler secret put <KEY> --env production` :
- `JWT_SECRET` — Signe les tokens Bearer
- `DISCORD_CLIENT_ID` — OAuth2 Discord
- `DISCORD_CLIENT_SECRET` — OAuth2 Discord
- `LINK_SECRET` — Partagé avec plugin MC
- `STATS_SECRET` — Protège /stats et /clans-sync
- `ADMIN_SECRET` — Protège /admin/*
- `PTERO_API_KEY` — API Pterodactyl
- `AIDE_WEBHOOK`, `PARTNER_WEBHOOK`, `TEAM_WEBHOOK` — Discord webhooks

---

**Maintainer** : @nkinglifetwx  
**Last updated** : 2026-08-22
