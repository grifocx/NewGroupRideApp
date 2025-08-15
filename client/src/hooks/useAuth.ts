import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log("=== CLIENT: Fetching user authentication (Token-based) ===");
      
      // Get auth token from localStorage
      const authToken = localStorage.getItem('authToken');
      console.log("Auth token from localStorage:", authToken ? "Present" : "Not found");
      
      const headers: Record<string, string> = {};
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      
      const response = await fetch("/api/auth/user", {
        credentials: "include", // Still include for session fallback
        headers
      });
      
      console.log("=== CLIENT: Auth check response ===");
      console.log("Status:", response.status);
      console.log("Used token auth:", !!authToken);
      
      if (response.status === 401) {
        console.log("=== CLIENT: Not authenticated ===");
        // Clear invalid token
        localStorage.removeItem('authToken');
        return null; // Not authenticated
      }
      if (!response.ok) {
        console.log("=== CLIENT: Auth check failed with error ===");
        throw new Error("Failed to fetch user");
      }
      
      const userData = await response.json();
      console.log("=== CLIENT: User data received ===");
      console.log("User:", userData.username);
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