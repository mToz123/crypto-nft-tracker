import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const collections = ['degods', 'okay_bears', 'mad_lads', 'tensorians']
    
    const results = await Promise.all(
      collections.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://api-mainnet.magiceden.dev/v2/collections/${symbol}/stats`,
            { next: { revalidate: 60 } }
          )
          
          if (!response.ok) {
            return { symbol, error: 'Failed to fetch' }
          }
          
          const data = await response.json()
          return { symbol, ...data }
        } catch (error) {
          return { symbol, error: 'Network error' }
        }
      })
    )

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch NFT data' }, { status: 500 })
  }
}
