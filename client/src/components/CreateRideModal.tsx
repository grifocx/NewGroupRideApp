import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRideSchema, type InsertRide } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { geocodeAddress } from "@/lib/geocoding";

interface CreateRideModalProps {
  onClose: () => void;
  onRideCreated: () => void;
}

export default function CreateRideModal({ onClose, onRideCreated }: CreateRideModalProps) {
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [isGeocodingLocation, setIsGeocodingLocation] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRide>({
    resolver: zodResolver(insertRideSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      startTime: "",
      startLocation: "",
      distance: undefined,
      duration: undefined,
      difficulty: "easy",
      isRecurring: false,
      recurringType: undefined,
      maxParticipants: undefined,
      requiresApproval: false,
      hasRouteMap: false,
      organizerId: "current-user", // In real app, get from auth
      organizerName: "Current User", // In real app, get from auth
    },
  });

  const createRideMutation = useMutation({
    mutationFn: async (data: InsertRide) => {
      // Geocode the location if needed
      if (!data.startLatitude || !data.startLongitude) {
        setIsGeocodingLocation(true);
        try {
          const coords = await geocodeAddress(data.startLocation);
          if (coords) {
            data.startLatitude = coords.lat.toString();
            data.startLongitude = coords.lng.toString();
          }
        } catch (error) {
          console.warn("Geocoding failed, proceeding without coordinates");
        } finally {
          setIsGeocodingLocation(false);
        }
      }

      const response = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create ride");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ride created successfully!",
        description: "Your ride has been created and is now visible to other cyclists.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      onRideCreated();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create ride",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRide) => {
    createRideMutation.mutate(data);
  };

  const handleRecurringChange = (checked: boolean) => {
    setShowRecurringOptions(checked);
    form.setValue("isRecurring", checked);
    if (!checked) {
      form.setValue("recurringType", undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-cycle-dark">Create New Ride</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              data-testid="button-close-modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Ride Basic Info */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="block text-sm font-medium text-cycle-dark mb-2">
                Ride Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g., Morning Coffee Ride"
                {...form.register("title")}
                data-testid="input-title"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-cycle-dark mb-2">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell other cyclists about your ride..."
                rows={3}
                {...form.register("description")}
                data-testid="textarea-description"
              />
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="block text-sm font-medium text-cycle-dark mb-2">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                {...form.register("date")}
                data-testid="input-date"
              />
              {form.formState.errors.date && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="startTime" className="block text-sm font-medium text-cycle-dark mb-2">
                Start Time *
              </Label>
              <Input
                id="startTime"
                type="time"
                {...form.register("startTime")}
                data-testid="input-start-time"
              />
              {form.formState.errors.startTime && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.startTime.message}</p>
              )}
            </div>
          </div>
          
          {/* Location */}
          <div>
            <Label htmlFor="startLocation" className="block text-sm font-medium text-cycle-dark mb-2">
              Meeting Location *
            </Label>
            <div className="relative">
              <i className="fas fa-map-marker-alt absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                id="startLocation"
                placeholder="Search for address or landmark..."
                className="pl-10"
                {...form.register("startLocation")}
                data-testid="input-start-location"
              />
            </div>
            {form.formState.errors.startLocation && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.startLocation.message}</p>
            )}
          </div>
          
          {/* Ride Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="distance" className="block text-sm font-medium text-cycle-dark mb-2">
                Distance (miles)
              </Label>
              <Input
                id="distance"
                type="number"
                step="0.1"
                placeholder="15"
                {...form.register("distance")}
                data-testid="input-distance"
              />
            </div>
            <div>
              <Label htmlFor="duration" className="block text-sm font-medium text-cycle-dark mb-2">
                Duration (hours)
              </Label>
              <Input
                id="duration"
                type="number"
                step="0.5"
                placeholder="1.5"
                {...form.register("duration")}
                data-testid="input-duration"
              />
            </div>
            <div>
              <Label htmlFor="difficulty" className="block text-sm font-medium text-cycle-dark mb-2">
                Difficulty *
              </Label>
              <Select 
                onValueChange={(value) => form.setValue("difficulty", value as "easy" | "intermediate" | "advanced")}
                defaultValue="easy"
              >
                <SelectTrigger data-testid="select-difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.difficulty && (
                <p className="text-red-500 text-sm mt-1">{form.formState.errors.difficulty.message}</p>
              )}
            </div>
          </div>
          
          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={showRecurringOptions}
                onCheckedChange={handleRecurringChange}
                data-testid="checkbox-recurring"
              />
              <Label htmlFor="recurring" className="text-sm text-cycle-dark">
                Make this a recurring ride
              </Label>
            </div>
            
            {showRecurringOptions && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label htmlFor="recurringType" className="block text-sm font-medium text-cycle-dark mb-2">
                  Repeat
                </Label>
                <Select onValueChange={(value) => form.setValue("recurringType", value as "weekly" | "monthly" | "custom")}>
                  <SelectTrigger data-testid="select-recurring-type">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          {/* Advanced Options */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-cycle-dark mb-4">Additional Options</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="maxParticipants"
                  onCheckedChange={(checked) => {
                    if (!checked) form.setValue("maxParticipants", undefined);
                  }}
                  data-testid="checkbox-limit-participants"
                />
                <Label htmlFor="maxParticipants" className="text-sm text-cycle-dark">
                  Limit number of participants
                </Label>
                <Input
                  type="number"
                  placeholder="Max"
                  className="w-20 ml-2"
                  {...form.register("maxParticipants")}
                  data-testid="input-max-participants"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresApproval"
                  onCheckedChange={(checked) => form.setValue("requiresApproval", checked as boolean)}
                  data-testid="checkbox-requires-approval"
                />
                <Label htmlFor="requiresApproval" className="text-sm text-cycle-dark">
                  Require approval to join
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasRouteMap"
                  onCheckedChange={(checked) => form.setValue("hasRouteMap", checked as boolean)}
                  data-testid="checkbox-has-route-map"
                />
                <Label htmlFor="hasRouteMap" className="text-sm text-cycle-dark">
                  Include route map
                </Label>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-cycle-green hover:bg-cycle-green/90"
              disabled={createRideMutation.isPending || isGeocodingLocation}
              data-testid="button-create-ride"
            >
              {createRideMutation.isPending || isGeocodingLocation ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {isGeocodingLocation ? "Finding location..." : "Creating..."}
                </>
              ) : (
                "Create Ride"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
