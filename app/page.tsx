'use client'

import { useState } from 'react'
import CryptoTracker from './components/CryptoTracker'
import NFTTracker from './components/NFTTracker'
import DLMMPools from './components/DLMMPools'
import PumpDumpTracker from './components/PumpDumpTracker'
import Sidebar from './components/Sidebar'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div className="min-h-screen bg-primary text-white">
        <Sidebar isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />
        
        <main className="md:ml-64 px-6 py-8">
          {/* Header */}
          <div className="mb-12 mt-12 md:mt-0">
            <h1 className="text-5xl font-bold mb-4">
              <span className="text-gradient">Crypto & NFT Tracker</span>
            </h1>
            <p className="text-white/60 text-lg">
              Real-time tracking for Solana ecosystem: Prices, NFTs, and Meteora DLMM pools
            </p>
          </div>

          {/* Crypto Prices Section */}
          <section id="crypto" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Crypto Prices</h2>
              <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                View All
              </button>
            </div>
            <CryptoTracker />
          </section>

          {/* NFT Pump & Dump Tracker Section */}
          <section id="pump-dump" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">NFT Pump & Dump Tracker</h2>
                <p className="text-white/60 mt-2">
                  Real-time detection: Track price movements, volume spikes, and market signals
                </p>
              </div>
              <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                Alerts
              </button>
            </div>
            <PumpDumpTracker />
          </section>

          {/* NFT Collections Section */}
          <section id="nft" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">NFT Collections</h2>
              <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                Trending
              </button>
            </div>
            <NFTTracker />
          </section>

          {/* DLMM Pools Section */}
          <section id="dlmm" className="mb-12 scroll-mt-20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Meteora DLMM Pools</h2>
              <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                Top Pools
              </button>
            </div>
            <DLMMPools />
          </section>
        </main>

        {/* Footer */}
        <footer className="md:ml-64 border-t border-white/10 py-8 mt-20">
          <div className="px-6 text-center text-white/40">
            <p>Powered by CoinGecko, Magic Eden, Helius & Meteora APIs</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
