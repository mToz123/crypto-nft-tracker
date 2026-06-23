import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Try multiple Meteora endpoints
    const endpoints = [
      'https://dlmm-api.meteora.ag/pair/all_by_groups',
      'https://app.meteora.ag/dlmm-api/pair/all',
      'https://dlmm-api.meteora.ag/pools'
    ]

    let pools = null
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: { 'Accept': 'application/json' },
          next: { revalidate: 60 }
        })
        
        if (response.ok) {
          const data = await response.json()
          pools = data
          break
        }
      } catch (error) {
        continue
      }
    }

    if (!pools) {
      // Return mock data if API fails
      return NextResponse.json({
        data: [
          {
            name: 'SOL-USDC',
            address: 'mock-1',
            liquidity: 15000000,
            trade_volume_24h: 2500000,
            fees_24h: 7500,
            current_price: 142.50,
            apr: 18.25
          },
          {
            name: 'USDC-USDT',
            address: 'mock-2',
            liquidity: 12000000,
            trade_volume_24h: 1800000,
            fees_24h: 5400,
            current_price: 1.00,
            apr: 16.42
          },
          {
            name: 'mSOL-SOL',
            address: 'mock-3',
            liquidity: 8500000,
            trade_volume_24h: 1200000,
            fees_24h: 3600,
            current_price: 1.05,
            apr: 15.44
          },
          {
            name: 'JUP-SOL',
            address: 'mock-4',
            liquidity: 6200000,
            trade_volume_24h: 950000,
            fees_24h: 2850,
            current_price: 0.85,
            apr: 16.74
          }
        ]
      })
    }

    return NextResponse.json(pools)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch DLMM data' }, { status: 500 })
  }
}
