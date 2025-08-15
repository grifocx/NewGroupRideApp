import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertRideParticipantSchema, insertUserSchema, type User } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { db } from "./db";

// Extend session to include user
declare module "express-session" {
  interface SessionData {
    user?: User;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // PostgreSQL session store
  const PgSession = connectPgSimple(session);
  
  // Session middleware with PostgreSQL storage
  // Detect if running on Replit
  const isReplit = process.env.REPLIT_DOMAINS || process.env.REPL_ID;
  
  // For Replit, we need secure: true with sameSite: 'none' for cross-origin cookies to work
  const cookieSettings = isReplit ? {
    secure: true, // Required for sameSite: 'none' 
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'none' as const, // Required for cross-origin on Replit
    domain: undefined // Let browser handle domain automatically
  } : {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax' as const
  };

  app.use(session({
    store: new PgSession({
      conObject: {
        connectionString: process.env.DATABASE_URL,
      },
      tableName: 'session', // Use 'session' table for sessions
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET || "cycle-connect-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: cookieSettings,
    name: 'cycle.sid' // Custom session cookie name for clarity
  }));
  
  console.log("=== SESSION CONFIG ===");
  console.log("Environment:", isReplit ? "Replit" : "Local");
  console.log("Cookie settings:", cookieSettings);
  console.log("REPLIT_DOMAINS:", process.env.REPLIT_DOMAINS);
  console.log("=== END SESSION CONFIG ===");

  // Add session debugging middleware
  app.use((req, res, next) => {
    console.log('--- Session Debug ---');
    console.log('Session ID:', req.sessionID);
    console.log('Session exists:', !!req.session);
    console.log('Session user:', req.session.user ? req.session.user.username : 'No user');
    console.log('Request cookies:', req.headers.cookie);
    console.log('User-Agent:', req.headers['user-agent']?.slice(0, 50) + '...');
    console.log('--- End Session Debug ---');
    next();
  });

  // Auth middleware to check if user is logged in
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const user = await storage.createUser(validatedData);
      req.session.user = user;
      
      // Explicitly save the session
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        console.log("Session saved successfully for user:", user.username);
        res.status(201).json(user);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.authenticateUser(email, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.user = user;
      
      // Explicitly save the session
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save failed" });
        }
        console.log("=== LOGIN SUCCESS ===");
        console.log("Session saved successfully for user:", user.username);
        console.log("Session ID after login:", req.sessionID);
        console.log("Session cookie will be set with name: cycle.sid");
        console.log("Cookie settings:", cookieSettings);
        console.log("Setting response headers for cookie...");
        
        // Set response headers to help debug cookie setting
        res.setHeader('Set-Cookie-Debug', `cycle.sid=${req.sessionID}; Max-Age=86400; HttpOnly; ${cookieSettings.secure ? 'Secure; ' : ''}SameSite=${cookieSettings.sameSite}`);
        console.log("=== END LOGIN SUCCESS ===");
        res.json(user);
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    console.log("=== AUTH CHECK ===");
    console.log("Session ID:", req.sessionID);
    console.log("Session user:", req.session.user ? req.session.user.username : "No user");
    console.log("All session data:", req.session);
    console.log("Request origin:", req.headers.origin);
    console.log("Request referer:", req.headers.referer);
    console.log("=== END AUTH CHECK ===");
    
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch("/api/users/:id", requireAuth, async (req, res) => {
    try {
      // Users can only update their own profile
      if (req.session.user!.id !== req.params.id) {
        return res.status(403).json({ message: "Can only update your own profile" });
      }

      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update session with new user data
      req.session.user = user;
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  // Get all rides with optional filters
  app.get("/api/rides", async (req, res) => {
    try {
      const filters = {
        difficulty: req.query.difficulty as string,
        date: req.query.date as string,
        location: req.query.location as string,
        search: req.query.search as string,
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );
      
      const rides = await storage.getRides(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(rides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch rides" });
    }
  });

  // Get single ride
  app.get("/api/rides/:id", async (req, res) => {
    try {
      const ride = await storage.getRide(req.params.id);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ride" });
    }
  });

  // Create new ride
  app.post("/api/rides", requireAuth, async (req, res) => {
    try {
      const validatedData = insertRideSchema.parse({
        ...req.body,
        organizerId: req.session.user!.id
      });
      const ride = await storage.createRide(validatedData);
      res.status(201).json(ride);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ride data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ride" });
    }
  });

  // Update ride
  app.patch("/api/rides/:id", requireAuth, async (req, res) => {
    try {
      const existingRide = await storage.getRide(req.params.id);
      if (!existingRide) {
        return res.status(404).json({ message: "Ride not found" });
      }
      
      // Only the organizer can update the ride
      if (existingRide.organizerId !== req.session.user!.id) {
        return res.status(403).json({ message: "Only the ride organizer can update this ride" });
      }

      const ride = await storage.updateRide(req.params.id, req.body);
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ride" });
    }
  });

  // Delete ride
  app.delete("/api/rides/:id", requireAuth, async (req, res) => {
    try {
      const existingRide = await storage.getRide(req.params.id);
      if (!existingRide) {
        return res.status(404).json({ message: "Ride not found" });
      }
      
      // Only the organizer can delete the ride
      if (existingRide.organizerId !== req.session.user!.id) {
        return res.status(403).json({ message: "Only the ride organizer can delete this ride" });
      }

      const success = await storage.deleteRide(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Ride not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ride" });
    }
  });

  // Get ride participants
  app.get("/api/rides/:id/participants", async (req, res) => {
    try {
      const participants = await storage.getRideParticipants(req.params.id);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });

  // Join ride
  app.post("/api/rides/:id/join", async (req, res) => {
    try {
      const validatedData = insertRideParticipantSchema.parse({
        ...req.body,
        rideId: req.params.id,
      });
      const participant = await storage.joinRide(validatedData);
      res.status(201).json(participant);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid participant data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to join ride" });
    }
  });

  // Leave ride
  app.delete("/api/rides/:rideId/participants/:participantId", async (req, res) => {
    try {
      const success = await storage.leaveRide(req.params.rideId, req.params.participantId);
      if (!success) {
        return res.status(404).json({ message: "Participant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to leave ride" });
    }
  });

  // Geocoding endpoint using Nominatim
  app.get("/api/geocode", async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query) {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query as string)}&limit=5`
      );
      
      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Geocoding failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
