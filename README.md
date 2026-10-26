# CryptoYa Omnichaín Arbitrage Dashboard

**Elite arbitrage scanner powered by CryptoYa API.**

Detects CEX/P2P spreads in LatAm markets (ARS focus) in real-time, calculates net profit after fees, and provides omnichaín settlement concepts (LayerZero / CCTP ready).

## Features
- Live quotes from 30+ exchanges via CryptoYa
- Arbitrage opportunity ranking (buy low / sell high)
- Fee-aware profit calculation
- Dark-mode dashboard with charts
- Ready for AI layer (opportunity scoring)
- Production-grade Next.js 15 + TypeScript

## Setup
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy
Push to GitHub and import to Vercel. Zero config needed.

## Architecture
- `/lib/criptoya.ts` → typed CryptoYa client
- `/app/api/arbitrage` → opportunity scanner
- Frontend: App Router + Tailwind + Recharts

Built by Elcryptoboy — omnichaín architect.