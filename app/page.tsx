'use client'

import { useState } from 'react'
import CryptoTracker from './components/CryptoTracker'
import NFTTracker from './components/NFTTracker'
import DLMMPools from './components/DLMMPools'
import PumpDumpTracker from './components/PumpDumpTracker'
import MemecoinScanner from './components/MemecoinScanner'
import Sidebar from './components/Sidebar'

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [activeSection, setActiveSection] = useState<'home' | 'crypto' | 'pump' | 'dump' | 'nft' | 'dlmm'>('home')

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <div className="min-h-screen bg-primary text-white">
        <Sidebar 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          activeSection={activeSection}
          onNavigate={setActiveSection as any}
        />
        
        <main className="md:ml-72 px-6 py-8">
          {/* Landing Page / Home */}
          {activeSection === 'home' && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-6xl md:text-8xl font-bold mb-8">
                  <span className="text-gradient">Sora</span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-white/80 mb-6 font-light">
                  Crypto & NFT Analytics Platform
                </p>
                
                <p className="text-lg md:text-xl text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Platform analitik real-time untuk tracking cryptocurrency, NFT collections, 
                  dan Meteora DLMM pools. Dapatkan insight lengkap dengan signal detection, 
                  price charts, dan market analytics dalam satu dashboard.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                  <div className="crypto-card text-left">
                    <h3 className="text-xl font-bold mb-3">Real-Time Tracking</h3>
                    <p className="text-white/60">
                      Monitor harga 20+ cryptocurrencies dengan 7-day charts dan 
                      auto-refresh setiap 30 detik
                    </p>
                  </div>

                  <div className="crypto-card text-left">
                    <h3 className="text-xl font-bold mb-3">Pump & Dump Detection</h3>
                    <p className="text-white/60">
                      AI-powered signal detection untuk identifikasi NFT yang pump atau dump 
                      dengan accuracy tinggi
                    </p>
                  </div>

                  <div className="crypto-card text-left">
                    <h3 className="text-xl font-bold mb-3">Multi-Network Support</h3>
                    <p className="text-white/60">
                      Coverage lengkap untuk Bitcoin, Ethereum, Solana, Polygon, Arbitrum, 
                      dan 15+ networks lainnya
                    </p>
                  </div>

                  <div className="crypto-card text-left">
                    <h3 className="text-xl font-bold mb-3">DLMM Analytics</h3>
                    <p className="text-white/60">
                      Tracking Meteora DLMM pools dengan APY calculation, volume stats, 
                      dan liquidity monitoring
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setActiveSection('crypto')}
                    className="px-8 py-4 bg-accent hover:bg-accent/80 rounded-lg font-medium transition-all hover:scale-105"
                  >
                    Explore Crypto Prices
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('pump')}
                    className="px-8 py-4 glass rounded-lg font-medium hover:bg-white/10 transition-all hover:scale-105 border border-accent-green/30"
                  >
                    📈 Pump Tracker
                  </button>
                  
                  <button
                    onClick={() => setActiveSection('dump')}
                    className="px-8 py-4 glass rounded-lg font-medium hover:bg-white/10 transition-all hover:scale-105 border border-accent-red/30"
                  >
                    📉 Dump Tracker
                  </button>
                </div>

                <div className="mt-16 text-white/40 text-sm">
                  <p>Powered by CoinGecko, Magic Eden, Helius & Meteora APIs</p>
                </div>
              </div>
            </div>
          )}

          {/* Crypto Prices Section */}
          {activeSection === 'crypto' && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Crypto Prices</h2>
                  <p className="text-white/60">Real-time cryptocurrency prices with 7-day charts</p>
                </div>
                <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                  Refresh
                </button>
              </div>
              <CryptoTracker />
              
              {/* Memecoin Scanner */}
              <MemecoinScanner />
            </section>
          )}

          {/* Pump Tracker Section */}
          {activeSection === 'pump' && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2 text-accent-green">📈 Pump Tracker</h2>
                  <p className="text-white/60">
                    Real-time detection untuk NFT yang sedang pump (price surge & volume spike)
                  </p>
                </div>
                <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm border border-accent-green/30">
                  Set Alert
                </button>
              </div>
              <PumpDumpTracker filterMode="pump" />
            </section>
          )}

          {/* Dump Tracker Section */}
          {activeSection === 'dump' && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2 text-accent-red">📉 Dump Tracker</h2>
                  <p className="text-white/60">
                    Real-time detection untuk NFT yang sedang dump (price drop & panic sell)
                  </p>
                </div>
                <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm border border-accent-red/30">
                  Set Alert
                </button>
              </div>
              <PumpDumpTracker filterMode="dump" />
            </section>
          )}

          {/* NFT Collections Section */}
          {activeSection === 'nft' && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">NFT Collections</h2>
                  <p className="text-white/60">Top Solana NFT collections from Magic Eden</p>
                </div>
                <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                  Trending
                </button>
              </div>
              <NFTTracker />
            </section>
          )}

          {/* DLMM Pools Section */}
          {activeSection === 'dlmm' && (
            <section className="animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-4xl font-bold mb-2">Meteora DLMM Pools</h2>
                  <p className="text-white/60">Dynamic liquidity market maker pools dengan APY tracking</p>
                </div>
                <button className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm">
                  Top APY
                </button>
              </div>
              <DLMMPools />
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
