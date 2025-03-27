"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const BottomNavbar = () => {
  return (
    <motion.nav
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-2 flex justify-around shadow-lg"
    >
      <Button variant="ghost" size="icon">
        <Home className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <Search className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <ShoppingCart className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <User className="h-6 w-6" />
      </Button>
    </motion.nav>
  );
};

export default BottomNavbar;
