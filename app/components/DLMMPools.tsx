'use client'

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
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DLMMPools() {
  const { data, error, isLoading } = useSWR<{ data: DLMMPool[] }>(
    '/api/dlmm',
    fetcher,
    { refreshInterval: 60000 } // Refresh every 60s
  )

  if (error) return <div className="text-red-500">Failed to load DLMM pools</div>
  if (isLoading) return <LoadingSkeleton />

  // Get top 8 pools by liquidity
  const topPools = data?.data
    ?.sort((a, b) => b.liquidity - a.liquidity)
    ?.slice(0, 8) || []

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {topPools.map((pool) => (
        <PoolCard key={pool.address} pool={pool} />
      ))}
    </div>
  )
}

function PoolCard({ pool }: { pool: DLMMPool }) {
  const calculateAPY = () => {
    if (!pool.liquidity || !pool.fees_24h) return 0
    return ((pool.fees_24h / pool.liquidity) * 365 * 100).toFixed(2)
  }

  return (
    <div className="crypto-card glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg">{pool.name}</h3>
          <p className="text-xs text-white/60">Meteora DLMM</p>
        </div>
        <div className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
          {calculateAPY()}% APY
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Total Liquidity</p>
        <p className="text-2xl font-bold">
          ${(pool.liquidity / 1e6).toFixed(2)}M
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Volume 24h</span>
          <span className="font-medium text-white">
            ${(pool.trade_volume_24h / 1e6).toFixed(2)}M
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Fees 24h</span>
          <span className="font-medium text-accent-green">
            ${(pool.fees_24h / 1e3).toFixed(2)}K
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Price</span>
          <span className="font-medium text-white">
            ${pool.current_price.toFixed(4)}
          </span>
        </div>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-all text-sm font-medium">
        View Pool →
      </button>
    </div>
  )
}

function LoadingSkeleton() {
  return (
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
  )
}
