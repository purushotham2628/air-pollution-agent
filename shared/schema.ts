import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Air Quality Data Schema
export const aqiReadings = pgTable("aqi_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  aqi: integer("aqi").notNull(),
  pm25: real("pm25").notNull(),
  pm10: real("pm10").notNull(),
  co: real("co").notNull(),
  o3: real("o3").notNull(),
  no2: real("no2").notNull(),
  so2: real("so2").notNull(),
  temperature: real("temperature"),
  humidity: real("humidity"),
  windSpeed: real("wind_speed"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  source: text("source").default("openweather"),
});

// Chat Messages Schema
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  context: json("context"), // Store AQI context used for the response
});

// IoT Device Readings Schema
export const iotReadings = pgTable("iot_readings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: varchar("device_id").notNull(),
  location: text("location").notNull(),
  pm25: real("pm25"),
  pm10: real("pm10"),
  temperature: real("temperature"),
  humidity: real("humidity"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  batteryLevel: real("battery_level"),
  signalStrength: real("signal_strength"),
});

// Voice Commands Schema
export const voiceCommands = pgTable("voice_commands", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  transcript: text("transcript").notNull(),
  intent: text("intent").notNull(),
  entities: json("entities"),
  response: text("response"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAQIReadingSchema = createInsertSchema(aqiReadings).omit({
  id: true,
  timestamp: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertIoTReadingSchema = createInsertSchema(iotReadings).omit({
  id: true,
  timestamp: true,
});

export const insertVoiceCommandSchema = createInsertSchema(voiceCommands).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type AQIReading = typeof aqiReadings.$inferSelect;
export type InsertAQIReading = z.infer<typeof insertAQIReadingSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type IoTReading = typeof iotReadings.$inferSelect;
export type InsertIoTReading = z.infer<typeof insertIoTReadingSchema>;

export type VoiceCommand = typeof voiceCommands.$inferSelect;
export type InsertVoiceCommand = z.infer<typeof insertVoiceCommandSchema>;
