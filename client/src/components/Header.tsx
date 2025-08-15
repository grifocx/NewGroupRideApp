import { useState } from "react";
import { Link } from "wouter";
import { BiCycling } from "react-icons/bi";
import { useAuth } from "@/hooks/useAuth";
import ProfileModal from "@/components/ProfileModal";

interface HeaderProps {
  onCreateRide: () => void;
}

export default function Header({ onCreateRide }: HeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user } = useAuth();
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 20.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.8 0 3.3 1.1 4 2.7L12 7h2l1.2 2.1c.7-1.6 2.2-2.7 4-2.7 2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5c-1.8 0-3.3-1.1-4-2.7L12 16h-2l-1.2-2.1c-.7 1.6-2.2 2.7-4 2.7zm0-7c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm14 0c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zM7.5 5L9 6.5 13 2.5 11.5 1 7.5 5z"/>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-charcoal">GroupRideApp</h1>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 backdrop-blur-sm rounded-xl text-cyan-600 font-medium border border-cyan-200/30">
              Find Rides
            </Link>
            <Link href="/my-rides" className="px-4 py-2 text-warm-gray hover:text-charcoal hover:bg-white/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
              My Rides
            </Link>
            <Link href="/profile" className="px-4 py-2 text-warm-gray hover:text-charcoal hover:bg-white/50 rounded-xl transition-all duration-200 backdrop-blur-sm">
              Profile
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={onCreateRide}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-4 py-2 rounded-xl font-medium shadow-lg backdrop-blur-sm transition-all duration-200 transform hover:scale-105"
              data-testid="button-create-ride"
            >
              <i className="fas fa-plus mr-2"></i>Create Ride
            </button>
            <button
              onClick={() => setShowProfileModal(true)}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-200"
              data-testid="button-user-profile"
              title={user ? `${user.firstName} ${user.lastName}` : "Profile"}
            >
              <i className="fas fa-user text-charcoal text-sm"></i>
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
