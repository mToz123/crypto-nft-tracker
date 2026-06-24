'use client'

import { useState } from 'react'
import useSWR from 'swr'

interface NFTAnalytics {
  symbol: string
  name: string
  floorPrice: number
  priceChange1h: number
  priceChange24h: number
  priceChange7d: number
  volumeChange1h: number
  volumeChange24h: number
  signal: 'PUMP' | 'DUMP' | 'HOT' | 'STEADY' | 'NEUTRAL'
  signalStrength: number
  holders: number
  listedCount: number
  volumeAll: number
  volume24h: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const SIGNAL_CONFIG = {
  PUMP: { emoji: '🚀', color: 'text-accent-green', bg: 'bg-accent-green/20', label: 'PUMP' },
  DUMP: { emoji: '💀', color: 'text-accent-red', bg: 'bg-accent-red/20', label: 'DUMP' },
  HOT: { emoji: '🔥', color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'HOT' },
  STEADY: { emoji: '📈', color: 'text-blue-400', bg: 'bg-blue-400/20', label: 'STEADY' },
  NEUTRAL: { emoji: '➖', color: 'text-white/60', bg: 'bg-white/10', label: 'NEUTRAL' }
}

interface PumpDumpTrackerProps {
  filterMode?: 'pump' | 'dump' | 'all'
}

export default function PumpDumpTracker({ filterMode = 'all' }: PumpDumpTrackerProps) {
  const [filter, setFilter] = useState<'ALL' | 'PUMP' | 'DUMP' | 'HOT'>(
    filterMode === 'pump' ? 'PUMP' : filterMode === 'dump' ? 'DUMP' : 'ALL'
  )
  const [sortBy, setSortBy] = useState<'change1h' | 'change24h' | 'volume'>('change1h')
  
  const { data, error, isLoading } = useSWR<{ data: NFTAnalytics[] }>(
    '/api/nft-analytics',
    fetcher,
    { refreshInterval: 60000 } // Refresh every 60s
  )

  if (error) return <ErrorState />
  if (isLoading) return <LoadingSkeleton />

  // Filter collections
  let filtered = data?.data || []
  if (filter === 'PUMP') {
    filtered = filtered.filter(nft => nft.signal === 'PUMP' || nft.priceChange1h > 10)
  } else if (filter === 'DUMP') {
    filtered = filtered.filter(nft => nft.signal === 'DUMP' || nft.priceChange1h < -10)
  } else if (filter === 'HOT') {
    filtered = filtered.filter(nft => nft.signal === 'HOT' || nft.volumeChange1h > 50)
  }

  // Sort collections
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'change1h') return b.priceChange1h - a.priceChange1h
    if (sortBy === 'change24h') return b.priceChange24h - a.priceChange24h
    if (sortBy === 'volume') return b.volumeAll - a.volumeAll
    return 0
  })

  const pumpCount = data?.data.filter(n => n.signal === 'PUMP').length || 0
  const dumpCount = data?.data.filter(n => n.signal === 'DUMP').length || 0
  const hotCount = data?.data.filter(n => n.signal === 'HOT').length || 0

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="crypto-card">
          <p className="text-sm text-white/60 mb-1">Total Tracked</p>
          <p className="text-2xl font-bold">{data?.data.length || 0}</p>
        </div>
        <div className="crypto-card border-accent-green/30">
          <p className="text-sm text-white/60 mb-1">🚀 Pumping</p>
          <p className="text-2xl font-bold text-accent-green">{pumpCount}</p>
        </div>
        <div className="crypto-card border-accent-red/30">
          <p className="text-sm text-white/60 mb-1">💀 Dumping</p>
          <p className="text-2xl font-bold text-accent-red">{dumpCount}</p>
        </div>
        <div className="crypto-card border-orange-400/30">
          <p className="text-sm text-white/60 mb-1">🔥 Hot</p>
          <p className="text-2xl font-bold text-orange-400">{hotCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'ALL'
                ? 'bg-accent text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            All Collections
          </button>
          <button
            onClick={() => setFilter('PUMP')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'PUMP'
                ? 'bg-accent-green text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🚀 Pump Only
          </button>
          <button
            onClick={() => setFilter('DUMP')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'DUMP'
                ? 'bg-accent-red text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            💀 Dump Only
          </button>
          <button
            onClick={() => setFilter('HOT')}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === 'HOT'
                ? 'bg-orange-400 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🔥 Hot Only
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white/10 rounded-lg text-white/80 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="change1h">Sort: 1h Change</option>
            <option value="change24h">Sort: 24h Change</option>
            <option value="volume">Sort: Volume</option>
          </select>
        </div>
      </div>

      {/* NFT Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((nft) => (
          <NFTCard key={nft.symbol} nft={nft} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p className="text-lg">No collections match current filter</p>
        </div>
      )}
    </div>
  )
}

function NFTCard({ nft }: { nft: NFTAnalytics }) {
  const signalConfig = SIGNAL_CONFIG[nft.signal]
  
  return (
    <div className="crypto-card relative overflow-hidden">
      {/* Signal Badge */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${signalConfig.bg} ${signalConfig.color}`}>
          <span>{signalConfig.emoji}</span>
          <span>{signalConfig.label}</span>
        </div>
      </div>

      {/* Collection Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold mb-1">{nft.name}</h3>
        <p className="text-xs text-white/60">{nft.symbol}</p>
      </div>

      {/* Floor Price */}
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Floor Price</p>
        <p className="text-2xl font-bold">{nft.floorPrice.toFixed(2)} SOL</p>
      </div>

      {/* Price Changes */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div>
          <p className="text-xs text-white/60 mb-1">1h</p>
          <p className={`text-sm font-bold ${
            nft.priceChange1h >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {nft.priceChange1h >= 0 ? '↑' : '↓'}
            {Math.abs(nft.priceChange1h).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-1">24h</p>
          <p className={`text-sm font-bold ${
            nft.priceChange24h >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {nft.priceChange24h >= 0 ? '↑' : '↓'}
            {Math.abs(nft.priceChange24h).toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-white/60 mb-1">7d</p>
          <p className={`text-sm font-bold ${
            nft.priceChange7d >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {nft.priceChange7d >= 0 ? '↑' : '↓'}
            {Math.abs(nft.priceChange7d).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Volume & Stats */}
      <div className="space-y-2 text-sm border-t border-white/10 pt-4">
        <div className="flex justify-between text-white/60">
          <span>Volume</span>
          <span className="font-medium text-white">
            {(nft.volumeAll / 1000).toFixed(1)}K SOL
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Listed</span>
          <span className="font-medium text-white">{nft.listedCount}</span>
        </div>
        {nft.volumeChange1h !== 0 && (
          <div className="flex justify-between text-white/60">
            <span>Volume 1h</span>
            <span className={`font-medium ${
              nft.volumeChange1h > 0 ? 'text-accent-green' : 'text-accent-red'
            }`}>
              {nft.volumeChange1h > 0 ? '↑' : '↓'}
              {Math.abs(nft.volumeChange1h).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Signal Strength Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Signal Strength</span>
          <span>{nft.signalStrength.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              nft.signal === 'PUMP' ? 'bg-accent-green' :
              nft.signal === 'DUMP' ? 'bg-accent-red' :
              nft.signal === 'HOT' ? 'bg-orange-400' :
              'bg-accent'
            }`}
            style={{ width: `${nft.signalStrength}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="crypto-card animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2 w-20" />
            <div className="h-8 bg-white/10 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="crypto-card animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-32" />
            <div className="h-8 bg-white/10 rounded mb-4 w-24" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded" />
              <div className="h-4 bg-white/10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="crypto-card text-center py-12">
      <p className="text-accent-red mb-4">Failed to load NFT analytics</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-all"
      >
        Retry
      </button>
    </div>
  )
}
