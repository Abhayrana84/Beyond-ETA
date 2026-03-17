"""
Sensor Data Processing Pipeline
Handles smartphone sensor input and preprocessing
"""

import numpy as np
from typing import Dict, List
from collections import deque

class SensorDataProcessor:
    """
    Real-time sensor data processing and filtering
    """
    
    def __init__(self, window_size: int = 50):
        # Buffers for sensor data
        self.accel_buffer = deque(maxlen=window_size)
        self.gyro_buffer = deque(maxlen=window_size)
        self.window_size = window_size
        
    def apply_high_pass_filter(self, signal: List[float], cutoff_freq: float = 0.5) -> List[float]:
        """
        Remove low-frequency components (gravity) from accelerometer
        """
        filtered = []
        prev_value = signal[0]
        
        for i in range(1, len(signal)):
            filtered_value = cutoff_freq * (prev_value + signal[i] - signal[i-1])
            filtered.append(filtered_value)
            prev_value = filtered_value
            
        return filtered
    
    def calculate_jerk(self, acceleration: List[float]) -> List[float]:
        """
        Calculate jerk (derivative of acceleration)
        High jerk indicates sudden impact (pothole)
        """
        jerk = []
        for i in range(1, len(acceleration)):
            j = acceleration[i] - acceleration[i-1]
            jerk.append(abs(j))
        return jerk
    
    def detect_anomalies(self, data: List[float], threshold: float = 2.0) -> List[int]:
        """
        Detect anomalies using simple statistical method
        """
        mean = np.mean(data)
        std = np.std(data)
        
        anomalies = []
        for i, val in enumerate(data):
            if abs(val - mean) > threshold * std:
                anomalies.append(i)
                
        return anomalies


class AQIDataProcessor:
    """
    Air Quality Index data processing and interpretation
    """
    
    AQI_CATEGORIES = {
        'Good': (0, 50),
        'Satisfactory': (51, 100),
        'Moderately Polluted': (101, 200),
        'Poor': (201, 300),
        'Very Poor': (301, 400),
        'Severe': (401, float('inf'))
    }
    
    @staticmethod
    def categorize_aqi(aqi_value: float) -> str:
        """Categorize AQI value"""
        for category, (low, high) in AQIDataProcessor.AQI_CATEGORIES.items():
            if low <= aqi_value <= high:
                return category
        return "Unknown"
    
    @staticmethod
    def get_health_recommendation(aqi_value: float) -> str:
        """Get health recommendation based on AQI"""
        category = AQIDataProcessor.categorize_aqi(aqi_value)
        
        recommendations = {
            'Good': 'Air quality is good. Enjoy outdoor activities!',
            'Satisfactory': 'Air quality is acceptable. Most people can go outside.',
            'Moderately Polluted': 'Air quality is moderate. Sensitive groups should limit outdoor activities.',
            'Poor': 'Air quality is poor. Everyone should limit outdoor exposure.',
            'Very Poor': 'Air quality is very poor. Avoid outdoor activities.',
            'Severe': 'Air quality is severe. Stay indoors and use air purifiers.',
        }
        
        return recommendations.get(category, "Cannot determine recommendation")


class LocationProcessor:
    """
    GPS and location-based data processing
    """
    
    @staticmethod
    def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculate distance between two coordinates using Haversine formula
        Returns distance in kilometers
        """
        R = 6371  # Earth's radius in km
        
        lat1_rad = np.radians(lat1)
        lat2_rad = np.radians(lat2)
        delta_lat = np.radians(lat2 - lat1)
        delta_lon = np.radians(lon2 - lon1)
        
        a = np.sin(delta_lat/2)**2 + np.cos(lat1_rad) * np.cos(lat2_rad) * np.sin(delta_lon/2)**2
        c = 2 * np.arcsin(np.sqrt(a))
        
        return R * c
    
    @staticmethod
    def grid_location(latitude: float, longitude: float, grid_size: float = 0.01) -> str:
        """
        Convert continuous coordinates to grid cell for clustering
        Useful for crowd verification of potholes
        """
        grid_lat = round(latitude / grid_size) * grid_size
        grid_lon = round(longitude / grid_size) * grid_size
        return f"{grid_lat},{grid_lon}"


# Integration with Online LLM (Ollama)
class LLMIntegration:
    """
    Integration with local Ollama LLM for natural language explanations
    """
    
    @staticmethod
    def generate_aqi_explanation(aqi_value: float, pollutants: Dict) -> str:
        """
        Generate natural language explanation of AQI using LLM
        Example of converting raw metrics to human-readable format
        """
        
        category = AQIDataProcessor.categorize_aqi(aqi_value)
        
        explanation = f"Air Quality Status: {category}\n"
        explanation += f"Overall AQI: {int(aqi_value)}\n"
        explanation += f"PM2.5: {pollutants.get('pm25', 'N/A')} µg/m³\n"
        explanation += f"NO₂: {pollutants.get('no2', 'N/A')} µg/m³\n"
        explanation += f"\nRecommendation: {AQIDataProcessor.get_health_recommendation(aqi_value)}"
        
        return explanation
    
    @staticmethod
    def generate_route_explanation(route: Dict, mode: str) -> str:
        """
        Generate natural language explanation of chosen route
        """
        
        explanations = {
            'balanced': f"This route balances speed and safety. {route['distance']:.1f}km in ~{route['time']}min with good safety score.",
            'safe': f"This route prioritizes your safety with well-lit, populated roads. {route['distance']:.1f}km in ~{route['time']}min.",
            'health': f"This route minimizes pollution exposure. Fresh air and scenic path - {route['distance']:.1f}km in ~{route['time']}min.",
            'eco': f"This eco-friendly route reduces carbon footprint. {route['distance']:.1f}km in ~{route['time']}min.",
            'women-safe': f"This route is optimized for women's safety with good lighting and crowds. {route['distance']:.1f}km in ~{route['time']}min."
        }
        
        return explanations.get(mode, str(route))


# Example Usage
if __name__ == "__main__":
    # Test sensor processing
    processor = SensorDataProcessor()
    accel_data = [9.8, 10.2, 15.5, 28.3, 12.1, 10.0]
    print("Original:", accel_data)
    print("Jerk:", processor.calculate_jerk(accel_data))
    
    # Test AQI categorization
    print("\nAQI at 125:", AQIDataProcessor.categorize_aqi(125))
    print("Recommendation:", AQIDataProcessor.get_health_recommendation(125))
    
    # Test location
    distance = LocationProcessor.calculate_distance(40.7128, -74.0060, 40.7580, -73.9855)
    print(f"\nDistance between NYC locations: {distance:.2f} km")
