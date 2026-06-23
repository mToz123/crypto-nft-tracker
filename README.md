# Crypto & NFT Tracker

Real-time tracking for Solana ecosystem: Crypto prices, NFT collections, and Meteora DLMM pools.

## 🎯 Features

- **Crypto Price Tracker** - Real-time prices for BTC, ETH, SOL, and more
- **NFT Collections** - Floor prices, volume, and stats from Magic Eden
- **Meteora DLMM Pools** - Liquidity pools, APY calculations, and fee tracking
- **Real-time Updates** - Auto-refresh every 30-60 seconds
- **Dark Theme** - Crypto-style UI with glassmorphism effects

## 🔑 API Integrations

- **CoinGecko API** - Crypto market data (no key needed)
- **Magic Eden API** - Solana NFT collection stats
- **Meteora DLMM API** - Dynamic liquidity pool data
- **Helius RPC** - Solana blockchain data (optional)

## 🛠️ Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- SWR (data fetching)
- Recharts (charts)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 API Endpoints Used

**CoinGecko:**
- `https://api.coingecko.com/api/v3/coins/markets`

**Magic Eden:**
- `https://api-mainnet.magiceden.dev/v2/collections/{symbol}/stats`

**Meteora DLMM:**
- `https://dlmm-api.meteora.ag/pair/all`

## 🎨 Features

- Real-time price updates (30s refresh)
- NFT floor price tracking
- DLMM pool APY calculation
- Volume & liquidity stats
- Responsive design
- Loading skeletons
- Error handling

## 📄 License

MIT © 2026

---

Built with ❤️ by Sora
