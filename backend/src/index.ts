import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// Middleware
app.use(cors());
app.use(express.json());

// Type definitions
interface SensorData {
  userId: string;
  latitude: number;
  longitude: number;
  accelerometerX: number;
  accelerometerY: number;
  accelerometerZ: number;
  gyroscopeX: number;
  gyroscopeY: number;
  gyroscopeZ: number;
  timestamp: Date;
}

interface PotholeReport {
  id: string;
  latitude: number;
  longitude: number;
  confidence: number;
  reports: number;
  lastUpdated: Date;
}

interface RouteRequest {
  start: { latitude: number; longitude: number };
  end: { latitude: number; longitude: number };
  mode: 'balanced' | 'safe' | 'eco' | 'health' | 'women-safe';
}

// In-memory storage (in production, use database)
const potholeMaps = new Map<string, PotholeReport>();
const emergencyAlerts: any[] = [];
const connectedUsers = new Map<string, any>();

// REST API Routes

/**
 * Pothole Detection from Sensor Data
 * Analyzes accelerometer and gyroscope data to detect road anomalies
 */
app.post('/api/sensor/accelerometer', (req: Request, res: Response) => {
  const sensorData: SensorData = req.body;

  // Simulate ML-based pothole detection
  const accelerationMagnitude = Math.sqrt(
    Math.pow(sensorData.accelerometerX, 2) +
    Math.pow(sensorData.accelerometerY, 2) +
    Math.pow(sensorData.accelerometerZ, 2)
  );

  const isPothole = accelerationMagnitude > 25; // Threshold for pothole detection

  if (isPothole) {
    const key = `${Math.round(sensorData.latitude * 100)}-${Math.round(sensorData.longitude * 100)}`;
    const existing = potholeMaps.get(key);

    if (existing) {
      existing.reports++;
      existing.confidence = Math.min(100, 50 + existing.reports * 10);
    } else {
      potholeMaps.set(key, {
        id: key,
        latitude: sensorData.latitude,
        longitude: sensorData.longitude,
        confidence: 50,
        reports: 1,
        lastUpdated: new Date(),
      });
    }
  }

  res.json({
    detected: isPothole,
    magnitude: accelerationMagnitude,
    threshold: 25,
  });
});

/**
 * AQI Data Endpoint
 * Provides real-time air quality index for routes
 */
app.get('/api/pollution/aqi', (req: Request, res: Response) => {
  const { latitude, longitude } = req.query;

  // Simulate AQI data
  const mockAQI = Math.floor(Math.random() * 200) + 30;
  const pm25 = Math.floor(Math.random() * 150) + 10;
  const no2 = Math.floor(Math.random() * 100) + 20;

  res.json({
    aqi: mockAQI,
    pm25,
    no2,
    location: { latitude, longitude },
    timestamp: new Date(),
    healthStatus: mockAQI > 200 ? 'Unhealthy' : mockAQI > 100 ? 'Moderate' : 'Good',
  });
});

/**
 * Route Calculation with Multi-Factor Optimization
 * Considers: distance, time, safety, pollution, road quality, traffic
 */
app.post('/api/navigation/route', (req: Request, res: Response) => {
  const routeRequest: RouteRequest = req.body;

  // Simulate route calculation based on mode
  const routes = [
    {
      id: 1,
      name: 'Fastest',
      distance: 8.2,
      estimatedTime: 12,
      safetyScore: 65,
      aqi: 140,
      potholes: 5,
      polyline: 'encoded_polyline_1',
      turnByTurn: ['Head north on Main St', 'Turn right on Oak Ave', 'Arrive at destination'],
    },
    {
      id: 2,
      name: 'Safest',
      distance: 9.1,
      estimatedTime: 18,
      safetyScore: 92,
      aqi: 65,
      potholes: 1,
      polyline: 'encoded_polyline_2',
      turnByTurn: ['Head north on Park Rd', 'Turn left on Green Ave', 'Arrive at destination'],
      recommended: true,
    },
    {
      id: 3,
      name: 'Healthiest',
      distance: 9.8,
      estimatedTime: 20,
      safetyScore: 88,
      aqi: 45,
      potholes: 2,
      polyline: 'encoded_polyline_3',
      turnByTurn: ['Head west on Garden Ln', 'Continue to destination'],
    },
  ];

  // Filter based on selected mode
  let selectedRoute = routes[1]; // Default to safest
  if (routeRequest.mode === 'balanced') selectedRoute = routes[0];
  if (routeRequest.mode === 'health') selectedRoute = routes[2];

  res.json({
    routes,
    selectedRoute,
    userMode: routeRequest.mode,
  });
});

/**
 * Women Safety Analysis
 * Analyzes street lighting, traffic density, and population density
 */
app.post('/api/safety/women-analysis', (req: Request, res: Response) => {
  const { latitude, longitude } = req.body;

  // Simulate safety metrics
  const safetyMetrics = {
    streetLighting: Math.floor(Math.random() * 100),
    trafficDensity: Math.floor(Math.random() * 100),
    populationDensity: Math.floor(Math.random() * 100),
    policePresence: Math.floor(Math.random() * 100),
    timeOfDay: new Date().getHours(),
    overallScore: 0,
    recommendation: '',
  };

  safetyMetrics.overallScore =
    (safetyMetrics.streetLighting +
      safetyMetrics.trafficDensity +
      safetyMetrics.populationDensity) /
    3;

  if (safetyMetrics.overallScore > 75) {
    safetyMetrics.recommendation = 'Very Safe - Recommended';
  } else if (safetyMetrics.overallScore > 50) {
    safetyMetrics.recommendation = 'Moderate Safety - Use caution';
  } else {
    safetyMetrics.recommendation = 'High Alert - Avoid if possible';
  }

  res.json(safetyMetrics);
});

/**
 * Emergency Vehicle Detection
 * Alerts users when ambulance/police sirens are detected
 */
app.post('/api/emergency/siren-detection', (req: Request, res: Response) => {
  const { audioFrequency, latitude, longitude, userId } = req.body;

  // Simulate siren detection (actual implementation uses audio ML model)
  const isSiren = audioFrequency > 2000 && audioFrequency < 3500;

  if (isSiren) {
    emergencyAlerts.push({
      id: Math.random().toString(36).substr(2, 9),
      type: 'ambulance',
      location: { latitude, longitude },
      detectedBy: userId,
      timestamp: new Date(),
      urgency: 'high',
    });

    // Broadcast to all connected users
    io.emit('emergency_alert', {
      type: 'ambulance',
      location: { latitude, longitude },
      message: 'Ambulance nearby - Clear the path!',
    });
  }

  res.json({ detected: isSiren, alertCount: emergencyAlerts.length });
});

/**
 * Driver Drowsiness Detection
 * Uses computer vision to monitor eye blink rate and head position
 */
app.post('/api/safety/drowsiness-check', (req: Request, res: Response) => {
  const { eyeClosureTime, blinkRate, headMovement } = req.body;

  // ML-based drowsiness detection thresholds
  const isDrowsy =
    eyeClosureTime > 150 || // Eye closure > 150ms
    blinkRate > 25 || // Abnormal blink rate
    headMovement < 5; // Reduced head movement

  const fatigueLevel = Math.floor(
    (eyeClosureTime / 200) * 100 + (blinkRate / 30) * 100
  ) / 2;

  res.json({
    isDrowsy,
    fatigueLevel: Math.min(100, fatigueLevel),
    recommendations: isDrowsy ? ['Take a break', 'Pull over safely', 'Reduce navigation assistance'] : [],
    timestamp: new Date(),
  });
});

/**
 * Get Pothole Map Data
 * Returns all detected potholes in a region
 */
app.get('/api/map/potholes', (req: Request, res: Response) => {
  const potholes = Array.from(potholeMaps.values()).filter(
    (p) => p.confidence > 30
  );

  res.json({
    potholes,
    count: potholes.length,
    lastUpdated: new Date(),
  });
});

/**
 * SOS Emergency Call
 * Handles emergency requests with location sharing
 */
app.post('/api/emergency/sos', (req: Request, res: Response) => {
  const { userId, latitude, longitude, contactType } = req.body;

  const sosRequest = {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    location: { latitude, longitude },
    contactType, // 'police', 'ambulance', 'emergency'
    timestamp: new Date(),
    status: 'pending',
  };

  // Broadcast SOS to emergency services and nearby users
  io.emit('sos_alert', sosRequest);

  res.json({
    success: true,
    sosId: sosRequest.id,
    message: 'Emergency services alerted. Help is on the way.',
  });
});

// WebSocket Events for Real-Time Data

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  connectedUsers.set(socket.id, { connected: true });

  // User sends sensor data
  socket.on('sensor_data', (data: SensorData) => {
    const accelerationMagnitude = Math.sqrt(
      Math.pow(data.accelerometerX, 2) +
      Math.pow(data.accelerometerY, 2) +
      Math.pow(data.accelerometerZ, 2)
    );

    if (accelerationMagnitude > 25) {
      io.emit('pothole_detected', {
        location: { latitude: data.latitude, longitude: data.longitude },
        confidence: 70,
      });
    }
  });

  // User sends drowsiness alert
  socket.on('drowsiness_alert', (data) => {
    io.emit('driver_alert', {
      type: 'drowsiness',
      severity: 'high',
      message: 'Driver appears to be drowsy. Consider pulling over.',
    });
  });

  // User receives updates
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    connectedUsers.delete(socket.id);
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'SafeNavigation Backend API',
    version: '1.0.0',
    status: 'running',
    message: 'Welcome to SafeNavigation API',
    endpoints: {
      health: '/health',
      navigation: '/api/navigation/route',
      sensors: '/api/sensor/accelerometer',
      pollution: '/api/pollution/aqi',
      safety: '/api/safety/women-analysis',
      drowsiness: '/api/safety/drowsiness-check',
      siren: '/api/emergency/siren-detection',
      potholeMaps: '/api/map/potholes',
      sos: '/api/emergency/sos'
    },
    documentation: 'See README.md for detailed API documentation',
    timestamp: new Date(),
  });
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'SafeNavigation Backend is running!', timestamp: new Date() });
});

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 SafeNavigation Backend running on http://localhost:${PORT}`);
});

export default app;
