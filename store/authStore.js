import { create } from "zustand";

// Zustand store for authentication state
const useAuthStore = create((set) => ({
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) || null : null,

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Persist user
    } else {
      localStorage.removeItem("user");
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem("user"); // Remove from localStorage
  },
}));

export default useAuthStore;
