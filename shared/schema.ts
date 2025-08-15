import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const rides = pgTable("rides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: text("start_time").notNull(),
  startLocation: text("start_location").notNull(),
  startLatitude: decimal("start_latitude", { precision: 10, scale: 8 }),
  startLongitude: decimal("start_longitude", { precision: 11, scale: 8 }),
  distance: decimal("distance", { precision: 6, scale: 2 }),
  duration: decimal("duration", { precision: 4, scale: 2 }),
  difficulty: text("difficulty", { enum: ["easy", "intermediate", "advanced"] }).notNull(),
  isRecurring: boolean("is_recurring").default(false),
  recurringType: text("recurring_type", { enum: ["weekly", "monthly", "custom"] }),
  maxParticipants: integer("max_participants"),
  requiresApproval: boolean("requires_approval").default(false),
  hasRouteMap: boolean("has_route_map").default(false),
  organizerId: varchar("organizer_id").notNull(),
  organizerName: text("organizer_name").notNull(),
  participantCount: integer("participant_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const rideParticipants = pgTable("ride_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rideId: varchar("ride_id").notNull().references(() => rides.id),
  participantId: varchar("participant_id").notNull(),
  participantName: text("participant_name").notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const insertRideSchema = createInsertSchema(rides).omit({
  id: true,
  createdAt: true,
  participantCount: true,
}).extend({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  startLocation: z.string().min(1, "Start location is required"),
  difficulty: z.enum(["easy", "intermediate", "advanced"]),
});

export const insertRideParticipantSchema = createInsertSchema(rideParticipants).omit({
  id: true,
  joinedAt: true,
});

export type InsertRide = z.infer<typeof insertRideSchema>;
export type Ride = typeof rides.$inferSelect;
export type InsertRideParticipant = z.infer<typeof insertRideParticipantSchema>;
export type RideParticipant = typeof rideParticipants.$inferSelect;
