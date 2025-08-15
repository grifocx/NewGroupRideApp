import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Ride } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface RideDetailModalProps {
  ride: Ride;
  onClose: () => void;
  onUpdate: () => void;
}

export default function RideDetailModal({ ride, onClose, onUpdate }: RideDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const joinRideMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/rides/${ride.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantId: "current-user", // In real app, get from auth
          participantName: "Current User", // In real app, get from auth
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to join ride");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully joined ride!",
        description: "You'll receive updates about this ride.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/rides"] });
      onUpdate();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to join ride",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-cycle-green';
      case 'intermediate': return 'bg-cycle-orange';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.toUpperCase();
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'EEEE, MMMM do \'at\' h:mm a');
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleJoinRide = () => {
    joinRideMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ride.title,
        text: `Join me for "${ride.title}" on ${formatDate(ride.date)}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this link with other cyclists.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Ride image placeholder */}
          <div className="w-full h-48 bg-gradient-to-r from-cycle-green to-cycle-blue rounded-t-xl relative">
            <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fas fa-bicycle text-white text-6xl opacity-50"></i>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
              data-testid="button-close-detail-modal"
            >
              <i className="fas fa-times text-gray-600"></i>
            </button>
            
            <div className="absolute bottom-4 left-4">
              <span className={`${getDifficultyColor(ride.difficulty)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                {getDifficultyLabel(ride.difficulty)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-cycle-dark" data-testid="text-ride-title">
              {ride.title}
            </h3>
            <button 
              className="text-cycle-green hover:text-cycle-green/80"
              data-testid="button-favorite-detail"
            >
              <i className="fas fa-heart text-xl"></i>
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center text-cycle-gray">
              <i className="fas fa-user-circle w-5 mr-3"></i>
              <span data-testid="text-organizer">{ride.organizerName}</span>
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Host</span>
            </div>
            
            <div className="flex items-center text-cycle-gray">
              <i className="fas fa-calendar-alt w-5 mr-3"></i>
              <span data-testid="text-full-date">{formatDate(ride.date)} at {formatTime(ride.startTime)}</span>
            </div>
            
            <div className="flex items-center text-cycle-gray">
              <i className="fas fa-map-marker-alt w-5 mr-3"></i>
              <span data-testid="text-full-location" className="break-words">{ride.startLocation}</span>
            </div>
            
            <div className="flex items-center text-cycle-gray">
              <i className="fas fa-route w-5 mr-3"></i>
              <span data-testid="text-ride-details">
                {ride.distance ? `${ride.distance} miles` : 'Distance TBD'}
                {ride.duration && ` • ${ride.duration} hours`}
                {ride.difficulty && ` • ${ride.difficulty} pace`}
              </span>
            </div>
            
            <div className="flex items-center text-cycle-gray">
              <i className="fas fa-users w-5 mr-3"></i>
              <span data-testid="text-participant-info">
                {ride.participantCount || 0} cyclists joined
                {ride.maxParticipants && ` • ${ride.maxParticipants - (ride.participantCount || 0)} spots left`}
              </span>
            </div>

            {ride.isRecurring && (
              <div className="flex items-center text-cycle-gray">
                <i className="fas fa-redo w-5 mr-3"></i>
                <span data-testid="text-recurring-info">
                  Repeats {ride.recurringType}
                </span>
              </div>
            )}
          </div>
          
          {ride.description && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-cycle-dark mb-2">Description</h4>
              <p className="text-cycle-gray text-sm" data-testid="text-ride-description">
                {ride.description}
              </p>
            </div>
          )}

          {/* Additional ride options */}
          {(ride.requiresApproval || ride.hasRouteMap) && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-semibold text-cycle-dark mb-2">Ride Details</h4>
              <div className="space-y-1 text-sm text-cycle-gray">
                {ride.requiresApproval && (
                  <div className="flex items-center">
                    <i className="fas fa-check-circle w-4 mr-2 text-blue-500"></i>
                    <span>Approval required to join</span>
                  </div>
                )}
                {ride.hasRouteMap && (
                  <div className="flex items-center">
                    <i className="fas fa-map w-4 mr-2 text-blue-500"></i>
                    <span>Route map included</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button 
              onClick={handleJoinRide}
              disabled={joinRideMutation.isPending}
              className="flex-1 bg-cycle-green hover:bg-cycle-green/90"
              data-testid="button-join-ride-detail"
            >
              {joinRideMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Joining...
                </>
              ) : (
                "Join This Ride"
              )}
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="px-4"
              data-testid="button-share-ride"
            >
              <i className="fas fa-share-alt"></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
