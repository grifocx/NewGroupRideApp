import { useState } from "react";
import { Link } from "wouter";
import { Bike } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileModal from "@/components/ProfileModal";

interface HeaderProps {
  onCreateRide: () => void;
}

export default function Header({ onCreateRide }: HeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user } = useAuth();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Bike className="text-cycle-green text-2xl" />
              <h1 className="text-xl font-bold text-cycle-dark">CycleConnect</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-cycle-green font-medium border-b-2 border-cycle-green pb-4 -mb-4">
              Find Rides
            </Link>
            <Link href="/my-rides" className="text-cycle-gray hover:text-cycle-dark transition-colors">
              My Rides
            </Link>
            <Link href="/profile" className="text-cycle-gray hover:text-cycle-dark transition-colors">
              Profile
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={onCreateRide}
              className="bg-cycle-green text-white px-4 py-2 rounded-lg hover:bg-cycle-green/90 transition-colors font-medium"
              data-testid="button-create-ride"
            >
              <i className="fas fa-plus mr-2"></i>Create Ride
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 bg-cycle-blue rounded-full flex items-center justify-center hover:bg-cycle-blue/90 transition-colors"
              data-testid="button-user-profile"
              title={user ? `${user.firstName} ${user.lastName}` : "Profile"}
            >
              <i className="fas fa-user text-white text-sm"></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </header>
  );
}
