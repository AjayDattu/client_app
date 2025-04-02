"use client"; // For Next.js App Router

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({ children }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return children;
}
