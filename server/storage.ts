import { type Ride, type InsertRide, type RideParticipant, type InsertRideParticipant, type User, type InsertUser, rides, rideParticipants, users } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, and, like, or, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
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
      duration: insertRide.duration || null,
      description: insertRide.description || null,
      startLatitude: insertRide.startLatitude || null,
      startLongitude: insertRide.startLongitude || null,
      distance: insertRide.distance || null,
      recurringType: insertRide.recurringType || null,
      maxParticipants: insertRide.maxParticipants || null,
      requiresApproval: insertRide.requiresApproval || false,
      hasRouteMap: insertRide.hasRouteMap || false,
      isRecurring: insertRide.isRecurring || false,
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
    if (ride && (ride.participantCount ?? 0) > 0) {
      ride.participantCount = (ride.participantCount ?? 0) - 1;
      this.rides.set(ride.id, ride);
    }
    
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.joinedAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return null;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, joinedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Rides
  async getRides(filters?: { 
    difficulty?: string; 
    date?: string; 
    location?: string; 
    search?: string;
  }): Promise<Ride[]> {
    let query = db.select().from(rides);
    
    if (filters) {
      const conditions = [];
      
      if (filters.difficulty) {
        conditions.push(eq(rides.difficulty, filters.difficulty));
      }
      
      if (filters.date) {
        const filterDate = new Date(filters.date);
        const startOfDay = new Date(filterDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(filterDate.setHours(23, 59, 59, 999));
        conditions.push(and(
          // Compare dates without time
          eq(rides.date, startOfDay)
        ));
      }
      
      if (filters.search) {
        conditions.push(or(
          like(rides.title, `%${filters.search}%`),
          like(rides.description, `%${filters.search}%`),
          like(rides.startLocation, `%${filters.search}%`)
        ));
      }
      
      if (filters.location) {
        conditions.push(like(rides.startLocation, `%${filters.location}%`));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return await query.orderBy(desc(rides.createdAt));
  }

  async getRide(id: string): Promise<Ride | undefined> {
    const [ride] = await db.select().from(rides).where(eq(rides.id, id));
    return ride || undefined;
  }

  async createRide(insertRide: InsertRide): Promise<Ride> {
    const [ride] = await db
      .insert(rides)
      .values({
        ...insertRide,
        date: new Date(insertRide.date),
      })
      .returning();
    return ride;
  }

  async updateRide(id: string, updates: Partial<Ride>): Promise<Ride | undefined> {
    const [ride] = await db
      .update(rides)
      .set(updates)
      .where(eq(rides.id, id))
      .returning();
    return ride || undefined;
  }

  async deleteRide(id: string): Promise<boolean> {
    // First delete all participants
    await db.delete(rideParticipants).where(eq(rideParticipants.rideId, id));
    
    // Then delete the ride
    const result = await db.delete(rides).where(eq(rides.id, id));
    return result.rowCount > 0;
  }

  async getRideParticipants(rideId: string): Promise<RideParticipant[]> {
    return await db
      .select()
      .from(rideParticipants)
      .where(eq(rideParticipants.rideId, rideId))
      .orderBy(desc(rideParticipants.joinedAt));
  }

  async joinRide(participant: InsertRideParticipant): Promise<RideParticipant> {
    const [newParticipant] = await db
      .insert(rideParticipants)
      .values(participant)
      .returning();

    // Update participant count
    await db
      .update(rides)
      .set({
        participantCount: db
          .select({ count: rides.participantCount })
          .from(rideParticipants)
          .where(eq(rideParticipants.rideId, participant.rideId))
      })
      .where(eq(rides.id, participant.rideId));

    return newParticipant;
  }

  async leaveRide(rideId: string, participantId: string): Promise<boolean> {
    const result = await db
      .delete(rideParticipants)
      .where(and(
        eq(rideParticipants.rideId, rideId),
        eq(rideParticipants.participantId, participantId)
      ));

    if (result.rowCount > 0) {
      // Update participant count
      await db
        .update(rides)
        .set({
          participantCount: db
            .select({ count: rides.participantCount })
            .from(rideParticipants)
            .where(eq(rideParticipants.rideId, rideId))
        })
        .where(eq(rides.id, rideId));
    }

    return result.rowCount > 0;
  }

  // Seed data for demo
  async seedDatabase(): Promise<void> {
    const existingUsers = await this.getUsers();
    if (existingUsers.length > 0) {
      return; // Already seeded
    }

    // Create cyclist profiles
    const sampleUsers: InsertUser[] = [
      {
        username: "sarah@cycling.com",
        email: "sarah@cycling.com",
        password: "Password69",
        firstName: "Sarah",
        lastName: "Martinez",
        bio: "Weekend warrior who loves exploring coffee shops by bike. Leading group rides for 3 years and always happy to help new cyclists!",
        location: "San Francisco, CA",
        experienceLevel: "intermediate",
        preferredDistance: "medium",
        bikeType: "Road Bike",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "mike@ridehigh.com",
        email: "mike@ridehigh.com",
        password: "Password69",
        firstName: "Mike",
        lastName: "Rodriguez",
        bio: "Hill climbing enthusiast and bike mechanic. If there's a mountain to climb, I'm your guy! 15+ years racing experience.",
        location: "Boulder, CO",
        experienceLevel: "advanced",
        preferredDistance: "long",
        bikeType: "Mountain Bike",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "elena@ultracycling.net",
        email: "elena@ultracycling.net",
        password: "Password69",
        firstName: "Elena",
        lastName: "Kim",
        bio: "Ultra-distance cyclist and certified coach. Completed 5 centuries and 2 double centuries. I organize training rides for serious cyclists.",
        location: "Austin, TX",
        experienceLevel: "expert",
        preferredDistance: "ultra",
        bikeType: "Gravel Bike",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "alex@biketowork.org",
        email: "alex@biketowork.org",
        password: "Password69",
        firstName: "Alex",
        lastName: "Thompson",
        bio: "Daily bike commuter and urban cycling advocate. Love showing people that cycling is the best way to get around the city!",
        location: "Portland, OR",
        experienceLevel: "intermediate",
        preferredDistance: "short",
        bikeType: "Hybrid",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "jenny@socialrides.com",
        email: "jenny@socialrides.com",
        password: "Password69",
        firstName: "Jenny",
        lastName: "Chen",
        bio: "Social ride organizer who believes cycling is better with friends. New to cycling but passionate about building community!",
        location: "Seattle, WA",
        experienceLevel: "beginner",
        preferredDistance: "short",
        bikeType: "Hybrid",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "david@biketour.adventure",
        email: "david@biketour.adventure",
        password: "Password69",
        firstName: "David",
        lastName: "Wilson",
        bio: "Bike touring enthusiast who has cycled across 15 states. I organize multi-day adventures and love sharing touring tips!",
        location: "Denver, CO",
        experienceLevel: "expert",
        preferredDistance: "ultra",
        bikeType: "Touring Bike",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "lisa@familybikes.fun",
        email: "lisa@familybikes.fun",
        password: "Password69",
        firstName: "Lisa",
        lastName: "Anderson",
        bio: "Mom of two who got back into cycling last year. I organize family-friendly rides and love showing kids that biking is fun!",
        location: "Minneapolis, MN",
        experienceLevel: "beginner",
        preferredDistance: "short",
        bikeType: "Electric Bike",
        profileImageUrl: null,
        isActive: true,
      },
      {
        username: "carlos@fastwheels.racing",
        email: "carlos@fastwheels.racing",
        password: "Password69",
        firstName: "Carlos",
        lastName: "Gutierrez",
        bio: "Former competitive cyclist turned group ride leader. I organize fast-paced training rides and love helping others improve!",
        location: "Miami, FL",
        experienceLevel: "expert",
        preferredDistance: "long",
        bikeType: "Road Bike",
        profileImageUrl: null,
        isActive: true,
      }
    ];

    // Create users first
    const createdUsers: User[] = [];
    for (const user of sampleUsers) {
      const newUser = await this.createUser(user);
      createdUsers.push(newUser);
    }

    // Create diverse rides across the USA
    const sampleRides: InsertRide[] = [
      {
        title: "Golden Gate Morning Coffee Ride",
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
        organizerId: createdUsers[0].id,
        organizerName: "Sarah Martinez",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Boulder Foothills Challenge",
        description: "Test your climbing skills on this challenging route through the Boulder foothills. Stunning mountain views await! Intermediate to advanced riders welcome.",
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "07:00",
        startLocation: "Chautauqua Park, Boulder, CO",
        startLatitude: "39.9991",
        startLongitude: "-105.2831",
        distance: "28.00",
        duration: "2.75",
        difficulty: "advanced",
        isRecurring: false,
        organizerId: createdUsers[1].id,
        organizerName: "Mike Rodriguez",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Austin Hill Country Century",
        description: "Long distance training ride through the beautiful Texas Hill Country. We'll maintain a steady pace with rest stops every 20 miles. Perfect training for century events!",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "06:00",
        startLocation: "Zilker Park, Austin, TX",
        startLatitude: "30.2672",
        startLongitude: "-97.7431",
        distance: "100.00",
        duration: "6.00",
        difficulty: "advanced",
        isRecurring: false,
        organizerId: createdUsers[2].id,
        organizerName: "Elena Kim",
        maxParticipants: 15,
        requiresApproval: true,
        hasRouteMap: true,
      },
      {
        title: "Portland Bridge Tour",
        description: "Urban exploration ride visiting all of Portland's famous bridges! Learn about the city's history while getting a great workout. All skill levels welcome.",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "10:00",
        startLocation: "Tom McCall Waterfront Park, Portland, OR",
        startLatitude: "45.5152",
        startLongitude: "-122.6784",
        distance: "22.00",
        duration: "2.00",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "monthly",
        organizerId: createdUsers[3].id,
        organizerName: "Alex Thompson",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Seattle Waterfront Social Ride",
        description: "Beginner-friendly social ride along Seattle's beautiful waterfront. We'll stop for photos and coffee! Perfect for new cyclists wanting to meet the community.",
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "11:00",
        startLocation: "Myrtle Edwards Park, Seattle, WA",
        startLatitude: "47.6205",
        startLongitude: "-122.3549",
        distance: "12.00",
        duration: "1.25",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: createdUsers[4].id,
        organizerName: "Jenny Chen",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Rocky Mountain National Park Adventure",
        description: "Epic multi-day touring experience through RMNP! Camping gear recommended. This is a supported ride with SAG wagon. Experienced cyclists only.",
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "08:00",
        startLocation: "Estes Park, CO",
        startLatitude: "40.3772",
        startLongitude: "-105.5217",
        distance: "150.00",
        duration: "8.00",
        difficulty: "advanced",
        isRecurring: false,
        organizerId: createdUsers[5].id,
        organizerName: "David Wilson",
        maxParticipants: 12,
        requiresApproval: true,
        hasRouteMap: true,
      },
      {
        title: "Minneapolis Chain of Lakes Family Ride",
        description: "Family-friendly ride around Minneapolis' beautiful Chain of Lakes! Kid-friendly pace with playground stops. Bring the whole family!",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "10:30",
        startLocation: "Lake Calhoun, Minneapolis, MN",
        startLatitude: "44.9483",
        startLongitude: "-93.3156",
        distance: "8.00",
        duration: "1.00",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: createdUsers[6].id,
        organizerName: "Lisa Anderson",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Miami Beach Speed Training",
        description: "High-intensity training ride along Miami Beach. Fast-paced group working on speed and endurance. Strong intermediate to advanced riders only!",
        date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "06:30",
        startLocation: "South Beach, Miami, FL",
        startLatitude: "25.7617",
        startLongitude: "-80.1918",
        distance: "35.00",
        duration: "2.25",
        difficulty: "advanced",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: createdUsers[7].id,
        organizerName: "Carlos Gutierrez",
        maxParticipants: 20,
        requiresApproval: true,
        hasRouteMap: true,
      },
      {
        title: "Central Park Classic Loop",
        description: "Classic NYC cycling experience in Central Park! Multiple loops at a social pace. Tourist-friendly and perfect for visitors wanting to see the city.",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "09:00",
        startLocation: "Central Park, New York, NY",
        startLatitude: "40.7829",
        startLongitude: "-73.9654",
        distance: "18.00",
        duration: "1.75",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: createdUsers[0].id,
        organizerName: "Sarah Martinez",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Blue Ridge Parkway Scenic Tour",
        description: "Breathtaking ride along the famous Blue Ridge Parkway. Rolling hills and incredible fall foliage views. Intermediate riders welcome!",
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "08:30",
        startLocation: "Asheville, NC",
        startLatitude: "35.5951",
        startLongitude: "-82.5515",
        distance: "45.00",
        duration: "3.50",
        difficulty: "intermediate",
        isRecurring: false,
        organizerId: createdUsers[5].id,
        organizerName: "David Wilson",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Chicago Lakefront Trail Cruise",
        description: "Scenic ride along Lake Michigan on the famous Lakefront Trail. Beautiful city skyline views and lake breeze! All levels welcome.",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "10:00",
        startLocation: "Navy Pier, Chicago, IL",
        startLatitude: "41.8917",
        startLongitude: "-87.6086",
        distance: "20.00",
        duration: "2.00",
        difficulty: "easy",
        isRecurring: true,
        recurringType: "weekly",
        organizerId: createdUsers[3].id,
        organizerName: "Alex Thompson",
        requiresApproval: false,
        hasRouteMap: true,
      },
      {
        title: "Napa Valley Wine Country Ride",
        description: "Leisurely ride through beautiful Napa Valley vineyards. Optional wine tasting stops (designated drivers required!). Scenic and social.",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        startTime: "09:30",
        startLocation: "Napa, CA",
        startLatitude: "38.2975",
        startLongitude: "-122.2869",
        distance: "25.00",
        duration: "3.00",
        difficulty: "easy",
        isRecurring: false,
        organizerId: createdUsers[0].id,
        organizerName: "Sarah Martinez",
        maxParticipants: 25,
        requiresApproval: false,
        hasRouteMap: true,
      }
    ];

    for (const ride of sampleRides) {
      await this.createRide(ride);
    }
  }
}

export const storage = new DatabaseStorage();

// Initialize with sample data
storage.seedDatabase().catch(console.error);
