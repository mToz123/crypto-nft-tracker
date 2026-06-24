'use client'

import { useState } from 'react'

interface SidebarProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  activeSection: string
  onNavigate: (section: 'home' | 'crypto' | 'pump' | 'dump' | 'nft' | 'dlmm') => void
}

export default function Sidebar({ isDarkMode, onToggleDarkMode, activeSection, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Home', desc: 'Dashboard' },
    { id: 'crypto', label: 'Crypto Prices', desc: 'Market tracking' },
    { id: 'pump', label: 'Pump Tracker', desc: 'Price surge alerts' },
    { id: 'dump', label: 'Dump Tracker', desc: 'Price drop alerts' },
    { id: 'nft', label: 'NFT Collections', desc: 'Solana NFTs' },
    { id: 'dlmm', label: 'DLMM Pools', desc: 'Liquidity pools' },
  ]

  const handleNavigate = (section: any) => {
    onNavigate(section)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 md:hidden glass p-3 rounded-xl hover:bg-white/10 transition-all backdrop-blur-xl"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 glass-heavy border-r border-white/10 z-40 transition-all duration-300 ease-out backdrop-blur-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Floating Bubbles Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="bubble bubble-1"></div>
          <div className="bubble bubble-2"></div>
          <div className="bubble bubble-3"></div>
          <div className="bubble bubble-4"></div>
          <div className="bubble bubble-5"></div>
        </div>

        <div className="relative flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl glass-card border border-white/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/50 to-accent-green/50 animate-pulse-slow"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Sora</h1>
                <p className="text-xs text-white/60">Crypto Analytics</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={item.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slideInLeft">
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`group relative w-full text-left flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 overflow-hidden ${
                      activeSection === item.id
                        ? 'glass-card-active border border-accent/30 shadow-lg shadow-accent/10'
                        : 'glass-card hover:glass-card-hover border border-white/5'
                    }`}
                  >
                    {/* Animated background on hover/active */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 transition-opacity duration-500 ${
                      activeSection === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="relative flex-1 min-w-0">
                      <div className={`font-semibold text-base ${
                        activeSection === item.id ? 'text-white' : 'text-white/90'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-1 ${
                        activeSection === item.id ? 'text-white/70' : 'text-white/50'
                      }`}>
                        {item.desc}
                      </div>
                    </div>

                    {/* Active indicator */}
                    {activeSection === item.id && (
                      <div className="relative w-2 h-2">
                        <div className="absolute inset-0 rounded-full bg-accent animate-ping"></div>
                        <div className="relative rounded-full w-2 h-2 bg-accent"></div>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className="mt-6 p-5 rounded-xl glass-card border border-white/10 animate-fadeIn">
              <div className="text-xs text-white/60 mb-3 font-medium">Quick Stats</div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Networks</span>
                  <span className="font-semibold text-white px-2 py-1 rounded-lg glass-pill">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Assets</span>
                  <span className="font-semibold text-white px-2 py-1 rounded-lg glass-pill">70+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Updates</span>
                  <span className="font-semibold text-accent-green px-2 py-1 rounded-lg glass-pill">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse mr-1.5"></span>
                    Real-time
                  </span>
                </div>
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-3 backdrop-blur-xl">
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-full flex items-center justify-between px-5 py-3.5 glass-card rounded-xl hover:glass-card-hover transition-all group border border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg glass-pill flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isDarkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-white/80 font-medium">
                  {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-accent-green"></div>
            </button>

            {/* Footer */}
            <div className="text-center text-xs text-white/40 space-y-1">
              <p>Powered by CoinGecko</p>
              <p>v1.0.0 • 2026</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Inline Styles for Bubbles */}
      <style jsx>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.02));
          backdrop-filter: blur(8px);
          animation: float 20s infinite ease-in-out;
          pointer-events: none;
        }
        
        .bubble-1 {
          width: 120px;
          height: 120px;
          top: 10%;
          left: -10%;
          animation-delay: 0s;
          animation-duration: 25s;
        }
        
        .bubble-2 {
          width: 80px;
          height: 80px;
          top: 40%;
          right: -5%;
          animation-delay: 3s;
          animation-duration: 20s;
        }
        
        .bubble-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: -15%;
          animation-delay: 7s;
          animation-duration: 30s;
        }
        
        .bubble-4 {
          width: 60px;
          height: 60px;
          top: 70%;
          right: 10%;
          animation-delay: 5s;
          animation-duration: 18s;
        }
        
        .bubble-5 {
          width: 100px;
          height: 100px;
          bottom: 5%;
          right: -8%;
          animation-delay: 10s;
          animation-duration: 22s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-30px) translateX(20px) scale(1.1);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-10px) translateX(-15px) scale(0.95);
            opacity: 0.4;
          }
          75% {
            transform: translateY(-40px) translateX(10px) scale(1.05);
            opacity: 0.6;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.4s ease-out forwards;
        }
        
        .glass-heavy {
          background: rgba(10, 10, 20, 0.7);
          backdrop-filter: blur(20px);
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
        }
        
        .glass-card-hover {
          background: rgba(255, 255, 255, 0.06);
          backdrop-filter: blur(12px);
        }
        
        .glass-card-active {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(15px);
        }
        
        .glass-pill {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
        }
      `}</style>
    </>
  )
}
