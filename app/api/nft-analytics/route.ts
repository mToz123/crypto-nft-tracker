import { NextResponse } from 'next/server'

const HELIUS_API_KEY = '51a8a832-4c09-4115-a83c-0f2e350a3200'

interface PriceHistory {
  timestamp: number
  floorPrice: number
  volume: number
  sales: number
}

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
  priceHistory: PriceHistory[]
}

// In-memory price history (in production, use Redis/KV store)
const priceHistoryStore: Map<string, PriceHistory[]> = new Map()

function calculatePriceChange(current: number, old: number): number {
  if (!old) return 0
  return ((current - old) / old) * 100
}

function determineSignal(
  priceChange1h: number,
  priceChange24h: number,
  volumeChange1h: number
): { signal: NFTAnalytics['signal']; strength: number } {
  // FAST PUMP - Price +20% in 1h
  if (priceChange1h >= 20) {
    return { signal: 'PUMP', strength: 90 + Math.min(priceChange1h - 20, 10) }
  }
  
  // HOT - Volume +50% in 1h
  if (volumeChange1h >= 50) {
    return { signal: 'HOT', strength: 85 + Math.min(volumeChange1h - 50, 15) }
  }
  
  // HEAVY DUMP - Price -20% in 1h
  if (priceChange1h <= -20) {
    return { signal: 'DUMP', strength: 90 + Math.min(Math.abs(priceChange1h) - 20, 10) }
  }
  
  // PUMP - Price +10% in 1h
  if (priceChange1h >= 10) {
    return { signal: 'PUMP', strength: 70 + priceChange1h }
  }
  
  // DUMP - Price -10% in 1h
  if (priceChange1h <= -10) {
    return { signal: 'DUMP', strength: 70 + Math.abs(priceChange1h) }
  }
  
  // STEADY RISE - Consistent positive movement
  if (priceChange1h > 5 && priceChange24h > 5) {
    return { signal: 'STEADY', strength: 60 + priceChange24h }
  }
  
  return { signal: 'NEUTRAL', strength: 50 }
}

async function fetchNFTStats(symbol: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`,
      { next: { revalidate: 60 } }
    )
    
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

async function fetchHeliusData(mintAddress: string): Promise<any> {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/token-metadata?api-key=${HELIUS_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mintAccounts: [mintAddress] }),
        next: { revalidate: 300 } // 5 min cache
      }
    )
    
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

function updatePriceHistory(symbol: string, currentData: any) {
  const history = priceHistoryStore.get(symbol) || []
  
  const newEntry: PriceHistory = {
    timestamp: Date.now(),
    floorPrice: currentData.floorPrice / 1e9, // lamports to SOL
    volume: currentData.volumeAll / 1e9,
    sales: currentData.listedCount || 0
  }
  
  // Keep last 24 hours (144 entries at 10min intervals)
  history.push(newEntry)
  if (history.length > 144) {
    history.shift()
  }
  
  priceHistoryStore.set(symbol, history)
  return history
}

function getPriceAtTime(history: PriceHistory[], hoursAgo: number): number {
  const targetTime = Date.now() - (hoursAgo * 60 * 60 * 1000)
  
  // Find closest historical price
  const closest = history.reduce((prev, curr) => {
    return Math.abs(curr.timestamp - targetTime) < Math.abs(prev.timestamp - targetTime)
      ? curr
      : prev
  })
  
  return closest?.floorPrice || 0
}

export async function GET() {
  try {
    const collections = [
      { symbol: 'degods', name: 'DeGods' },
      { symbol: 'okay_bears', name: 'Okay Bears' },
      { symbol: 'mad_lads', name: 'Mad Lads' },
      { symbol: 'tensorians', name: 'Tensorians' },
      { symbol: 'claynosaurz', name: 'Claynosaurz' },
      { symbol: 'famous_fox_federation', name: 'Famous Fox Federation' },
      { symbol: 'smb_gen2', name: 'SMB Gen2' },
      { symbol: 'abc', name: 'ABC' }
    ]

    const results = await Promise.all(
      collections.map(async ({ symbol, name }) => {
        const stats = await fetchNFTStats(symbol)
        
        if (!stats) {
          return { symbol, name, error: 'Failed to fetch' }
        }

        // Update price history
        const history = updatePriceHistory(symbol, stats)
        
        const currentPrice = stats.floorPrice / 1e9 // SOL
        const price1hAgo = history.length > 6 ? getPriceAtTime(history, 1) : currentPrice
        const price24hAgo = history.length > 144 ? getPriceAtTime(history, 24) : currentPrice
        const price7dAgo = currentPrice // Simplified for now
        
        const priceChange1h = calculatePriceChange(currentPrice, price1hAgo)
        const priceChange24h = calculatePriceChange(currentPrice, price24hAgo)
        const priceChange7d = calculatePriceChange(currentPrice, price7dAgo)
        
        const volume24h = stats.volumeAll / 1e9
        const volumeChange1h = history.length > 6 
          ? calculatePriceChange(volume24h, history[history.length - 6].volume)
          : 0
        const volumeChange24h = 0 // Simplified
        
        const { signal, strength } = determineSignal(
          priceChange1h,
          priceChange24h,
          volumeChange1h
        )

        const analytics: NFTAnalytics = {
          symbol,
          name,
          floorPrice: currentPrice,
          priceChange1h,
          priceChange24h,
          priceChange7d,
          volumeChange1h,
          volumeChange24h,
          signal,
          signalStrength: strength,
          holders: 0, // Helius integration
          listedCount: stats.listedCount || 0,
          volumeAll: stats.volumeAll / 1e9,
          volume24h,
          priceHistory: history.slice(-24) // Last 24 entries
        }

        return analytics
      })
    )

    // Filter out errors
    const validResults = results.filter(r => !('error' in r))

    return NextResponse.json({
      data: validResults,
      timestamp: Date.now(),
      totalTracked: validResults.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch NFT analytics' },
      { status: 500 }
    )
  }
}
