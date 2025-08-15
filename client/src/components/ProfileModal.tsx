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
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  preferredDistance: z.enum(["short", "medium", "long", "ultra"]),
  bikeType: z.string().optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      location: user?.location || "",
      experienceLevel: user?.experienceLevel || "beginner",
      preferredDistance: user?.preferredDistance || "medium",
      bikeType: user?.bikeType || "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await apiRequest(`/api/users/${user!.id}`, "PATCH", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/auth/logout", "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-cycle-dark">Edit Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-profile-modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <form onSubmit={form.handleSubmit(handleUpdateProfile)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...form.register("firstName")}
                  data-testid="input-profile-first-name"
                />
                {form.formState.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...form.register("lastName")}
                  data-testid="input-profile-last-name"
                />
                {form.formState.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                {...form.register("location")}
                data-testid="input-profile-location"
              />
              {form.formState.errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select
                  value={form.watch("experienceLevel")}
                  onValueChange={(value) => 
                    form.setValue("experienceLevel", value as any)
                  }
                >
                  <SelectTrigger data-testid="select-profile-experience-level">
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
                  value={form.watch("preferredDistance")}
                  onValueChange={(value) => 
                    form.setValue("preferredDistance", value as any)
                  }
                >
                  <SelectTrigger data-testid="select-profile-preferred-distance">
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
              <Label htmlFor="bikeType">Bike Type (Optional)</Label>
              <Input
                id="bikeType"
                placeholder="e.g., Road Bike, Mountain Bike, Hybrid"
                {...form.register("bikeType")}
                data-testid="input-profile-bike-type"
              />
              {form.formState.errors.bikeType && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.bikeType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell other cyclists about yourself..."
                {...form.register("bio")}
                data-testid="textarea-profile-bio"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-cycle-green hover:bg-cycle-green/90"
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                {logoutMutation.isPending ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-cycle-gray">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Member since:</strong> {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}