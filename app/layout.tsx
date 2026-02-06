import type { Metadata } from 'next'
import { Inter, DM_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Calculateur ROI Maintenance | Homieux Media',
  description: 'Calculez vos gains cachés en 60 secondes. Basé sur 47 contrats GTB analysés en Belgique.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${dmSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  )
}
