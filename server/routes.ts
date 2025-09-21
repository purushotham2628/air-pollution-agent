import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { aiService } from "./services/aiService";
import { VoiceService } from "./services/voiceService";
import { openWeatherService } from "./services/openWeatherService";
import { insertChatMessageSchema, insertVoiceCommandSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Helper function to get current AQI context
  async function getCurrentAQIContext(location: string = "Bengaluru Central") {
    try {
      const latestReading = await storage.getLatestAQIReading(location);
      
      if (!latestReading) {
        // Fallback mock data if no readings available
        return {
          currentAQI: 125,
          location: location,
          pollutants: {
            pm25: 35,
            pm10: 68,
            co: 1.2,
            o3: 85,
            no2: 42,
            so2: 15
          },
          weather: {
            temperature: 28,
            humidity: 65,
            windSpeed: 12
          },
          timestamp: new Date().toISOString()
        };
      }
      
      return {
        currentAQI: latestReading.aqi,
        location: latestReading.location,
        pollutants: {
          pm25: latestReading.pm25,
          pm10: latestReading.pm10,
          co: latestReading.co,
          o3: latestReading.o3,
          no2: latestReading.no2,
          so2: latestReading.so2
        },
        weather: {
          temperature: latestReading.temperature || 28,
          humidity: latestReading.humidity || 65,
          windSpeed: latestReading.windSpeed || 12
        },
        timestamp: latestReading.timestamp.toISOString()
      };
    } catch (error) {
      console.error('Error getting AQI context:', error);
      // Return fallback data on error
      return {
        currentAQI: 125,
        location: location,
        pollutants: {
          pm25: 35,
          pm10: 68,
          co: 1.2,
          o3: 85,
          no2: 42,
          so2: 15
        },
        weather: {
          temperature: 28,
          humidity: 65,
          windSpeed: 12
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  // AI Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, sessionId, location } = req.body;
      
      if (!message || !sessionId) {
        return res.status(400).json({ error: 'Message and sessionId are required' });
      }

      // Get current AQI context
      const context = await getCurrentAQIContext(location);
      
      // Get chat history for context
      const chatHistory = await storage.getChatHistory(sessionId, 10);
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: msg.timestamp.toISOString()
      }));

      // Get AI response
      const aiResponse = await aiService.getChatResponse(message, context, formattedHistory);

      // Store user message
      await storage.createChatMessage({
        sessionId,
        role: 'user',
        content: message,
        context: context
      });

      // Store AI response
      await storage.createChatMessage({
        sessionId,
        role: 'assistant',
        content: aiResponse,
        context: context
      });

      res.json({ 
        response: aiResponse,
        context: context,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chat API Error:', error);
      res.status(500).json({ error: 'Failed to process chat message' });
    }
  });

  // Voice assistant endpoint
  app.post('/api/voice', async (req, res) => {
    try {
      const { transcript, sessionId, location } = req.body;
      
      if (!transcript || !sessionId) {
        return res.status(400).json({ error: 'Transcript and sessionId are required' });
      }

      // Process voice command
      const { intent, entities, isAQIQuery } = VoiceService.processVoiceCommand(transcript);
      
      if (!isAQIQuery) {
        return res.json({ 
          response: "I'm specialized in air quality questions. Please ask me about AQI, pollution levels, or health recommendations.",
          intent,
          entities
        });
      }

      // Generate optimized voice prompt
      const voicePrompt = VoiceService.generateVoicePrompt(intent, entities, transcript);
      
      // Get current AQI context
      const context = await getCurrentAQIContext(location || entities.location);
      
      // Get voice-optimized response
      const voiceResponse = await aiService.getVoiceResponse(voicePrompt, context);

      // Store voice command
      await storage.createVoiceCommand({
        sessionId,
        transcript,
        intent,
        entities,
        response: voiceResponse
      });

      res.json({ 
        response: voiceResponse,
        intent,
        entities,
        context: context,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Voice API Error:', error);
      res.status(500).json({ error: 'Failed to process voice command' });
    }
  });

  // Get chat history
  app.get('/api/chat/:sessionId', async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { limit } = req.query;
      
      const history = await storage.getChatHistory(sessionId, limit ? parseInt(limit as string) : 50);
      
      res.json({ history });
    } catch (error) {
      console.error('Chat History API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve chat history' });
    }
  });

  // Get current AQI data
  app.get('/api/aqi/:location?', async (req, res) => {
    try {
      const location = req.params.location || 'Bengaluru Central';
      const context = await getCurrentAQIContext(location);
      
      res.json(context);
    } catch (error) {
      console.error('AQI API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve AQI data' });
    }
  });

  // Get AQI history
  app.get('/api/aqi/:location/history', async (req, res) => {
    try {
      const { location } = req.params;
      const { limit } = req.query;
      
      const readings = await storage.getAQIReadings(location, limit ? parseInt(limit as string) : 24);
      
      res.json({ readings });
    } catch (error) {
      console.error('AQI History API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve AQI history' });
    }
  });

  // Multi-city AQI comparison
  app.post('/api/cities/compare', async (req, res) => {
    try {
      const { cities } = req.body;
      
      if (!cities || !Array.isArray(cities) || cities.length === 0) {
        return res.status(400).json({ error: 'Cities array is required' });
      }
      
      if (cities.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 cities allowed' });
      }
      
      const cityData = await openWeatherService.getMultiCityAQI(cities);
      
      // Store the readings in storage for future reference
      for (const data of cityData) {
        try {
          await storage.createAQIReading({
            location: data.location,
            aqi: data.aqi,
            pm25: data.pm25,
            pm10: data.pm10,
            co: data.co,
            o3: data.o3,
            no2: data.no2,
            so2: data.so2,
            temperature: null,
            humidity: null,
            windSpeed: null,
            source: data.source
          });
        } catch (storageError) {
          console.error('Failed to store AQI reading for', data.location, storageError);
        }
      }
      
      res.json({ 
        cities: cityData,
        timestamp: new Date().toISOString(),
        total: cityData.length
      });
    } catch (error) {
      console.error('Multi-city comparison API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve multi-city data' });
    }
  });

  // Real-time weather data for a city
  app.get('/api/weather/:location', async (req, res) => {
    try {
      const { location } = req.params;
      
      const weatherData = await openWeatherService.getWeatherData(location);
      
      res.json(weatherData);
    } catch (error) {
      console.error('Weather API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve weather data' });
    }
  });

  // Get list of supported cities
  app.get('/api/cities/supported', async (req, res) => {
    try {
      const cities = openWeatherService.getSupportedCities();
      res.json({ cities });
    } catch (error) {
      console.error('Supported Cities API Error:', error);
      res.status(500).json({ error: 'Failed to retrieve supported cities' });
    }
  });

  const httpServer = createServer(app);

  // WebSocket Server for IoT real-time data streaming
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const connectedClients = new Set<WebSocket>();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection established');
    connectedClients.add(ws);
    
    // Send welcome message with current IoT device status
    ws.send(JSON.stringify({
      type: 'connection',
      status: 'connected',
      timestamp: new Date().toISOString(),
      message: 'Connected to AirWatch IoT stream'
    }));
    
    // Handle incoming messages from IoT devices or clients
    ws.on('message', async (message: string) => {
      try {
        const data = JSON.parse(message);
        
        if (data.type === 'iot_reading') {
          // Store IoT sensor reading
          await storage.createIoTReading({
            deviceId: data.deviceId,
            location: data.location,
            pm25: data.pm25,
            pm10: data.pm10,
            temperature: data.temperature,
            humidity: data.humidity,
            batteryLevel: data.batteryLevel,
            signalStrength: data.signalStrength
          });
          
          // Broadcast to all connected clients
          broadcastToClients({
            type: 'iot_update',
            deviceId: data.deviceId,
            location: data.location,
            data: data,
            timestamp: new Date().toISOString()
          });
        } else if (data.type === 'subscribe') {
          // Handle subscription to specific device or location
          ws.send(JSON.stringify({
            type: 'subscription_confirmed',
            subscription: data.subscription,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format',
          timestamp: new Date().toISOString()
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
      connectedClients.delete(ws);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      connectedClients.delete(ws);
    });
  });
  
  // Function to broadcast data to all connected clients
  function broadcastToClients(data: any) {
    const message = JSON.stringify(data);
    connectedClients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Simulate IoT data for demo purposes (remove in production)
  setInterval(() => {
    const mockDevices = [
      { id: 'iot-bengaluru-001', location: 'Bengaluru Central' },
      { id: 'iot-bengaluru-002', location: 'Whitefield' },
      { id: 'iot-bengaluru-003', location: 'Electronic City' }
    ];
    
    mockDevices.forEach(device => {
      const mockReading = {
        type: 'iot_reading',
        deviceId: device.id,
        location: device.location,
        pm25: 25 + Math.random() * 50,
        pm10: 45 + Math.random() * 70,
        temperature: 25 + Math.random() * 8,
        humidity: 55 + Math.random() * 25,
        batteryLevel: 70 + Math.random() * 30,
        signalStrength: 60 + Math.random() * 40,
        timestamp: new Date().toISOString()
      };
      
      // Broadcast mock IoT data
      broadcastToClients({
        type: 'iot_update',
        deviceId: device.id,
        location: device.location,
        data: mockReading,
        timestamp: new Date().toISOString()
      });
    });
  }, 30000); // Send mock data every 30 seconds

  return httpServer;
}