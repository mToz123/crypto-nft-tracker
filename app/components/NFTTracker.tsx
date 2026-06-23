'use client'

import useSWR from 'swr'

interface NFTCollection {
  symbol: string
  name: string
  image: string
  floorPrice: number
  listedCount: number
  volumeAll: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function NFTTracker() {
  const collections = ['degods', 'okay_bears', 'mad_lads', 'tensorians']
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {collections.map((symbol) => (
        <NFTCard key={symbol} symbol={symbol} />
      ))}
    </div>
  )
}

function NFTCard({ symbol }: { symbol: string }) {
  const { data: allData, error, isLoading } = useSWR(
    '/api/nft',
    fetcher,
    { refreshInterval: 60000 } // Refresh every 60s
  )
  
  const data = allData?.find((item: any) => item.symbol === symbol)

  if (error) return <ErrorCard symbol={symbol} />
  if (isLoading) return <LoadingCard />

  const floorPrice = (data?.floorPrice || 0) / 1e9 // Convert lamports to SOL

  return (
    <div className="crypto-card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-green rounded-lg flex items-center justify-center text-2xl">
          🖼️
        </div>
        <div>
          <h3 className="font-bold">{symbol.replace(/_/g, ' ').toUpperCase()}</h3>
          <p className="text-xs text-white/60">Magic Eden</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-white/60 mb-1">Floor Price</p>
        <p className="text-2xl font-bold">
          {floorPrice.toFixed(2)} SOL
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-white/60">
          <span>Listed</span>
          <span className="font-medium text-white">
            {data?.listedCount || 0}
          </span>
        </div>
        <div className="flex justify-between text-white/60">
          <span>Volume (All)</span>
          <span className="font-medium text-white">
            {((data?.volumeAll || 0) / 1e9).toFixed(0)} SOL
          </span>
        </div>
      </div>

      <button className="w-full mt-4 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-all text-sm font-medium">
        View Collection →
      </button>
    </div>
  )
}

function LoadingCard() {
  return (
    <div className="crypto-card animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-lg" />
        <div className="flex-1">
          <div className="h-4 bg-white/10 rounded mb-2 w-24" />
          <div className="h-3 bg-white/10 rounded w-16" />
        </div>
      </div>
      <div className="h-8 bg-white/10 rounded mb-4 w-32" />
      <div className="space-y-2">
        <div className="h-4 bg-white/10 rounded" />
        <div className="h-4 bg-white/10 rounded" />
      </div>
    </div>
  )
}

function ErrorCard({ symbol }: { symbol: string }) {
  return (
    <div className="crypto-card border-accent-red/30">
      <p className="text-accent-red text-sm">Failed to load {symbol}</p>
    </div>
  )
}
