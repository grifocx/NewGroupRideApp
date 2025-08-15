# CycleConnect 🚴‍♀️

A comprehensive web application for discovering and organizing group cycling rides. Connect with local cyclists, create rides, and explore your community on two wheels.

## 🚀 Current Status: Production Ready ✅

CycleConnect is a fully-featured cycling platform with PostgreSQL database persistence, comprehensive user profiles, and coast-to-coast ride coverage.

### ✅ Recently Completed Features (August 2025)
- **PostgreSQL Database**: Migrated from in-memory to persistent PostgreSQL storage with Drizzle ORM
- **User Profile System**: Complete cyclist profiles with experience levels, bike types, and locations
- **Extensive Ride Library**: 15 diverse rides spanning coast-to-coast USA locations
- **Individual Ride Maps**: Each ride detail view includes an interactive map showing exact starting location
- **Enhanced Map System**: Improved error handling and fallback options for map loading
- **Comprehensive Seeding**: 8 cyclist profiles across major US cities with authentic riding backgrounds

### ✅ Core Features
- **Interactive Map**: Leaflet-powered map showing ride locations with difficulty-based markers
- **Ride Discovery**: Browse and filter rides by difficulty, date, location, and search terms
- **Ride Creation**: Comprehensive ride creation with geocoding and recurring ride support
- **Location Services**: OpenStreetMap integration with address search and geolocation
- **Filtering System**: Quick filters for "Near Me", difficulty levels, and date ranges
- **Ride Management**: Join rides, view participant counts, and detailed ride information
- **Individual Ride Maps**: Dedicated map view for each ride showing precise starting location
- **Mobile Responsive**: Fully optimized for mobile devices with dedicated mobile navigation

## 🎯 Getting Started

### For Users
1. **Explore Rides**: Browse the ride list or view rides on the interactive map
2. **Filter Results**: Use quick filters or detailed filters to find your perfect ride
3. **Create a Ride**: Click "Create Ride" button and fill in ride details with automatic location lookup
4. **Join Rides**: Click on any ride to view details and join the group
5. **Find Your Location**: Use the location button on the map to center on your current position

### For Developers
1. **Environment**: This app runs on Replit with integrated development server
2. **Start Development**: Click "Run" to start the full-stack development server
3. **Database**: PostgreSQL database with Drizzle ORM for production-ready persistence
4. **Maps**: OpenStreetMap and Nominatim API for mapping and geocoding services

## 📋 Demo Data

The application comes pre-loaded with comprehensive sample data across the USA:

### Cyclist Profiles (8 users)
- **Sarah Martinez** (San Francisco, CA) - Road cyclist and coffee ride organizer
- **Mike Rodriguez** (Boulder, CO) - Mountain bike enthusiast and climbing expert
- **Elena Kim** (Austin, TX) - Ultra-distance gravel cyclist and certified coach
- **Alex Thompson** (Portland, OR) - Urban commuter and cycling advocate
- **Jenny Chen** (Seattle, WA) - Beginner-friendly social ride organizer
- **David Wilson** (Denver, CO) - Bike touring expert and adventure leader
- **Lisa Anderson** (Minneapolis, MN) - Family ride organizer with electric bike
- **Carlos Gutierrez** (Miami, FL) - Former racer and speed training specialist

### Sample Rides (15 locations coast-to-coast)
**West Coast**: San Francisco Golden Gate, Boulder Foothills, Portland Bridges, Seattle Waterfront, Napa Valley
**Central**: Austin Hill Country, Rocky Mountain National Park, Minneapolis Lakes, Chicago Lakefront
**East Coast**: Central Park NYC, Blue Ridge Parkway, Miami Beach

All rides include realistic distances (8-150 miles), difficulty levels, GPS coordinates, and detailed descriptions.

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **Wouter** for lightweight client-side routing
- **TanStack Query** for server state management and caching
- **shadcn/ui** component library with Radix UI primitives
- **Tailwind CSS** with custom cycling-themed design system
- **React Hook Form** with Zod validation for form handling
- **Leaflet** for interactive mapping capabilities

### Backend Stack
- **Node.js** with TypeScript in ESM configuration
- **Express.js** for RESTful API endpoints
- **PostgreSQL Database** with Drizzle ORM for type-safe database operations
- **Zod validation** shared between client and server
- **OpenStreetMap Nominatim** for geocoding and address lookup

### Database Schema
```
users (cyclist profiles)
├── Basic info (username, email, first/last name)
├── Profile details (bio, location, experience level)
├── Preferences (distance, bike type)
└── Profile settings (active status, join date)

rides (cycling events)
├── Basic info (title, description, date, time)
├── Location data (address, coordinates)
├── Ride details (distance, duration, difficulty)
├── Recurring options (weekly, monthly, custom)
├── Organizer information (linked to users)
└── Participation limits and approval settings

ride_participants (join tracking)
├── participant details (linked to users)
├── join timestamps
└── ride relationships
```

## 🎮 Live Application

The application is running at the Replit URL. Key features you can test:

1. **Map Interaction**: Click on map markers to view ride details
2. **Individual Ride Maps**: Click any ride to see detailed view with dedicated map
3. **Ride Filtering**: Use search bar and filters to find specific rides
4. **Mobile Navigation**: Switch between "Find" and "Map" tabs on mobile
5. **Ride Creation**: Create new rides with automatic address geocoding
6. **Location Services**: Use "Find my location" button on the map
7. **Database Persistence**: All data is saved in PostgreSQL database
8. **Responsive Design**: Test on different screen sizes

## 📱 Mobile Experience

The application is fully optimized for mobile use:
- Tabbed navigation for easy mobile browsing
- Touch-friendly map interactions with responsive markers
- Mobile-optimized forms with proper input types
- Fast loading with optimized map rendering
- Floating action button for quick ride creation

## 🚧 Next Steps

### Planned Features
- **User Authentication**: Full user accounts with ride history and preferences
- **Advanced Filtering**: Weather integration, skill level matching, and route preferences
- **Route Planning**: GPX file support and turn-by-turn directions
- **Social Features**: Messaging, ride comments, and cyclist profiles
- **Ride Analytics**: Performance tracking and progress monitoring

### Contributing
This project uses modern TypeScript patterns and follows React best practices. All components include proper TypeScript typing and are optimized for mobile use.

## 🗺️ Maps & Location Services

- **Mapping**: Leaflet with OpenStreetMap tiles for free, open-source mapping
- **Geocoding**: Nominatim API for address-to-coordinate conversion
- **Location Detection**: Browser geolocation API for "Near Me" functionality
- **Markers**: Color-coded difficulty markers (green=easy, orange=intermediate, red=advanced)

## 📞 Support & Feedback

For questions or feedback about the CycleConnect application, use the Replit environment or create an issue in the project.
- Check the documentation in `replit.md` for technical architecture details
- Review the component structure in `/client/src/components`
- Report bugs or request features through normal development channels

---

**CycleConnect v2.0** - Built with ❤️ for cycling enthusiasts  
*Last Updated: August 15, 2025 - Database Migration & Enhanced Maps*