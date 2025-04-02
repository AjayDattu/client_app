import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function useAuthGuard() {
  const router = useRouter();
  const { user } = useAuthStore(); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to login if no user
    } else {
      setLoading(false);
    }
  }, [user, router]);

  return { user, loading };
}
