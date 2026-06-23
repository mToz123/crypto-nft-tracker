'use client'

import { useEffect, useState } from 'react'
import useSWR from 'swr'

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  total_volume: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CryptoTracker() {
  const { data, error, isLoading } = useSWR<CryptoData[]>(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,avalanche-2&order=market_cap_desc',
    fetcher,
    { refreshInterval: 30000 } // Refresh every 30s
  )

  if (error) return <div className="text-red-500">Failed to load crypto data</div>
  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.map((crypto) => (
        <div key={crypto.id} className="crypto-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">{crypto.symbol.toUpperCase()}</h3>
              <p className="text-sm text-white/60">{crypto.name}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              crypto.price_change_percentage_24h >= 0
                ? 'bg-accent-green/20 text-accent-green'
                : 'bg-accent-red/20 text-accent-red'
            }`}>
              {crypto.price_change_percentage_24h >= 0 ? '↑' : '↓'}
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>

          <div className="mb-4">
            <p className="text-3xl font-bold">
              ${crypto.current_price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="space-y-2 text-sm">
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
          </div>
        </div>
      ))}
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="crypto-card animate-pulse">
          <div className="h-6 bg-white/10 rounded mb-4 w-20" />
          <div className="h-8 bg-white/10 rounded mb-4 w-32" />
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded" />
            <div className="h-4 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
