import OpenAI from "openai";

// Initialize OpenAI client with error handling
const openai = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo' 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface AQIContext {
  currentAQI: number;
  location: string;
  pollutants: {
    pm25: number;
    pm10: number;
    co: number;
    o3: number;
    no2: number;
    so2: number;
  };
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
  };
  timestamp: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export class AIService {
  private getSystemPrompt(context: AQIContext): string {
    return `You are AirWatch AI, an expert air quality assistant for Bengaluru, India. You provide accurate, helpful information about air pollution, health impacts, and safety recommendations.

Current Air Quality Context:
- Location: ${context.location}
- Current AQI: ${context.currentAQI}
- PM2.5: ${context.pollutants.pm25} μg/m³
- PM10: ${context.pollutants.pm10} μg/m³
- CO: ${context.pollutants.co} mg/m³
- O₃: ${context.pollutants.o3} μg/m³
- NO₂: ${context.pollutants.no2} μg/m³
- SO₂: ${context.pollutants.so2} μg/m³
- Temperature: ${context.weather.temperature}°C
- Humidity: ${context.weather.humidity}%
- Wind Speed: ${context.weather.windSpeed} km/h
- Last Updated: ${context.timestamp}

AQI Categories:
- 0-50: Good (Green)
- 51-100: Moderate (Yellow) 
- 101-150: Unhealthy for Sensitive Groups (Orange)
- 151-200: Unhealthy (Red)
- 201-300: Very Unhealthy (Purple)
- 301+: Hazardous (Maroon)

Guidelines:
1. Provide specific, actionable advice based on current conditions
2. Explain health impacts clearly for different groups (children, elderly, people with respiratory conditions)
3. Give timing recommendations (e.g., "air quality is usually better in early morning")
4. Suggest protective measures when needed (masks, indoor activities, air purifiers)
5. Be conversational but authoritative
6. Use the current data in your responses
7. For prediction questions, explain that you're providing estimates based on patterns and current conditions

Avoid:
- Medical diagnoses or treatment advice
- Overly technical jargon
- Speculation beyond reasonable air quality patterns`;
  }

  async getChatResponse(
    userMessage: string, 
    context: AQIContext, 
    chatHistory: ChatMessage[] = []
  ): Promise<string> {
    // Return mock response if OpenAI is not configured
    if (!openai) {
      return this.getMockChatResponse(userMessage, context);
    }

    try {
      const systemPrompt = this.getSystemPrompt(context);
      
      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...chatHistory.slice(-10).map(msg => ({ // Keep last 10 messages for context
          role: msg.role,
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        max_tokens: 1000,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getMockChatResponse(userMessage, context);
    }
  }

  async getVoiceResponse(userMessage: string, context: AQIContext): Promise<string> {
    // Return mock response if OpenAI is not configured
    if (!openai) {
      return this.getMockVoiceResponse(userMessage, context);
    }

    try {
      const systemPrompt = `You are AirWatch AI voice assistant. Provide concise, spoken responses about air quality in Bengaluru. Keep responses under 100 words and conversational for voice delivery.

Current Context:
- AQI: ${context.currentAQI} (${this.getAQICategory(context.currentAQI)})
- Location: ${context.location}
- Primary concern: ${this.getPrimaryConcern(context.pollutants)}

Format for voice: Short, clear sentences. No complex data unless specifically asked.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 200,
      });

      return response.choices[0].message.content || "I couldn't process that request.";
    } catch (error) {
      console.error('Voice AI Error:', error);
      return this.getMockVoiceResponse(userMessage, context);
    }
  }

  private getAQICategory(aqi: number): string {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    if (aqi <= 200) return "Unhealthy";
    if (aqi <= 300) return "Very Unhealthy";
    return "Hazardous";
  }

  private getPrimaryConcern(pollutants: AQIContext['pollutants']): string {
    const concerns = [];
    if (pollutants.pm25 > 25) concerns.push("PM2.5");
    if (pollutants.pm10 > 50) concerns.push("PM10");
    if (pollutants.co > 2) concerns.push("Carbon Monoxide");
    if (pollutants.o3 > 100) concerns.push("Ozone");
    if (pollutants.no2 > 40) concerns.push("Nitrogen Dioxide");
    if (pollutants.so2 > 20) concerns.push("Sulfur Dioxide");
    
    return concerns.length > 0 ? concerns.join(", ") : "No major concerns";
  }

  private getMockChatResponse(userMessage: string, context: AQIContext): string {
    const lowerMessage = userMessage.toLowerCase();
    const aqi = context.currentAQI;
    const category = this.getAQICategory(aqi);
    
    if (lowerMessage.includes('aqi') || lowerMessage.includes('air quality')) {
      return `The current AQI in ${context.location} is ${aqi}, which is considered ${category}. ${this.getHealthAdvice(aqi)}`;
    }
    
    if (lowerMessage.includes('safe') || lowerMessage.includes('outside') || lowerMessage.includes('exercise')) {
      if (aqi <= 100) {
        return `With an AQI of ${aqi} (${category}), it's generally safe for outdoor activities. However, sensitive individuals should still be cautious.`;
      } else if (aqi <= 150) {
        return `The AQI is ${aqi} (${category}). Sensitive groups should limit outdoor activities. Consider wearing a mask if you must go outside.`;
      } else {
        return `The AQI is ${aqi} (${category}). I recommend staying indoors and avoiding outdoor exercise. If you must go outside, wear an N95 mask.`;
      }
    }
    
    if (lowerMessage.includes('mask')) {
      return aqi > 100 ? 
        `Yes, I recommend wearing an N95 mask when going outside. The current AQI of ${aqi} indicates ${category} air quality.` :
        `With the current AQI of ${aqi} (${category}), a mask isn't strictly necessary, but sensitive individuals may still benefit from wearing one.`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('temperature')) {
      return `Current weather in ${context.location}: ${context.weather.temperature}°C, ${context.weather.humidity}% humidity, wind speed ${context.weather.windSpeed} km/h. The AQI is ${aqi} (${category}).`;
    }
    
    return `I'm here to help with air quality questions for ${context.location}. The current AQI is ${aqi} (${category}). You can ask me about safety recommendations, pollution levels, or health advice.`;
  }

  private getMockVoiceResponse(userMessage: string, context: AQIContext): string {
    const lowerMessage = userMessage.toLowerCase();
    const aqi = context.currentAQI;
    const category = this.getAQICategory(aqi);
    
    if (lowerMessage.includes('aqi') || lowerMessage.includes('air quality')) {
      return `The AQI is ${aqi}, which is ${category}.`;
    }
    
    if (lowerMessage.includes('safe') || lowerMessage.includes('outside')) {
      return aqi <= 100 ? 
        `It's generally safe to go outside with an AQI of ${aqi}.` :
        `With an AQI of ${aqi}, I recommend limiting outdoor activities.`;
    }
    
    if (lowerMessage.includes('mask')) {
      return aqi > 100 ? 
        `Yes, wear a mask. The AQI is ${aqi}.` :
        `A mask isn't necessary right now. AQI is ${aqi}.`;
    }
    
    return `The current AQI is ${aqi}, which is ${category}. How can I help you?`;
  }

  private getHealthAdvice(aqi: number): string {
    if (aqi <= 50) return "Air quality is good. Perfect for outdoor activities.";
    if (aqi <= 100) return "Air quality is moderate. Generally safe for most people.";
    if (aqi <= 150) return "Sensitive groups should limit outdoor activities.";
    if (aqi <= 200) return "Everyone should limit outdoor activities and wear masks.";
    if (aqi <= 300) return "Avoid outdoor activities. Stay indoors with air purifiers.";
    return "Hazardous conditions. Avoid all outdoor activities.";
  }
}

export const aiService = new AIService();