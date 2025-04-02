"use client";

import React, { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNavbar from "@/components/organisms/Navbar/BootomNavbar";
import { Toaster } from "sonner";
import Navbar from "@/components/organisms/Navbar/Topbar";
import Home from "@/components/pages/home"; // Assuming this is the main page content
import Sign from "../components/organisms/login/sign-in";
import useAuthStore from "@/store/authStore";
import { Loader } from "lucide-react";
import { Button, Card, Typography, Divider, Spin, Layout, Space } from "antd";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Page() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [setUser]);

  if (loading) return <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '40px 0' 
              }}>
                <Spin size="large" style={{ 
                  '--ant-primary-color': '#8A2BE2' 
                }} />
              </div>;
 // Show a loading state while checking

  return (
    <div className="pb-18">
            <Home /> {/* Your main page content */}
    </div>
  );
}
