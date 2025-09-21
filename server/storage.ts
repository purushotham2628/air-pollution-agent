import { 
  type User, 
  type InsertUser,
  type AQIReading,
  type InsertAQIReading,
  type ChatMessage,
  type InsertChatMessage,
  type IoTReading,
  type InsertIoTReading,
  type VoiceCommand,
  type InsertVoiceCommand
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // AQI Reading methods
  createAQIReading(reading: InsertAQIReading): Promise<AQIReading>;
  getLatestAQIReading(location: string): Promise<AQIReading | undefined>;
  getAQIReadings(location: string, limit?: number): Promise<AQIReading[]>;
  getAQIReadingsByTimeRange(location: string, startTime: Date, endTime: Date): Promise<AQIReading[]>;
  
  // Chat Message methods
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  
  // IoT Reading methods
  createIoTReading(reading: InsertIoTReading): Promise<IoTReading>;
  getLatestIoTReadings(deviceId: string): Promise<IoTReading | undefined>;
  getIoTReadingsByDevice(deviceId: string, limit?: number): Promise<IoTReading[]>;
  
  // Voice Command methods
  createVoiceCommand(command: InsertVoiceCommand): Promise<VoiceCommand>;
  getVoiceHistory(sessionId: string, limit?: number): Promise<VoiceCommand[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private aqiReadings: Map<string, AQIReading>;
  private chatMessages: Map<string, ChatMessage>;
  private iotReadings: Map<string, IoTReading>;
  private voiceCommands: Map<string, VoiceCommand>;

  constructor() {
    this.users = new Map();
    this.aqiReadings = new Map();
    this.chatMessages = new Map();
    this.iotReadings = new Map();
    this.voiceCommands = new Map();
    
    // Initialize with some mock AQI data for immediate functionality
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockAQIReading: AQIReading = {
      id: randomUUID(),
      location: "Bengaluru Central",
      aqi: 125,
      pm25: 35,
      pm10: 68,
      co: 1.2,
      o3: 85,
      no2: 42,
      so2: 15,
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      timestamp: new Date(),
      source: "openweather"
    };
    this.aqiReadings.set(mockAQIReading.id, mockAQIReading);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // AQI Reading methods
  async createAQIReading(insertReading: InsertAQIReading): Promise<AQIReading> {
    const id = randomUUID();
    const reading: AQIReading = { 
      ...insertReading, 
      id, 
      timestamp: new Date(),
      source: insertReading.source || "openweather",
      temperature: insertReading.temperature ?? null,
      humidity: insertReading.humidity ?? null,
      windSpeed: insertReading.windSpeed ?? null
    };
    this.aqiReadings.set(id, reading);
    return reading;
  }

  async getLatestAQIReading(location: string): Promise<AQIReading | undefined> {
    const readings = Array.from(this.aqiReadings.values())
      .filter(r => r.location.toLowerCase().includes(location.toLowerCase()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return readings[0];
  }

  async getAQIReadings(location: string, limit: number = 24): Promise<AQIReading[]> {
    return Array.from(this.aqiReadings.values())
      .filter(r => r.location.toLowerCase().includes(location.toLowerCase()))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async getAQIReadingsByTimeRange(location: string, startTime: Date, endTime: Date): Promise<AQIReading[]> {
    return Array.from(this.aqiReadings.values())
      .filter(r => 
        r.location.toLowerCase().includes(location.toLowerCase()) &&
        r.timestamp >= startTime &&
        r.timestamp <= endTime
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Chat Message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      context: insertMessage.context || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(m => m.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-limit);
  }

  // IoT Reading methods
  async createIoTReading(insertReading: InsertIoTReading): Promise<IoTReading> {
    const id = randomUUID();
    const reading: IoTReading = { 
      ...insertReading, 
      id, 
      timestamp: new Date(),
      pm25: insertReading.pm25 ?? null,
      pm10: insertReading.pm10 ?? null,
      temperature: insertReading.temperature ?? null,
      humidity: insertReading.humidity ?? null,
      batteryLevel: insertReading.batteryLevel ?? null,
      signalStrength: insertReading.signalStrength ?? null
    };
    this.iotReadings.set(id, reading);
    return reading;
  }

  async getLatestIoTReadings(deviceId: string): Promise<IoTReading | undefined> {
    const readings = Array.from(this.iotReadings.values())
      .filter(r => r.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return readings[0];
  }

  async getIoTReadingsByDevice(deviceId: string, limit: number = 100): Promise<IoTReading[]> {
    return Array.from(this.iotReadings.values())
      .filter(r => r.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Voice Command methods
  async createVoiceCommand(insertCommand: InsertVoiceCommand): Promise<VoiceCommand> {
    const id = randomUUID();
    const command: VoiceCommand = { 
      ...insertCommand, 
      id, 
      timestamp: new Date(),
      entities: insertCommand.entities || null,
      response: insertCommand.response ?? null
    };
    this.voiceCommands.set(id, command);
    return command;
  }

  async getVoiceHistory(sessionId: string, limit: number = 20): Promise<VoiceCommand[]> {
    return Array.from(this.voiceCommands.values())
      .filter(c => c.sessionId === sessionId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
