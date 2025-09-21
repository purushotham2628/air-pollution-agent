// Voice service for speech recognition and text-to-speech functionality

export interface VoiceCommand {
  transcript: string;
  confidence: number;
  timestamp: string;
}

export interface SpeechSynthesisRequest {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

export class VoiceService {
  // Process speech recognition results on the frontend
  static processVoiceCommand(transcript: string): {
    intent: string;
    entities: Record<string, any>;
    isAQIQuery: boolean;
  } {
    const lowercaseTranscript = transcript.toLowerCase();
    
    // Common AQI-related keywords
    const aqiKeywords = ['aqi', 'air quality', 'pollution', 'pm2.5', 'pm10', 'ozone', 'smog'];
    const locationKeywords = ['bengaluru', 'bangalore', 'whitefield', 'koramangala', 'electronic city'];
    const timeKeywords = ['today', 'tomorrow', 'tonight', 'morning', 'evening', 'afternoon'];
    const actionKeywords = ['should i', 'can i', 'is it safe', 'wear mask', 'go outside', 'exercise'];
    
    const isAQIQuery = aqiKeywords.some(keyword => lowercaseTranscript.includes(keyword));
    
    let intent = 'general_query';
    const entities: Record<string, any> = {};
    
    // Determine intent
    if (lowercaseTranscript.includes('what') && isAQIQuery) {
      intent = 'aqi_status';
    } else if (timeKeywords.some(time => lowercaseTranscript.includes(time)) && isAQIQuery) {
      intent = 'aqi_forecast';
    } else if (actionKeywords.some(action => lowercaseTranscript.includes(action))) {
      intent = 'health_advice';
    } else if (locationKeywords.some(loc => lowercaseTranscript.includes(loc))) {
      intent = 'location_aqi';
    }
    
    // Extract entities
    locationKeywords.forEach(location => {
      if (lowercaseTranscript.includes(location)) {
        entities.location = location;
      }
    });
    
    timeKeywords.forEach(time => {
      if (lowercaseTranscript.includes(time)) {
        entities.timeframe = time;
      }
    });
    
    return {
      intent,
      entities,
      isAQIQuery
    };
  }
  
  static generateVoicePrompt(intent: string, entities: Record<string, any>, originalQuery: string): string {
    const location = entities.location || 'Bengaluru';
    const timeframe = entities.timeframe || 'now';
    
    switch (intent) {
      case 'aqi_status':
        return `What is the current air quality in ${location}?`;
      case 'aqi_forecast':
        return `What will the air quality be like ${timeframe} in ${location}?`;
      case 'health_advice':
        return `Is it safe to go outside ${timeframe} given the current air quality in ${location}?`;
      case 'location_aqi':
        return `How is the air quality in ${location} right now?`;
      default:
        return originalQuery;
    }
  }
}

export const voiceService = new VoiceService();