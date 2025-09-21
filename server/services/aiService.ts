import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
        model: "gpt-5",
        messages,
        max_completion_tokens: 1000,
      });

      return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  async getVoiceResponse(userMessage: string, context: AQIContext): Promise<string> {
    try {
      const systemPrompt = `You are AirWatch AI voice assistant. Provide concise, spoken responses about air quality in Bengaluru. Keep responses under 100 words and conversational for voice delivery.

Current Context:
- AQI: ${context.currentAQI} (${this.getAQICategory(context.currentAQI)})
- Location: ${context.location}
- Primary concern: ${this.getPrimaryConcern(context.pollutants)}

Format for voice: Short, clear sentences. No complex data unless specifically asked.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_completion_tokens: 200,
      });

      return response.choices[0].message.content || "I couldn't process that request.";
    } catch (error) {
      console.error('Voice AI Error:', error);
      return "Sorry, I'm having trouble right now. Please try again.";
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
}

export const aiService = new AIService();