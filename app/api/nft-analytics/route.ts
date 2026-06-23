import { NextResponse } from 'next/server'

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

function determineSignal(
  priceChange1h: number,
  priceChange24h: number,
  volumeChange1h: number
): { signal: NFTAnalytics['signal']; strength: number } {
  if (priceChange1h >= 20) {
    return { signal: 'PUMP', strength: 90 + Math.min(priceChange1h - 20, 10) }
  }
  
  if (volumeChange1h >= 50) {
    return { signal: 'HOT', strength: 85 + Math.min(volumeChange1h - 50, 15) }
  }
  
  if (priceChange1h <= -20) {
    return { signal: 'DUMP', strength: 90 + Math.min(Math.abs(priceChange1h) - 20, 10) }
  }
  
  if (priceChange1h >= 10) {
    return { signal: 'PUMP', strength: 70 + priceChange1h }
  }
  
  if (priceChange1h <= -10) {
    return { signal: 'DUMP', strength: 70 + Math.abs(priceChange1h) }
  }
  
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
        
        if (!stats || !stats.floorPrice) {
          return { 
            symbol, 
            name, 
            floorPrice: 0,
            priceChange1h: 0,
            priceChange24h: 0,
            priceChange7d: 0,
            volumeChange1h: 0,
            volumeChange24h: 0,
            signal: 'NEUTRAL' as const,
            signalStrength: 50,
            holders: 0,
            listedCount: 0,
            volumeAll: 0,
            volume24h: 0
          }
        }

        const currentPrice = stats.floorPrice / 1e9
        
        // Simplified - use random changes for demo (replace with real tracking later)
        const priceChange1h = (Math.random() - 0.5) * 30
        const priceChange24h = (Math.random() - 0.5) * 50
        const priceChange7d = (Math.random() - 0.5) * 100
        const volumeChange1h = (Math.random() - 0.5) * 80
        
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
          volumeChange24h: 0,
          signal,
          signalStrength: strength,
          holders: 0,
          listedCount: stats.listedCount || 0,
          volumeAll: stats.volumeAll / 1e9,
          volume24h: stats.volumeAll / 1e9
        }

        return analytics
      })
    )

    return NextResponse.json({
      data: results,
      timestamp: Date.now(),
      totalTracked: results.length
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch NFT analytics' },
      { status: 500 }
    )
  }
}
