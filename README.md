# Bengaluru Air Quality Monitoring & Pollution Prediction Agent

An advanced AI-powered air quality monitoring system specifically designed for Bengaluru, India. This application provides real-time AQI data, pollution predictions using machine learning, comprehensive health advisories, and features an interactive dashboard with voice-enabled AI assistance.

![Dashboard Preview](https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🌟 Features

### 🔴 Core Functionality
- **Real-time AQI Monitoring**: Live air quality data from OpenWeather API
- **Multi-City Comparison**: Compare AQI across major Indian cities
- **Health Advisory System**: AI-powered health recommendations based on current conditions
- **Voice Assistant**: Speech recognition and text-to-speech for hands-free interaction
- **IoT Device Integration**: Real-time sensor data streaming via WebSocket
- **Historical Data Tracking**: Store and analyze pollution trends over time

### 🤖 AI & Machine Learning
- **GPT-5 Integration**: Advanced natural language processing for air quality queries
- **Predictive Analytics**: Time-series forecasting for pollution levels (planned)
- **Anomaly Detection**: Identify sudden pollution spikes (planned)
- **Voice Command Processing**: Intent recognition and entity extraction

### 📊 Data Visualization
- **Interactive Charts**: Real-time AQI trends with Recharts
- **Pollutant Breakdown**: Individual pollutant level monitoring (PM2.5, PM10, CO, O₃, NO₂, SO₂)
- **Weather Integration**: Temperature, humidity, wind speed correlation
- **Mobile-Responsive Design**: Optimized for all device sizes

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **TanStack Query** for data management
- **Wouter** for routing

### Backend Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **WebSocket** for real-time communication
- **Drizzle ORM** with PostgreSQL support
- **Better-sqlite3** for development storage

### External Services
- **OpenWeather API**: Real-time weather and AQI data
- **OpenAI GPT-5**: AI chatbot and voice processing
- **Web Speech API**: Browser-based voice recognition

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **OpenWeather API Key** (free at [openweathermap.org](https://openweathermap.org/api))
- **OpenAI API Key** (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd air-pollution-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   OPENWEATHER_API_KEY=your_actual_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## 🔧 Configuration

### OpenWeather API Setup
1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env` file as `OPENWEATHER_API_KEY`

### OpenAI API Setup (Optional)
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

### Database Setup (Optional)
By default, the application uses in-memory storage. For production:

1. **PostgreSQL Setup**
   ```bash
   # Install PostgreSQL and create database
   createdb airquality
   ```

2. **Update environment**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/airquality
   ```

3. **Run migrations**
   ```bash
   npm run db:push
   ```

## 🎯 Usage Guide

### Dashboard Navigation
- **Dashboard**: Main overview with current AQI, weather, and trends
- **Air Quality**: Detailed pollutant analysis
- **Health Advisory**: Personalized health recommendations
- **Notifications**: Real-time alerts and updates
- **Map View**: Geographical pollution visualization (coming soon)
- **Export Data**: Download historical data

### AI Assistant Features
- **Text Chat**: Ask questions about air quality
- **Voice Commands**: Use speech recognition (Chrome/Edge)
- **Natural Language**: "Is it safe to exercise outside?"
- **Contextual Responses**: AI considers current conditions

### Voice Commands Examples
- "What's the current AQI in Bengaluru?"
- "Should I wear a mask today?"
- "Is it safe for children to play outside?"
- "How's the air quality compared to yesterday?"

## 🧠 Machine Learning Models

### Current Implementation
- **Intent Classification**: Rule-based NLP for voice command processing
- **Entity Extraction**: Location and time entity recognition
- **GPT-5 Integration**: Advanced language model for conversational AI

### Planned ML Features
- **LSTM/GRU Models**: Time-series forecasting for AQI prediction
- **Anomaly Detection**: Statistical models to identify pollution spikes
- **Ensemble Methods**: Combine multiple models for better accuracy
- **Transfer Learning**: Adapt models for different Indian cities

### Data Processing Pipeline
1. **Data Collection**: OpenWeather API + IoT sensors
2. **Data Cleaning**: Handle missing values and outliers
3. **Feature Engineering**: Weather correlation, temporal features
4. **Model Training**: Periodic retraining with new data
5. **Prediction**: Real-time inference for forecasting

## 📊 API Endpoints

### Air Quality Data
```
GET /api/aqi/:location          # Current AQI for location
GET /api/aqi/:location/history  # Historical AQI data
POST /api/cities/compare        # Multi-city comparison
```

### AI Assistant
```
POST /api/chat                  # Text-based chat
POST /api/voice                 # Voice command processing
GET /api/chat/:sessionId        # Chat history
```

### Weather Data
```
GET /api/weather/:location      # Current weather data
GET /api/cities/supported       # Supported cities list
```

## 🔌 WebSocket Integration

Real-time features via WebSocket connection:

```javascript
const ws = new WebSocket('ws://localhost:5000/ws');

// Subscribe to IoT updates
ws.send(JSON.stringify({
  type: 'subscribe',
  subscription: 'iot_readings'
}));

// Receive real-time data
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === 'iot_update') {
    // Handle IoT sensor data
  }
};
```

## 🏗️ Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express backend
│   ├── routes.ts          # API route definitions
│   ├── services/          # Business logic services
│   └── storage.ts         # Data persistence layer
├── shared/                # Shared types and schemas
└── migrations/            # Database migrations
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
npm run db:push      # Push database schema changes
```

### Adding New Features

1. **Frontend Components**: Add to `client/src/components/`
2. **API Routes**: Extend `server/routes.ts`
3. **Database Schema**: Update `shared/schema.ts`
4. **Services**: Add business logic to `server/services/`

## 🧪 Testing

### Manual Testing Checklist
- [ ] Dashboard loads with mock data
- [ ] AI chatbot responds to queries
- [ ] Voice recognition works (Chrome/Edge)
- [ ] Multi-city comparison functions
- [ ] WebSocket connection establishes
- [ ] Theme switching works
- [ ] Mobile responsive design

### API Testing
```bash
# Test AQI endpoint
curl http://localhost:5000/api/aqi/bengaluru

# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the current AQI?","sessionId":"test"}'
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
OPENWEATHER_API_KEY=your_production_key
OPENAI_API_KEY=your_production_key
DATABASE_URL=your_production_database_url
SESSION_SECRET=your_secure_session_secret
```

### Docker Deployment (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🔒 Security Considerations

- API keys stored in environment variables
- Session-based authentication ready
- Input validation with Zod schemas
- CORS configuration for production
- Rate limiting recommended for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**"Failed to fetch AQI data"**
- Check your OpenWeather API key in `.env`
- Verify internet connection
- Check API quota limits

**"AI Assistant not responding"**
- Verify OpenAI API key is set
- Check API quota and billing
- Fallback responses should still work

**"Voice recognition not working"**
- Use Chrome or Edge browser
- Allow microphone permissions
- Check HTTPS requirement for production

**"WebSocket connection failed"**
- Ensure port 5000 is not blocked
- Check firewall settings
- Verify server is running

### Getting Help

- Check the [Issues](https://github.com/your-repo/issues) page
- Review API documentation
- Check browser console for errors
- Verify environment variable setup

## 🔮 Roadmap

### Phase 1 (Current)
- [x] Real-time AQI monitoring
- [x] AI chatbot integration
- [x] Voice assistant
- [x] Multi-city comparison
- [x] WebSocket IoT integration

### Phase 2 (Planned)
- [ ] Machine learning prediction models
- [ ] Map visualization with Leaflet
- [ ] Email/SMS notifications
- [ ] User authentication system
- [ ] Data export functionality

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Integration with government AQI APIs
- [ ] Community reporting features
- [ ] Predictive health recommendations

---

**Built with ❤️ for cleaner air in Bengaluru**

For questions or support, please open an issue or contact the development team.