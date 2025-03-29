import React from 'react'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn,UserButton } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import BottomNavbar from '@/components/organisms/BootomNavbar'
import { Toaster } from 'sonner';
import Home from '@/components/pages/home';
import { User } from 'lucide-react';
function page() {
  return (
   <div>
    <Home/>
   </div>
  )
}

export default page