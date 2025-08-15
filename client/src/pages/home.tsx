import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type Ride } from "@shared/schema";
import Header from "@/components/Header";
import RideListSidebar from "@/components/RideListSidebar";
import InteractiveMap from "@/components/InteractiveMap";
import CreateRideModal from "@/components/CreateRideModal";
import RideDetailModal from "@/components/RideDetailModal";
import MobileNav from "@/components/MobileNav";
import { createFilterParams, applyQuickFilter, type RideFilters } from "@/utils/filterHelpers";
import { getCurrentLocation, isGeolocationSupported } from "@/utils/locationHelpers";

export default function Home() {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<RideFilters>({
    difficulty: "",
    date: "",
    location: "",
  });
  const [activeTab, setActiveTab] = useState("find");

  const { data: rides = [], isLoading, refetch } = useQuery<Ride[]>({
    queryKey: ["/api/rides", { search: searchQuery, ...filters }],
    queryFn: async () => {
      const params = createFilterParams(searchQuery, filters);
      const response = await fetch(`/api/rides?${params}`);
      if (!response.ok) throw new Error("Failed to fetch rides");
      return response.json();
    },
  });

  const handleRideSelect = (ride: Ride) => {
    setSelectedRide(ride);
  };

  const handleCreateRide = () => {
    setShowCreateModal(true);
  };

  const handleRideCreated = () => {
    refetch();
    setShowCreateModal(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: RideFilters) => {
    setFilters(newFilters);
  };

  const handleQuickFilter = async (filterType: string, value: string) => {
    if (filterType === "nearMe") {
      // Handle geolocation-based filtering
      if (isGeolocationSupported()) {
        try {
          await getCurrentLocation();
          // For demo, just show all rides - in real app would filter by distance
          setFilters({ ...filters, location: "" });
        } catch (error) {
          console.error("Geolocation error:", error);
        }
      }
    } else {
      const newFilters = applyQuickFilter(filters, filterType, value);
      setFilters(newFilters);
    }
  };

  return (
    <div className="min-h-screen bg-cycle-light">
      <Header onCreateRide={handleCreateRide} />
      
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex flex-col md:flex-row h-screen pt-16 md:pt-16">
        <div className={`w-full md:w-96 ${activeTab === 'find' ? 'block' : 'hidden md:block'}`}>
          <RideListSidebar
            rides={rides}
            isLoading={isLoading}
            onRideSelect={handleRideSelect}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onQuickFilter={handleQuickFilter}
            searchQuery={searchQuery}
            filters={filters}
          />
        </div>
        
        <div className={`flex-1 ${activeTab === 'find' ? 'hidden md:block' : activeTab === 'map' ? 'block' : 'hidden'}`}>
          <InteractiveMap
            rides={rides}
            selectedRide={selectedRide}
            onRideSelect={handleRideSelect}
          />
        </div>
      </main>

      {showCreateModal && (
        <CreateRideModal
          onClose={() => setShowCreateModal(false)}
          onRideCreated={handleRideCreated}
        />
      )}

      {selectedRide && (
        <RideDetailModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onUpdate={refetch}
        />
      )}

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={handleCreateRide}
          className="bg-cycle-green text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          data-testid="button-create-ride-mobile"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>
    </div>
  );
}
