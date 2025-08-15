import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log("=== CLIENT: Fetching user authentication ===");
      console.log("Document cookies before auth check:", document.cookie);
      
      const response = await fetch("/api/auth/user", {
        credentials: "include", // Ensure cookies are sent
      });
      
      console.log("=== CLIENT: Auth check response ===");
      console.log("Status:", response.status);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));
      
      if (response.status === 401) {
        console.log("=== CLIENT: Not authenticated ===");
        return null; // Not authenticated
      }
      if (!response.ok) {
        console.log("=== CLIENT: Auth check failed with error ===");
        throw new Error("Failed to fetch user");
      }
      
      const userData = await response.json();
      console.log("=== CLIENT: User data received ===");
      console.log("User:", userData);
      return userData;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error
  };
}