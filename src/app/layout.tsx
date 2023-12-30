import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Delano Flipse',
  description: 'Software Engineer, Web Developer.',
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
