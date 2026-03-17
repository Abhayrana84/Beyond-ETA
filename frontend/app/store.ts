import { create } from 'zustand';

interface Location {
  name: string;
  lat: number;
  lng: number;
}

interface NavigationStore {
  // Location state
  startLocation: string;
  endLocation: string;
  setStartLocation: (location: string) => void;
  setEndLocation: (location: string) => void;

  // Current GPS coordinates
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  
  destinationLocation: Location | null;
  setDestinationLocation: (location: Location | null) => void;

  // Mode selection
  selectedMode: string;
  setSelectedMode: (mode: string) => void;

  // Metrics
  potholesDetected: number;
  setPotholesDetected: (count: number) => void;
  
  aqi: number;
  setAQI: (value: number) => void;
  
  safetyScore: number;
  setSafetyScore: (score: number) => void;
  
  estimatedTime: number;
  setEstimatedTime: (time: number) => void;
  
  distance: number;
  setDistance: (distance: number) => void;

  // Route data
  route: string[];
  setRoute: (route: string[]) => void;

  // Feature toggles
  enableSOS: boolean;
  setEnableSOS: (enabled: boolean) => void;
  
  enableDrowsinessDetection: boolean;
  setEnableDrowsinessDetection: (enabled: boolean) => void;
  
  enablePollutionCheck: boolean;
  setEnablePollutionCheck: (enabled: boolean) => void;

  // Alerts
  drowsinessAlert: boolean;
  setDrowsinessAlert: (alert: boolean) => void;
  
  emergencyDetected: boolean;
  setEmergencyDetected: (detected: boolean) => void;

  // Reset
  reset: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  // Initial state
  startLocation: '',
  endLocation: '',
  currentLocation: null,
  destinationLocation: null,
  selectedMode: 'balanced',
  potholesDetected: 0,
  aqi: 85,
  safetyScore: 78,
  estimatedTime: 15,
  distance: 8.5,
  route: [],
  enableSOS: false,
  enableDrowsinessDetection: false,
  enablePollutionCheck: true,
  drowsinessAlert: false,
  emergencyDetected: false,

  // Actions
  setStartLocation: (location) => set({ startLocation: location }),
  setEndLocation: (location) => set({ endLocation: location }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setDestinationLocation: (location) => set({ destinationLocation: location }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setPotholesDetected: (count) => set({ potholesDetected: count }),
  setAQI: (value) => set({ aqi: value }),
  setSafetyScore: (score) => set({ safetyScore: score }),
  setEstimatedTime: (time) => set({ estimatedTime: time }),
  setDistance: (distance) => set({ distance: distance }),
  setRoute: (route) => set({ route: route }),
  setEnableSOS: (enabled) => set({ enableSOS: enabled }),
  setEnableDrowsinessDetection: (enabled) => set({ enableDrowsinessDetection: enabled }),
  setEnablePollutionCheck: (enabled) => set({ enablePollutionCheck: enabled }),
  setDrowsinessAlert: (alert) => set({ drowsinessAlert: alert }),
  setEmergencyDetected: (detected) => set({ emergencyDetected: detected }),

  reset: () =>
    set({
      startLocation: '',
      endLocation: '',
      currentLocation: null,
      destinationLocation: null,
      selectedMode: 'balanced',
      potholesDetected: 0,
      aqi: 85,
      safetyScore: 78,
      estimatedTime: 15,
      distance: 8.5,
      route: [],
      enableSOS: false,
      enableDrowsinessDetection: false,
      enablePollutionCheck: true,
      drowsinessAlert: false,
      emergencyDetected: false,
    }),
}));
