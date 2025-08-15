import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRideSchema, insertRideParticipantSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.post("/api/rides", async (req, res) => {
    try {
      const validatedData = insertRideSchema.parse(req.body);
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
  app.patch("/api/rides/:id", async (req, res) => {
    try {
      const ride = await storage.updateRide(req.params.id, req.body);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      res.json(ride);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ride" });
    }
  });

  // Delete ride
  app.delete("/api/rides/:id", async (req, res) => {
    try {
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
