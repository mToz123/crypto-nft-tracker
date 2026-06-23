'use client'

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl">💎</span>
          <span className="text-xl font-bold text-gradient">Crypto Tracker</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="#crypto"
            className="text-white/80 hover:text-white transition-colors"
          >
            Crypto
          </a>
          <a
            href="#nft"
            className="text-white/80 hover:text-white transition-colors"
          >
            NFT
          </a>
          <a
            href="#dlmm"
            className="text-white/80 hover:text-white transition-colors"
          >
            DLMM
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
          <span className="text-sm text-white/60">Live</span>
        </div>
      </div>
    </nav>
  )
}
