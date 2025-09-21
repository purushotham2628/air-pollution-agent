# Bengaluru Air Quality Monitoring & Pollution Prediction Agent

## Overview

This is an advanced AI-powered air quality monitoring system specifically designed for Bengaluru, India. The application provides real-time AQI data, pollution predictions using machine learning, and comprehensive health advisories. It integrates with the OpenWeather API for live environmental data and features an interactive dashboard with voice-enabled AI assistance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React and TypeScript using Vite as the build tool. The component library is based on Radix UI primitives with shadcn/ui styling, providing a consistent and accessible user interface. The application uses Wouter for client-side routing and TanStack Query for efficient data management and caching.

**Key Design Decisions:**
- **Component-based architecture**: Modular components for AQI cards, charts, health advisories, and notifications
- **Responsive design**: Mobile-first approach with Tailwind CSS for styling
- **Dark/Light theme support**: User preference-based theme switching with CSS variables
- **Real-time updates**: Live data refreshing with WebSocket support for instant notifications

### Backend Architecture
The server is built with Express.js and TypeScript, following a REST API pattern with WebSocket support for real-time communication. The architecture separates concerns into distinct service layers for data processing, AI interactions, and external API integrations.

**Core Services:**
- **OpenWeather Service**: Handles real-time weather and AQI data fetching
- **AI Service**: Manages OpenAI GPT interactions for intelligent query responses
- **Voice Service**: Processes speech recognition and text-to-speech functionality
- **Storage Service**: Abstracts data persistence with support for both in-memory and database storage

### Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL for production environments and better-sqlite3 for development. The schema includes tables for AQI readings, chat messages, IoT device data, voice commands, and user management.

**Database Design:**
- **AQI Readings**: Stores historical pollution data with location-based indexing
- **Chat Messages**: Maintains conversation history with contextual information
- **IoT Readings**: Handles sensor data from distributed monitoring devices
- **Voice Commands**: Logs speech interactions for analysis and improvement

### Authentication and Authorization
Currently implements basic user management with planned expansion for role-based access control. The system supports session-based authentication with middleware for request validation.

### External Service Integrations

**OpenWeather API**: Primary data source for real-time weather and air quality information across Indian cities. Provides PM2.5, PM10, CO, O₃, NO₂, and SO₂ measurements with location-based accuracy.

**OpenAI Integration**: Powers the AI chatbot assistant with GPT-5 for natural language processing of air quality queries, health recommendations, and predictive insights.

**Voice Processing**: Browser-based speech recognition (Web Speech API) for hands-free interaction, with plans for server-side processing using advanced speech services.

**Mapping Services**: Ready for integration with Leaflet.js or Mapbox for geographical visualization of pollution data across Bengaluru.

**SendGrid Email**: Configured for alert notifications and health advisory communications.

### Machine Learning & Prediction
The system is architected to support time-series forecasting for pollution prediction using TensorFlow.js or Python-based models. Features include anomaly detection for sudden pollution spikes and adaptive learning from historical data patterns.

### Real-time Features
WebSocket implementation enables live updates for AQI changes, instant notifications for health alerts, and real-time IoT device monitoring. The system supports multi-client synchronization for dashboard updates.