'use client'

import dynamic from 'next/dynamic'
import CalcPage from '@/components/CGPACalculator'

const ThreeBackground = dynamic(
  () => import('@/components/ThreeBackground'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <ThreeBackground />
      <div className="relative z-10">
        <CalcPage />
      </div>
    </div>
  )
}
