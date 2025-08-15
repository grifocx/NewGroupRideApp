interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-30">
      <div className="flex">
        <button 
          onClick={() => onTabChange('find')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'find' 
              ? 'text-cycle-green border-b-2 border-cycle-green' 
              : 'text-cycle-gray'
          }`}
          data-testid="tab-find"
        >
          <i className="fas fa-search block mb-1"></i>
          <span className="text-sm">Find</span>
        </button>
        <button 
          onClick={() => onTabChange('map')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'map' 
              ? 'text-cycle-green border-b-2 border-cycle-green' 
              : 'text-cycle-gray'
          }`}
          data-testid="tab-map"
        >
          <i className="fas fa-map block mb-1"></i>
          <span className="text-sm">Map</span>
        </button>
        <button 
          onClick={() => onTabChange('my-rides')}
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'my-rides' 
              ? 'text-cycle-green border-b-2 border-cycle-green' 
              : 'text-cycle-gray'
          }`}
          data-testid="tab-my-rides"
        >
          <i className="fas fa-calendar block mb-1"></i>
          <span className="text-sm">My Rides</span>
        </button>
      </div>
    </div>
  );
}
