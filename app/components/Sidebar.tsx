'use client'

import { useState } from 'react'

interface SidebarProps {
  isDarkMode: boolean
  onToggleDarkMode: () => void
  activeSection: string
  onNavigate: (section: 'home' | 'crypto' | 'pump-dump' | 'nft' | 'dlmm') => void
}

export default function Sidebar({ isDarkMode, onToggleDarkMode, activeSection, onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠', desc: 'Dashboard' },
    { id: 'crypto', label: 'Crypto Prices', icon: '₿', desc: 'Market tracking' },
    { id: 'pump-dump', label: 'Pump & Dump', icon: '📊', desc: 'Signal detection' },
    { id: 'nft', label: 'NFT Collections', icon: '🖼️', desc: 'Solana NFTs' },
    { id: 'dlmm', label: 'DLMM Pools', icon: '💧', desc: 'Liquidity pools' },
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
        className="fixed top-6 left-6 z-50 md:hidden glass p-3 rounded-xl hover:bg-white/10 transition-all"
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
        className={`fixed top-0 left-0 h-full w-72 glass border-r border-white/10 z-40 transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-green flex items-center justify-center text-2xl">
                ☁️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Sora</h1>
                <p className="text-xs text-white/60">Crypto Analytics Platform</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`group w-full text-left flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      activeSection === item.id
                        ? 'bg-accent text-white shadow-lg shadow-accent/20'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`text-2xl transition-transform duration-200 ${
                      activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold ${
                        activeSection === item.id ? 'text-white' : 'text-white/90'
                      }`}>
                        {item.label}
                      </div>
                      <div className={`text-xs mt-0.5 ${
                        activeSection === item.id ? 'text-white/80' : 'text-white/50'
                      }`}>
                        {item.desc}
                      </div>
                    </div>
                    {activeSection === item.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Quick Stats */}
            <div className="mt-6 p-4 rounded-xl glass border border-white/10">
              <div className="text-xs text-white/60 mb-2">Quick Stats</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Networks</span>
                  <span className="font-semibold text-white">7</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Assets</span>
                  <span className="font-semibold text-white">70+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Updates</span>
                  <span className="font-semibold text-accent-green">Real-time</span>
                </div>
              </div>
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="w-full flex items-center justify-between px-4 py-3 glass rounded-xl hover:bg-white/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
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
              <div className="w-2 h-2 rounded-full bg-accent-green" />
            </button>

            {/* Footer */}
            <div className="text-center text-xs text-white/40">
              <p>Powered by CoinGecko</p>
              <p className="mt-1">v1.0.0 • 2026</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
