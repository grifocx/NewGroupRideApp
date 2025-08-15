import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user) {
    setLocation("/");
    return null;
  }

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      console.log("=== LANDING: Login mutation started ===");
      console.log("Credentials:", { email, password });
      
      const response = await apiRequest("/api/auth/login", "POST", {
        email,
        password,
      });
      
      const responseData = await response.json();
      console.log("=== LANDING: Login response received ===");
      console.log("Response data:", responseData);
      
      return responseData;
    },
    onSuccess: (responseData) => {
      console.log("=== LANDING: Login onSuccess triggered ===");
      console.log("Response data:", responseData);
      
      // Store auth token in localStorage (Token-based auth)
      if (responseData && responseData.authToken) {
        localStorage.setItem('authToken', responseData.authToken);
        console.log("=== LANDING: Auth token stored in localStorage ===");
        console.log("Token value:", responseData.authToken);
      } else {
        console.log("=== LANDING: WARNING - No authToken in response ===");
        console.log("Response data:", responseData);
      }
      
      // Invalidate auth query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Redirect to main app
      setTimeout(() => {
        setLocation("/");
      }, 100);
    },
    onError: (error: Error) => {
      console.log("=== LANDING: Login onError triggered ===");
      console.log("Error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: {
      username: string;
      password: string;
      firstName: string;
      lastName: string;
      email: string;
      experienceLevel: string;
      bikeType: string;
      location: string;
    }) => {
      const response = await apiRequest("/api/auth/register", "POST", userData);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate auth query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({
        title: "Account created!",
        description: "Welcome to GroupRideApp.",
      });
      // Force page refresh to ensure session is recognized
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message || "Unable to create account",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("=== LANDING: handleLogin called ===");
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    console.log("=== LANDING: Form data extracted ===");
    console.log("Email:", email);
    console.log("Password:", password ? "***provided***" : "missing");
    
    loginMutation.mutate({ email, password });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      experienceLevel: "intermediate" as const,
      bikeType: "road" as const,
      location: "San Francisco, CA"
    };

    registerMutation.mutate(userData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main Authentication Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl">🚲</span>
            </div>
            <h1 className="text-3xl font-bold text-white">GroupRideApp</h1>
          </div>
          <p className="text-white/70 text-lg">Connect with local cyclists</p>
        </div>

        {/* Glassmorphism Authentication Card */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/70">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5 backdrop-blur-sm">
                <TabsTrigger 
                  value="login" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                  data-testid="tab-login"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
                  data-testid="tab-register"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white/90">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                      data-testid="input-login-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white/90">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                      data-testid="input-login-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-medium py-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
                    data-testid="button-login-submit"
                  >
                    {loginMutation.isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-firstName" className="text-white/90">First Name</Label>
                      <Input
                        id="register-firstName"
                        name="firstName"
                        placeholder="John"
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                        data-testid="input-register-firstName"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-lastName" className="text-white/90">Last Name</Label>
                      <Input
                        id="register-lastName"
                        name="lastName"
                        placeholder="Doe"
                        required
                        className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                        data-testid="input-register-lastName"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-white/90">Email</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                      data-testid="input-register-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-white/90">Username</Label>
                    <Input
                      id="register-username"
                      name="username"
                      placeholder="Choose a username"
                      required
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                      data-testid="input-register-username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-white/90">Password</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="Create a secure password"
                      required
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-cyan-400"
                      data-testid="input-register-password"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-medium py-2.5 rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
                    data-testid="button-register-submit"
                  >
                    {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Account Info */}
        <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <p className="text-white/70 text-sm text-center mb-2">Demo Account:</p>
          <p className="text-white/90 text-sm text-center">
            Email: <span className="text-cyan-400">sarah@cycling.com</span><br />
            Password: <span className="text-cyan-400">Password69</span>
          </p>
        </div>
      </div>
    </div>
  );
}