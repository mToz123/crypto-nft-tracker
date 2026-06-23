import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Crypto & NFT Tracker | Real-time Solana Analytics',
  description: 'Track crypto prices, NFT collections, and Meteora DLMM pools in real-time',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
