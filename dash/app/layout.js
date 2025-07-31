// app/layout.tsx or layout.js
import './globals.css' // Ensure Tailwind's CSS is imported
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Login',
  description: 'Login page',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
