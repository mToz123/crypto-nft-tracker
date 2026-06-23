'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
  market_cap_rank: number
  sparkline_in_7d: {
    price: number[]
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CryptoTracker() {
  const { data, error, isLoading } = useSWR<CryptoData[]>(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,avalanche-2,polygon,chainlink,polkadot,litecoin,uniswap,arbitrum,optimism,fantom,near,aptos,sui,injective&order=market_cap_desc&sparkline=true',
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30s
  )

  if (error) return <div className="text-red-500">Failed to load crypto data</div>
  if (isLoading) return <LoadingSkeleton />

  return (
    <div>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="crypto-card">
          <p className="text-sm text-white/60 mb-1">Total Tracked</p>
          <p className="text-2xl font-bold">{data?.length || 0}</p>
        </div>
        <div className="crypto-card border-accent-green/30">
          <p className="text-sm text-white/60 mb-1">📈 Gainers</p>
          <p className="text-2xl font-bold text-accent-green">
            {data?.filter(c => c.price_change_percentage_24h > 0).length || 0}
          </p>
        </div>
        <div className="crypto-card border-accent-red/30">
          <p className="text-sm text-white/60 mb-1">📉 Losers</p>
          <p className="text-2xl font-bold text-accent-red">
            {data?.filter(c => c.price_change_percentage_24h < 0).length || 0}
          </p>
        </div>
        <div className="crypto-card">
          <p className="text-sm text-white/60 mb-1">Total Market Cap</p>
          <p className="text-2xl font-bold">
            ${((data?.reduce((sum, c) => sum + c.market_cap, 0) || 0) / 1e12).toFixed(2)}T
          </p>
        </div>
      </div>

      {/* Crypto Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.map((crypto) => (
          <CryptoCard key={crypto.id} crypto={crypto} />
        ))}
      </div>
    </div>
  )
}

function CryptoCard({ crypto }: { crypto: CryptoData }) {
  const isPositive = crypto.price_change_percentage_24h >= 0
  
  return (
    <div className="crypto-card hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-green rounded-full flex items-center justify-center font-bold">
            {crypto.symbol.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{crypto.symbol.toUpperCase()}</h3>
            <p className="text-xs text-white/60">#{crypto.market_cap_rank}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isPositive
            ? 'bg-accent-green/20 text-accent-green'
            : 'bg-accent-red/20 text-accent-red'
        }`}>
          {isPositive ? '↑' : '↓'}
          {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
        </div>
      </div>

      {/* Price */}
      <div className="mb-4">
        <p className="text-3xl font-bold">
          ${crypto.current_price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
          })}
        </p>
      </div>

      {/* 7-Day Chart */}
      <div className="mb-4 h-16">
        {crypto.sparkline_in_7d && crypto.sparkline_in_7d.price.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={crypto.sparkline_in_7d.price.map((p, i) => ({ value: p, index: i }))}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={isPositive ? '#00ff88' : '#ff4757'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stats */}
      <div className="space-y-2 text-sm border-t border-white/10 pt-4">
        <div className="flex justify-between text-white/60">
          <span>Market Cap</span>
          <span className="font-medium text-white">
            ${(crypto.market_cap / 1e9).toFixed(2)}B
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Volume 24h</span>
          <span className="font-medium text-white">
            ${(crypto.total_volume / 1e9).toFixed(2)}B
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Network</span>
          <span className="font-medium text-white">{crypto.name}</span>
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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((i) => (
          <div key={i} className="crypto-card animate-pulse">
            <div className="h-6 bg-white/10 rounded mb-4 w-20" />
            <div className="h-8 bg-white/10 rounded mb-4 w-32" />
            <div className="h-16 bg-white/10 rounded mb-4" />
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
