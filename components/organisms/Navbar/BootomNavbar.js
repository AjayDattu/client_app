"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import useAuthStore from "@/store/authStore"; // Import auth store

const BottomNavbar = () => {
  const { user } = useAuthStore(); // Get user state

  // ✅ If no user, return empty navbar

  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 w-full z-[999] backdrop-blur-lg dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-3 flex justify-around shadow-lg"
    >
      <Link href="/">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6 text-purple-500" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon">
        <Search className="h-6 w-6 text-purple-500" />
      </Button>
      <Button variant="ghost" size="icon">
        <ShoppingCart className="h-6 w-6 text-purple-500" />
      </Button>
      <Button variant="ghost" size="icon">
        <User className="h-6 w-6 text-purple-500" />
      </Button>
    </motion.nav>
  );
};

export default BottomNavbar;
