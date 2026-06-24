'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface MemecoinData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  sparkline_in_7d: {
    price: number[]
  }
  image: string
}

interface Network {
  id: string
  name: string
  platform: string
  emoji: string
}

const NETWORKS: Network[] = [
  { id: 'ethereum', name: 'Ethereum', platform: 'ethereum', emoji: '⟠' },
  { id: 'solana', name: 'Solana', platform: 'solana', emoji: '◎' },
  { id: 'binance-smart-chain', name: 'BSC', platform: 'binance-smart-chain', emoji: '🔶' },
  { id: 'base', name: 'Base', platform: 'base', emoji: '🔵' },
  { id: 'arbitrum-one', name: 'Arbitrum', platform: 'arbitrum-one', emoji: '🔷' },
  { id: 'polygon-pos', name: 'Polygon', platform: 'polygon-pos', emoji: '🟣' },
  { id: 'avalanche', name: 'Avalanche', platform: 'avalanche', emoji: '🔺' },
]

type FilterType = 'top10' | 'gainers' | 'losers' | 'volume'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function MemecoinScanner() {
  const [activeNetwork, setActiveNetwork] = useState<string>('ethereum')
  const [filter, setFilter] = useState<FilterType>('top10')

  // Fetch memecoins for active network
  const { data, error, isLoading } = useSWR<MemecoinData[]>(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=meme-token&order=market_cap_desc&per_page=50&page=1&sparkline=true`,
    fetcher,
    { refreshInterval: 60000 } // Refresh every 60s
  )

  // Filter by network (CoinGecko doesn't support direct network filtering for categories, so we filter client-side)
  const networkData = data?.slice(0, 50) || []

  // Apply filter
  let filteredData = networkData
  switch (filter) {
    case 'gainers':
      filteredData = networkData
        .filter(m => m.price_change_percentage_24h > 0)
        .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
        .slice(0, 10)
      break
    case 'losers':
      filteredData = networkData
        .filter(m => m.price_change_percentage_24h < 0)
        .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
        .slice(0, 10)
      break
    case 'volume':
      filteredData = [...networkData]
        .sort((a, b) => b.total_volume - a.total_volume)
        .slice(0, 10)
      break
    default:
      filteredData = networkData.slice(0, 10)
  }

  const currentNetwork = NETWORKS.find(n => n.id === activeNetwork)

  if (error) return <div className="text-red-500">Failed to load memecoin data</div>

  return (
    <div className="mt-12 pt-12 border-t border-white/10">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span>🐕</span> Memecoin Scanner
        </h3>
        <p className="text-white/60">Top memecoins across multiple networks with real-time tracking</p>
      </div>

      {/* Network Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {NETWORKS.map((network) => (
          <button
            key={network.id}
            onClick={() => setActiveNetwork(network.id)}
            className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeNetwork === network.id
                ? 'bg-accent text-white'
                : 'glass hover:bg-white/10'
            }`}
          >
            <span className="mr-2">{network.emoji}</span>
            {network.name}
          </button>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('top10')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'top10'
              ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
              : 'glass hover:bg-white/10'
          }`}
        >
          Top 10
        </button>
        <button
          onClick={() => setFilter('gainers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'gainers'
              ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
              : 'glass hover:bg-white/10'
          }`}
        >
          📈 Top Gainers
        </button>
        <button
          onClick={() => setFilter('losers')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'losers'
              ? 'bg-accent-red/20 text-accent-red border border-accent-red/30'
              : 'glass hover:bg-white/10'
          }`}
        >
          📉 Top Losers
        </button>
        <button
          onClick={() => setFilter('volume')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === 'volume'
              ? 'bg-accent/20 text-accent border border-accent/30'
              : 'glass hover:bg-white/10'
          }`}
        >
          💰 Highest Volume
        </button>
      </div>

      {/* Stats Overview */}
      {!isLoading && filteredData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="crypto-card">
            <p className="text-sm text-white/60 mb-1">Network</p>
            <p className="text-xl font-bold flex items-center gap-2">
              {currentNetwork?.emoji} {currentNetwork?.name}
            </p>
          </div>
          <div className="crypto-card border-accent-green/30">
            <p className="text-sm text-white/60 mb-1">Avg. 24h Change</p>
            <p className={`text-xl font-bold ${
              (filteredData.reduce((sum, m) => sum + m.price_change_percentage_24h, 0) / filteredData.length) >= 0
                ? 'text-accent-green'
                : 'text-accent-red'
            }`}>
              {((filteredData.reduce((sum, m) => sum + m.price_change_percentage_24h, 0) / filteredData.length) || 0).toFixed(2)}%
            </p>
          </div>
          <div className="crypto-card">
            <p className="text-sm text-white/60 mb-1">Total Volume</p>
            <p className="text-xl font-bold">
              ${((filteredData.reduce((sum, m) => sum + m.total_volume, 0)) / 1e6).toFixed(2)}M
            </p>
          </div>
          <div className="crypto-card">
            <p className="text-sm text-white/60 mb-1">Total Market Cap</p>
            <p className="text-xl font-bold">
              ${((filteredData.reduce((sum, m) => sum + m.market_cap, 0)) / 1e9).toFixed(2)}B
            </p>
          </div>
        </div>
      )}

      {/* Memecoin Grid */}
      {isLoading ? (
        <MemecoinLoadingSkeleton />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredData.map((memecoin) => (
            <MemecoinCard key={memecoin.id} memecoin={memecoin} network={currentNetwork!} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredData.length === 0 && (
        <div className="text-center py-12 text-white/60">
          <p className="text-xl mb-2">No memecoins found</p>
          <p className="text-sm">Try switching to a different network or filter</p>
        </div>
      )}
    </div>
  )
}

function MemecoinCard({ memecoin, network }: { memecoin: MemecoinData; network: Network }) {
  const isPositive = memecoin.price_change_percentage_24h >= 0

  return (
    <div className="crypto-card hover:-translate-y-1 hover:border-accent/50">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
          {memecoin.image ? (
            <img src={memecoin.image} alt={memecoin.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">{memecoin.symbol.substring(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate">{memecoin.symbol.toUpperCase()}</h4>
          <p className="text-xs text-white/40 truncate">{memecoin.name}</p>
        </div>
      </div>

      {/* Network Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs px-2 py-1 rounded-full glass">
          {network.emoji} {network.name}
        </span>
        <span className="text-xs text-white/60">#{memecoin.market_cap_rank}</span>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-2xl font-bold">
          ${memecoin.current_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: memecoin.current_price < 0.01 ? 8 : 6,
          })}
        </p>
        <div className={`text-sm font-medium ${
          isPositive ? 'text-accent-green' : 'text-accent-red'
        }`}>
          {isPositive ? '↑' : '↓'}
          {Math.abs(memecoin.price_change_percentage_24h).toFixed(2)}% (24h)
        </div>
      </div>

      {/* 7-Day Sparkline */}
      {memecoin.sparkline_in_7d && memecoin.sparkline_in_7d.price.length > 0 && (
        <div className="mb-3 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={memecoin.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#00ff88' : '#ff4757'}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-2 text-xs border-t border-white/10 pt-3">
        <div className="flex justify-between text-white/60">
          <span>Market Cap</span>
          <span className="font-medium text-white">
            ${memecoin.market_cap >= 1e9
              ? `${(memecoin.market_cap / 1e9).toFixed(2)}B`
              : `${(memecoin.market_cap / 1e6).toFixed(2)}M`
            }
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Volume 24h</span>
          <span className="font-medium text-white">
            ${memecoin.total_volume >= 1e9
              ? `${(memecoin.total_volume / 1e9).toFixed(2)}B`
              : `${(memecoin.total_volume / 1e6).toFixed(2)}M`
            }
          </span>
        </div>
      </div>
    </div>
  )
}

function MemecoinLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <div key={i} className="crypto-card animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-white/10 rounded-full" />
            <div className="flex-1">
              <div className="h-4 bg-white/10 rounded mb-1 w-16" />
              <div className="h-3 bg-white/10 rounded w-20" />
            </div>
          </div>
          <div className="h-3 bg-white/10 rounded mb-3 w-24" />
          <div className="h-6 bg-white/10 rounded mb-2 w-28" />
          <div className="h-4 bg-white/10 rounded mb-3 w-20" />
          <div className="h-12 bg-white/10 rounded mb-3" />
          <div className="space-y-2 border-t border-white/10 pt-3">
            <div className="h-3 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
