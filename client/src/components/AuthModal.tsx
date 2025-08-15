import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  preferredDistance: z.enum(["short", "medium", "long", "ultra"]),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onModeChange: (mode: "login" | "register") => void;
}

export default function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      experienceLevel: "beginner",
      preferredDistance: "medium",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      return await apiRequest("/api/auth/login", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      return await apiRequest("/api/auth/register", "POST", data);
    },
    onSuccess: () => {
      toast({
        title: "Welcome to CycleConnect!",
        description: "Your account has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogin = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-charcoal">
              {mode === "login" ? "Sign In" : "Join GroupRideApp"}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-white/30 transition-all duration-200"
              data-testid="button-close-auth-modal"
            >
              <i className="fas fa-times text-sm"></i>
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...loginForm.register("email")}
                  data-testid="input-login-email"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...loginForm.register("password")}
                  data-testid="input-login-password"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl shadow-lg backdrop-blur-sm"
                disabled={loginMutation.isPending}
                data-testid="button-submit-login"
              >
                {loginMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...registerForm.register("firstName")}
                    data-testid="input-register-first-name"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...registerForm.register("lastName")}
                    data-testid="input-register-last-name"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  {...registerForm.register("username")}
                  data-testid="input-register-username"
                />
                {registerForm.formState.errors.username && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerForm.register("email")}
                  data-testid="input-register-email"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...registerForm.register("password")}
                  data-testid="input-register-password"
                />
                {registerForm.formState.errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  {...registerForm.register("location")}
                  data-testid="input-register-location"
                />
                {registerForm.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {registerForm.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Select
                    value={registerForm.watch("experienceLevel")}
                    onValueChange={(value) => 
                      registerForm.setValue("experienceLevel", value as any)
                    }
                  >
                    <SelectTrigger data-testid="select-experience-level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="preferredDistance">Preferred Distance</Label>
                  <Select
                    value={registerForm.watch("preferredDistance")}
                    onValueChange={(value) => 
                      registerForm.setValue("preferredDistance", value as any)
                    }
                  >
                    <SelectTrigger data-testid="select-preferred-distance">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (&lt; 20 miles)</SelectItem>
                      <SelectItem value="medium">Medium (20-50 miles)</SelectItem>
                      <SelectItem value="long">Long (50-100 miles)</SelectItem>
                      <SelectItem value="ultra">Ultra (100+ miles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>



              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell other cyclists about yourself..."
                  {...registerForm.register("bio")}
                  data-testid="textarea-register-bio"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl shadow-lg backdrop-blur-sm"
                disabled={registerMutation.isPending}
                data-testid="button-submit-register"
              >
                {registerMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-white/20">
            <p className="text-warm-gray">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
              {" "}
              <button
                onClick={() => onModeChange(mode === "login" ? "register" : "login")}
                className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"
                data-testid="button-switch-auth-mode"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}