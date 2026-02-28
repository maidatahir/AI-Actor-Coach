import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { ScriptsProvider } from '@/lib/scripts-context'
import './globals.css'

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontMono = Inter({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'ActorPro AI - Intelligent Acting Coach',
  description: 'Master the stage. Command the screen. AI-powered acting coach for the modern actor.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}>
        <AuthProvider>
          <ScriptsProvider>
            {children}
            <Analytics />
          </ScriptsProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
