import { useState } from "react";
import { type Ride } from "@shared/schema";
import { format } from "date-fns";

interface RideListSidebarProps {
  rides: Ride[];
  isLoading: boolean;
  onRideSelect: (ride: Ride) => void;
  onSearch: (query: string) => void;
  onFilterChange: (filters: any) => void;
  onQuickFilter: (filterType: string, value: string) => void;
  searchQuery: string;
  filters: any;
}

export default function RideListSidebar({
  rides,
  isLoading,
  onRideSelect,
  onSearch,
  onFilterChange,
  onQuickFilter,
  searchQuery,
  filters,
}: RideListSidebarProps) {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(dateObj, 'EEE, MMM d');
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const handleQuickFilterClick = (filterType: string, value?: string) => {
    if (filterType === 'clear') {
      onFilterChange({ difficulty: '', date: '', location: '' });
      onSearch('');
    } else {
      onQuickFilter(filterType, value || '');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded-lg mb-4"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-300 rounded-full w-20"></div>
              <div className="h-8 bg-gray-300 rounded-full w-16"></div>
              <div className="h-8 bg-gray-300 rounded-full w-20"></div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative mb-4">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="Search by location, difficulty..." 
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cycle-green focus:border-transparent"
            data-testid="input-search"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => handleQuickFilterClick('nearMe')}
            className="px-3 py-1 bg-cycle-green text-white text-sm rounded-full hover:bg-cycle-green/90 transition-colors"
            data-testid="filter-near-me"
          >
            <i className="fas fa-location-arrow mr-1"></i>Near Me
          </button>
          <button 
            onClick={() => handleQuickFilterClick('today')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.date === new Date().toISOString().split('T')[0]
                ? 'bg-cycle-green text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="filter-today"
          >
            Today
          </button>
          <button 
            onClick={() => handleQuickFilterClick('difficulty', 'easy')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filters.difficulty === 'easy'
                ? 'bg-cycle-green text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            data-testid="filter-beginner"
          >
            Beginner
          </button>
          <button 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors"
            data-testid="button-more-filters"
          >
            <i className="fas fa-filter mr-1"></i>More
          </button>
          {(searchQuery || filters.difficulty || filters.date || filters.location) && (
            <button 
              onClick={() => handleQuickFilterClick('clear')}
              className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full hover:bg-red-200 transition-colors"
              data-testid="button-clear-filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* More Filters Panel */}
        {showMoreFilters && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select 
                  value={filters.difficulty}
                  onChange={(e) => onFilterChange({ ...filters, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  data-testid="select-difficulty"
                >
                  <option value="">All difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date"
                  value={filters.date}
                  onChange={(e) => onFilterChange({ ...filters, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  data-testid="input-date-filter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text"
                  placeholder="Enter city or area"
                  value={filters.location}
                  onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  data-testid="input-location-filter"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ride List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-cycle-dark">Upcoming Rides</h2>
            <span className="text-sm text-cycle-gray" data-testid="text-rides-count">
              {rides.length} found
            </span>
          </div>

          {rides.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-search text-4xl mb-4 text-gray-300"></i>
              <p>No rides found matching your criteria.</p>
              <p className="text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rides.map((ride) => (
                <div 
                  key={ride.id}
                  onClick={() => onRideSelect(ride)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  data-testid={`card-ride-${ride.id}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`${getDifficultyColor(ride.difficulty)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                        {getDifficultyLabel(ride.difficulty)}
                      </span>
                      {ride.isRecurring && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          <i className="fas fa-redo mr-1"></i>
                          {ride.recurringType === 'weekly' ? 'Weekly' : 'Monthly'}
                        </span>
                      )}
                    </div>
                    <i className="fas fa-heart text-gray-300 hover:text-red-500 cursor-pointer" data-testid={`button-favorite-${ride.id}`}></i>
                  </div>
                  
                  <h3 className="font-semibold text-cycle-dark mb-2" data-testid={`text-title-${ride.id}`}>
                    {ride.title}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-cycle-gray mb-3">
                    <div className="flex items-center">
                      <i className="fas fa-calendar-alt w-4 mr-2"></i>
                      <span data-testid={`text-date-${ride.id}`}>
                        {formatDate(ride.date)}, {formatTime(ride.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt w-4 mr-2"></i>
                      <span data-testid={`text-location-${ride.id}`} className="truncate">
                        {ride.startLocation}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-route w-4 mr-2"></i>
                      <span data-testid={`text-distance-${ride.id}`}>
                        {ride.distance ? `${ride.distance} miles` : 'Distance TBD'}
                        {ride.duration && (
                          <>
                            <span className="mx-2">•</span>
                            <span>{ride.duration} hours</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-cycle-blue rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-cycle-orange rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                        {(ride.participantCount || 0) > 3 && (
                          <div className="w-6 h-6 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs text-white font-bold">+{(ride.participantCount || 0) - 3}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-cycle-gray" data-testid={`text-participants-${ride.id}`}>
                        +{ride.participantCount || 0} joined
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle join ride action
                      }}
                      className="bg-cycle-green text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-cycle-green/90 transition-colors"
                      data-testid={`button-join-${ride.id}`}
                    >
                      Join Ride
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
