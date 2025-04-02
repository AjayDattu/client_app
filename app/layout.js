import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import BottomNavbar from '@/components/organisms/Navbar/BootomNavbar'
import { Toaster } from 'sonner';
import Navbar from '@/components/organisms/Navbar/Topbar';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Toaster position="top-right" />
             {children}
             <BottomNavbar/>
           </body>
      </html>
  )
}
