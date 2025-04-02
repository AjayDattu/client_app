"use client";

import { auth, googleProvider, signInWithPopup } from "@/lib/firebase";
import useAuthStore from "@/store/authStore";
import { motion } from "framer-motion";
import { useState } from "react";

export default function GoogleLogin() {
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser({ 
        uid: user.uid, 
        displayName: user.displayName, 
        email: user.email, 
        photoURL: user.photoURL 
      });
    } catch (err) {
      setError(err.message || "Failed to sign in with Google");
      console.error("Google Sign-In Error", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.button
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        onClick={signInWithGoogle}
        disabled={isLoading}
        className="w-full py-4 px-6 bg-white border-2 border-gray-200 rounded-xl shadow-sm flex gap-6 items-center justify-center space-x-3 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-1"

      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .5 4.1 1.4l3-3C16.9 1.8 14.6 1 12 1 7.4 1 3.5 3.8 1.7 7.8l3.5 2.7C6.2 7.5 8.9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.2c0-.8-.1-1.7-.3-2.4H12v4.6h6.5c-.3 1.4-1.1 2.7-2.3 3.5l3.4 2.7c2-1.9 3.2-4.7 3.2-8.4z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.3 14.4l-3.5 2.7c2 4 6.2 6.9 10.9 6.9 3 0 5.3-.8 7-2.2l-3.4-2.7c-.9.7-2.1 1.1-3.6 1.1-3.1 0-5.9-2.1-6.8-5z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3 0 5.3-.8 7-2.2l-3.4-2.7c-.9.7-2.1 1.1-3.6 1.1-3.1 0-5.9-2.1-6.8-5L1.7 17c1.8 4 6 7 10.3 7z"
                      />
           </svg>
            Continue with Google
          </>
        )}
      </motion.button>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 text-center"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}