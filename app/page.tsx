'use client'

import CryptoTracker from './components/CryptoTracker'
import NFTTracker from './components/NFTTracker'
import DLMMPools from './components/DLMMPools'
import PumpDumpTracker from './components/PumpDumpTracker'
import Navigation from './components/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Crypto & NFT Tracker</span>
          </h1>
          <p className="text-white/60 text-lg">
            Real-time tracking for Solana ecosystem: Prices, NFTs, and Meteora DLMM pools
          </p>
        </div>

        {/* Crypto Prices Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-accent">📊</span>
            Crypto Prices
          </h2>
          <CryptoTracker />
        </section>

        {/* NFT Pump & Dump Tracker Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-gradient">🚀💀</span>
            NFT Pump & Dump Tracker
          </h2>
          <p className="text-white/60 mb-6">
            Real-time detection: Track price movements, volume spikes, and market signals
          </p>
          <PumpDumpTracker />
        </section>

        {/* NFT Collections Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-accent">🖼️</span>
            NFT Collections
          </h2>
          <NFTTracker />
        </section>

        {/* DLMM Pools Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <span className="text-accent">💧</span>
            Meteora DLMM Pools
          </h2>
          <DLMMPools />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/40">
          <p>Powered by CoinGecko, Magic Eden, Helius & Meteora APIs</p>
        </div>
      </footer>
    </div>
  )
}
