'use client'

import { useState } from 'react'
import useSWR from 'swr'

interface DLMMPool {
  name: string
  address: string
  mint_x: string
  mint_y: string
  liquidity: number
  trade_volume_24h: number
  current_price: number
  fees_24h: number
  apr: number
  // Simulated pump/dump data (would come from API in production)
  apyChange1h?: number
  apyChange24h?: number
  liquidityChange1h?: number
  liquidityChange24h?: number
  volumeChange1h?: number
  volumeChange24h?: number
}

interface PoolAnalytics extends DLMMPool {
  signal: 'PUMP' | 'DUMP' | 'HOT' | 'STABLE' | 'NEUTRAL'
  signalStrength: number
  apy: number
}

interface DLMMPoolsProps {
  filterMode?: 'pump' | 'dump' | 'all'
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const SIGNAL_CONFIG = {
  PUMP: { emoji: '🚀', color: 'text-accent-green', bg: 'bg-accent-green/20', label: 'PUMP' },
  DUMP: { emoji: '💀', color: 'text-accent-red', bg: 'bg-accent-red/20', label: 'DUMP' },
  HOT: { emoji: '🔥', color: 'text-orange-400', bg: 'bg-orange-400/20', label: 'HOT' },
  STABLE: { emoji: '📊', color: 'text-blue-400', bg: 'bg-blue-400/20', label: 'STABLE' },
  NEUTRAL: { emoji: '➖', color: 'text-white/60', bg: 'bg-white/10', label: 'NEUTRAL' }
}

export default function DLMMPools({ filterMode = 'all' }: DLMMPoolsProps) {
  const [filter, setFilter] = useState<'ALL' | 'PUMP' | 'DUMP' | 'HOT'>(
    filterMode === 'pump' ? 'PUMP' : filterMode === 'dump' ? 'DUMP' : 'ALL'
  )
  const [sortBy, setSortBy] = useState<'apy' | 'liquidity' | 'volume'>('apy')

  const { data, error, isLoading } = useSWR<{ data: DLMMPool[] }>(
    '/api/dlmm',
    fetcher,
    { refreshInterval: 60000 } // Refresh every 60s
  )

  if (error) return <ErrorState />
  if (isLoading) return <LoadingSkeleton />

  // Calculate analytics and signals
  const poolsWithAnalytics: PoolAnalytics[] = (data?.data || []).map(pool => {
    const apy = pool.liquidity > 0 ? ((pool.fees_24h / pool.liquidity) * 365 * 100) : 0

    // Simulate pump/dump detection (in production, this would come from API)
    const apyChange1h = (Math.random() - 0.5) * 40 // -20% to +20%
    const liquidityChange1h = (Math.random() - 0.5) * 30 // -15% to +15%
    const volumeChange1h = (Math.random() - 0.5) * 100 // -50% to +50%

    // Detect signal based on changes
    let signal: 'PUMP' | 'DUMP' | 'HOT' | 'STABLE' | 'NEUTRAL' = 'NEUTRAL'
    let signalStrength = 50

    if (apyChange1h > 10 && volumeChange1h > 30) {
      signal = 'PUMP'
      signalStrength = Math.min(95, 60 + apyChange1h + volumeChange1h / 5)
    } else if (apyChange1h < -10 || liquidityChange1h < -10) {
      signal = 'DUMP'
      signalStrength = Math.min(95, 60 + Math.abs(apyChange1h) + Math.abs(liquidityChange1h))
    } else if (volumeChange1h > 50) {
      signal = 'HOT'
      signalStrength = Math.min(90, 55 + volumeChange1h / 2)
    } else if (Math.abs(apyChange1h) < 3 && Math.abs(liquidityChange1h) < 3) {
      signal = 'STABLE'
      signalStrength = 70
    }

    return {
      ...pool,
      apy,
      apyChange1h,
      liquidityChange1h,
      volumeChange1h,
      signal,
      signalStrength
    }
  })

  // Filter pools
  let filtered = poolsWithAnalytics
  if (filter === 'PUMP') {
    filtered = poolsWithAnalytics.filter(p => p.signal === 'PUMP' || (p.apyChange1h && p.apyChange1h > 10))
  } else if (filter === 'DUMP') {
    filtered = poolsWithAnalytics.filter(p => p.signal === 'DUMP' || (p.apyChange1h && p.apyChange1h < -10))
  } else if (filter === 'HOT') {
    filtered = poolsWithAnalytics.filter(p => p.signal === 'HOT' || (p.volumeChange1h && p.volumeChange1h > 50))
  }

  // Sort pools
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'apy') return b.apy - a.apy
    if (sortBy === 'liquidity') return b.liquidity - a.liquidity
    if (sortBy === 'volume') return b.trade_volume_24h - a.trade_volume_24h
    return 0
  })

  const pumpCount = poolsWithAnalytics.filter(p => p.signal === 'PUMP').length
  const dumpCount = poolsWithAnalytics.filter(p => p.signal === 'DUMP').length
  const hotCount = poolsWithAnalytics.filter(p => p.signal === 'HOT').length

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="crypto-card">
          <p className="text-sm text-white/60 mb-1">Total Pools</p>
          <p className="text-2xl font-bold">{poolsWithAnalytics.length}</p>
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
            All Pools
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
            <option value="apy">Sort: APY</option>
            <option value="liquidity">Sort: Liquidity</option>
            <option value="volume">Sort: Volume</option>
          </select>
        </div>
      </div>

      {/* Pool Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map((pool) => (
          <PoolCard key={pool.address} pool={pool} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p className="text-lg">No pools match current filter</p>
        </div>
      )}
    </div>
  )
}

function PoolCard({ pool }: { pool: PoolAnalytics }) {
  const signalConfig = SIGNAL_CONFIG[pool.signal]

  return (
    <div className="crypto-card relative overflow-hidden hover:-translate-y-1 transition-transform">
      {/* Signal Badge */}
      <div className="absolute top-4 right-4">
        <div className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${signalConfig.bg} ${signalConfig.color}`}>
          <span>{signalConfig.emoji}</span>
          <span>{signalConfig.label}</span>
        </div>
      </div>

      {/* Pool Info */}
      <div className="mb-4 pr-20">
        <h3 className="text-lg font-bold mb-1">{pool.name}</h3>
        <p className="text-xs text-white/60">Meteora DLMM</p>
      </div>

      {/* APY */}
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">APY</p>
        <p className="text-3xl font-bold text-accent">{pool.apy.toFixed(2)}%</p>
        {pool.apyChange1h !== undefined && (
          <p className={`text-sm font-medium ${
            pool.apyChange1h >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {pool.apyChange1h >= 0 ? '↑' : '↓'}
            {Math.abs(pool.apyChange1h).toFixed(1)}% (1h)
          </p>
        )}
      </div>

      {/* Liquidity */}
      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Total Liquidity</p>
        <p className="text-xl font-bold">
          ${pool.liquidity >= 1e6 
            ? `${(pool.liquidity / 1e6).toFixed(2)}M`
            : `${(pool.liquidity / 1e3).toFixed(1)}K`
          }
        </p>
        {pool.liquidityChange1h !== undefined && (
          <p className={`text-xs ${
            pool.liquidityChange1h >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {pool.liquidityChange1h >= 0 ? '↑' : '↓'}
            {Math.abs(pool.liquidityChange1h).toFixed(1)}% (1h)
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm border-t border-white/10 pt-4">
        <div className="flex justify-between text-white/60">
          <span>Volume 24h</span>
          <span className="font-medium text-white">
            ${pool.trade_volume_24h >= 1e6
              ? `${(pool.trade_volume_24h / 1e6).toFixed(2)}M`
              : `${(pool.trade_volume_24h / 1e3).toFixed(1)}K`
            }
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Fees 24h</span>
          <span className="font-medium text-accent-green">
            ${(pool.fees_24h / 1e3).toFixed(2)}K
          </span>
        </div>
        {pool.volumeChange1h !== undefined && pool.volumeChange1h !== 0 && (
          <div className="flex justify-between text-white/60">
            <span>Volume 1h</span>
            <span className={`font-medium ${
              pool.volumeChange1h > 0 ? 'text-accent-green' : 'text-accent-red'
            }`}>
              {pool.volumeChange1h > 0 ? '↑' : '↓'}
              {Math.abs(pool.volumeChange1h).toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Signal Strength Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-white/60 mb-1">
          <span>Signal Strength</span>
          <span>{pool.signalStrength.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              pool.signal === 'PUMP' ? 'bg-accent-green' :
              pool.signal === 'DUMP' ? 'bg-accent-red' :
              pool.signal === 'HOT' ? 'bg-orange-400' :
              'bg-accent'
            }`}
            style={{ width: `${pool.signalStrength}%` }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button className="w-full mt-4 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all text-sm font-medium border border-white/10">
        View Pool →
      </button>
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
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="crypto-card animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-32" />
            <div className="h-8 bg-white/10 rounded mb-4 w-24" />
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded" />
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
      <p className="text-accent-red mb-4">Failed to load DLMM pools</p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-all"
      >
        Retry
      </button>
    </div>
  )
}
