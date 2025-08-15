import { type Ride, type InsertRide, type RideParticipant, type InsertRideParticipant } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Rides
  getRides(filters?: { 
    difficulty?: string; 
    date?: string; 
    location?: string; 
    search?: string;
  }): Promise<Ride[]>;
  getRide(id: string): Promise<Ride | undefined>;
  createRide(ride: InsertRide): Promise<Ride>;
  updateRide(id: string, updates: Partial<Ride>): Promise<Ride | undefined>;
  deleteRide(id: string): Promise<boolean>;
  
  // Participants
  getRideParticipants(rideId: string): Promise<RideParticipant[]>;
  joinRide(participant: InsertRideParticipant): Promise<RideParticipant>;
  leaveRide(rideId: string, participantId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private rides: Map<string, Ride>;
  private participants: Map<string, RideParticipant>;

  constructor() {
    this.rides = new Map();
    this.participants = new Map();
    this.seedData();
  }

  private seedData() {
    // Add some sample rides for demonstration
    const sampleRides: InsertRide[] = [
      {
        title: "Morning Coffee Ride",
        description: "Join us for a relaxing morning ride through Golden Gate Park! We'll stop at a local café halfway through. Perfect for beginners and social riders. Bring water and a positive attitude!",
        date: new Date().toISOString(),
        startTime: "08:00",
        startLocation: "Golden Gate Park, San Francisco, CA",
        startLatitude: "37.7694",
        startLongitude: "-122.4862",
        distance: "15.00",
        duration: "1.50",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: "user1",
        organizerName: "Sarah M.",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Hill Climb Challenge",
        description: "Test your climbing skills on this challenging route through Twin Peaks. Intermediate to advanced riders welcome.",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "14:00",
        startLocation: "Twin Peaks, San Francisco, CA",
        startLatitude: "37.7544",
        startLongitude: "-122.4477",
        distance: "25.00",
        duration: "2.50",
        difficulty: "intermediate",
        isRecurring: false,
        organizerId: "user2",
        organizerName: "Mike R.",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Century Training Ride",
        description: "Long distance training ride for serious cyclists. We'll maintain a steady pace with rest stops every 20 miles.",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "06:00",
        startLocation: "Crissy Field, San Francisco, CA",
        startLatitude: "37.8024",
        startLongitude: "-122.4058",
        distance: "100.00",
        duration: "6.00",
        difficulty: "advanced",
        isRecurring: false,
        organizerId: "user3",
        organizerName: "Elena K.",
        maxParticipants: 15,
        requiresApproval: true,
        hasRouteMap: true,
      },
    ];

    sampleRides.forEach(ride => {
      this.createRide(ride);
    });
  }

  async getRides(filters?: { 
    difficulty?: string; 
    date?: string; 
    location?: string; 
    search?: string;
  }): Promise<Ride[]> {
    let rides = Array.from(this.rides.values());

    if (filters) {
      if (filters.difficulty) {
        rides = rides.filter(ride => ride.difficulty === filters.difficulty);
      }
      if (filters.date) {
        const filterDate = new Date(filters.date).toDateString();
        rides = rides.filter(ride => new Date(ride.date).toDateString() === filterDate);
      }
      if (filters.location) {
        rides = rides.filter(ride => 
          ride.startLocation.toLowerCase().includes(filters.location!.toLowerCase())
        );
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        rides = rides.filter(ride => 
          ride.title.toLowerCase().includes(searchLower) ||
          ride.description?.toLowerCase().includes(searchLower) ||
          ride.startLocation.toLowerCase().includes(searchLower)
        );
      }
    }

    return rides.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getRide(id: string): Promise<Ride | undefined> {
    return this.rides.get(id);
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const id = randomUUID();
    const ride: Ride = {
      ...insertRide,
      id,
      date: new Date(insertRide.date),
      participantCount: 0,
      createdAt: new Date(),
    };
    this.rides.set(id, ride);
    return ride;
  }

  async updateRide(id: string, updates: Partial<Ride>): Promise<Ride | undefined> {
    const ride = this.rides.get(id);
    if (!ride) return undefined;

    const updatedRide = { ...ride, ...updates };
    this.rides.set(id, updatedRide);
    return updatedRide;
  }

  async deleteRide(id: string): Promise<boolean> {
    return this.rides.delete(id);
  }

  async getRideParticipants(rideId: string): Promise<RideParticipant[]> {
    return Array.from(this.participants.values()).filter(p => p.rideId === rideId);
  }

  async joinRide(insertParticipant: InsertRideParticipant): Promise<RideParticipant> {
    const id = randomUUID();
    const participant: RideParticipant = {
      ...insertParticipant,
      id,
      joinedAt: new Date(),
    };
    
    this.participants.set(id, participant);
    
    // Update participant count
    const ride = this.rides.get(insertParticipant.rideId);
    if (ride) {
      ride.participantCount = (ride.participantCount || 0) + 1;
      this.rides.set(ride.id, ride);
    }
    
    return participant;
  }

  async leaveRide(rideId: string, participantId: string): Promise<boolean> {
    const participant = Array.from(this.participants.values())
      .find(p => p.rideId === rideId && p.participantId === participantId);
    
    if (!participant) return false;
    
    this.participants.delete(participant.id);
    
    // Update participant count
    const ride = this.rides.get(rideId);
    if (ride && ride.participantCount > 0) {
      ride.participantCount = ride.participantCount - 1;
      this.rides.set(ride.id, ride);
    }
    
    return true;
  }
}

export const storage = new MemStorage();
