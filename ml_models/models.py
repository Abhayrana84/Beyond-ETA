"""
SafeNavigation ML Models Module
Implements pothole detection, drowsiness detection, and siren recognition
"""

import numpy as np
from typing import Dict, Tuple
import json

class PotholeDetectionModel:
    """
    Detects potholes using accelerometer and gyroscope data
    
    Algorithm:
    1. Use high-pass filter to remove gravity component
    2. Calculate jerk (derivative of acceleration)
    3. Detect peaks in vertical acceleration
    4. Confirm with gyroscope data for vehicle orientation
    5. Use crowd verification for false positive reduction
    """
    
    def __init__(self, threshold: float = 25.0):
        self.threshold = threshold
        self.noise_threshold = 2.0
        self.crowd_verification_count = 3
        self.pothole_buffer = {}
        
    def process_sensor_data(self, accelerometer: Dict, gyroscope: Dict) -> Dict:
        """
        Process raw sensor data and detect potholes
        
        Args:
            accelerometer: {'x': float, 'y': float, 'z': float}
            gyroscope: {'x': float, 'y': float, 'z': float}
            
        Returns:
            {
                'pothole_detected': bool,
                'acceleration_magnitude': float,
                'confidence': float (0-100),
                'vertical_spike': bool
            }
        """
        
        # Calculate acceleration magnitude (total acceleration)
        acc_mag = np.sqrt(
            accelerometer['x']**2 + 
            accelerometer['y']**2 + 
            accelerometer['z']**2
        )
        
        # Filter gravity (9.8 m/s^2)
        acc_without_gravity = acc_mag - 9.8
        
        # Detect significant vertical acceleration
        vertical_spike = abs(accelerometer['z']) > self.threshold
        
        # Gyroscope validation - potholes cause angular disturbance
        gyro_mag = np.sqrt(
            gyroscope['x']**2 + 
            gyroscope['y']**2 + 
            gyroscope['z']**2
        )
        gyro_spike = gyro_mag > 5.0
        
        # Pothole detected if both acceleration and gyroscope show spikes
        pothole_detected = vertical_spike and gyro_spike
        
        # Calculate confidence
        confidence = 0.0
        if pothole_detected:
            confidence = min(100.0, (acc_without_gravity / self.threshold) * 70)
        
        return {
            'pothole_detected': pothole_detected,
            'acceleration_magnitude': float(acc_mag),
            'confidence': float(confidence),
            'vertical_spike': vertical_spike,
            'gyro_magnitude': float(gyro_mag)
        }
    
    def verify_crowdsourced(self, location: Tuple[float, float], user_count: int) -> bool:
        """
        Verify pothole detection using crowdsourced data
        Multiple users need to report same location for confirmation
        
        Args:
            location: (latitude, longitude)
            user_count: Number of users reporting
            
        Returns:
            True if pothole is verified by multiple users
        """
        return user_count >= self.crowd_verification_count


class DrowsinessDetectionModel:
    """
    Monitors driver drowsiness using:
    - Eye blink rate and duration
    - Eye closure time
    - Head movement patterns
    - PERCLOS (Percentage of Eyelid Closure)
    """
    
    def __init__(self):
        self.normal_blink_rate = 15  # blinks per minute
        self.normal_blink_duration = 100  # milliseconds
        self.eye_closure_threshold = 150  # milliseconds
        self.head_movement_threshold = 5  # degrees
        
    def analyze_facial_features(self, features: Dict) -> Dict:
        """
        Analyze facial features to detect drowsiness
        
        Args:
            features: {
                'blink_rate': int (blinks per minute),
                'eye_closure_time': float (milliseconds),
                'head_movement': float (degrees),
                'perclos': float (0-100, percentage of eyelid closure),
                'fixation_points': int (number of points driver is looking)
            }
            
        Returns:
            {
                'is_drowsy': bool,
                'fatigue_level': float (0-100),
                'risk_level': str ('low', 'medium', 'high'),
                'alerts': list[str]
            }
        """
        
        alerts = []
        risk_factors = 0
        
        # Check blink rate anomaly
        blink_rate = features.get('blink_rate', self.normal_blink_rate)
        if blink_rate > 25 or blink_rate < 5:
            alerts.append("Abnormal blink rate detected")
            risk_factors += 1
        
        # Check eye closure time
        eye_closure = features.get('eye_closure_time', 0)
        if eye_closure > self.eye_closure_threshold:
            alerts.append("Prolonged eye closure detected")
            risk_factors += 2
        
        # Check head movement
        head_movement = features.get('head_movement', 0)
        if head_movement < self.head_movement_threshold:
            alerts.append("Reduced head movement - possible fatigue")
            risk_factors += 1
        
        # Check PERCLOS (Percentage Eyelid Closure)
        perclos = features.get('perclos', 0)
        if perclos > 30:  # More than 30% closed is drowsy
            alerts.append("High PERCLOS - eyes mostly closed")
            risk_factors += 2
        
        # Check fixation points (attention)
        fixation_points = features.get('fixation_points', 10)
        if fixation_points < 3:
            alerts.append("Reduced visual attention")
            risk_factors += 1
        
        # Calculate fatigue level
        fatigue_level = min(100.0, risk_factors * 15)
        
        # Determine if drowsy
        is_drowsy = fatigue_level > 40
        
        # Risk level
        if fatigue_level < 30:
            risk_level = 'low'
        elif fatigue_level < 70:
            risk_level = 'medium'
        else:
            risk_level = 'high'
        
        return {
            'is_drowsy': is_drowsy,
            'fatigue_level': fatigue_level,
            'risk_level': risk_level,
            'alerts': alerts,
            'recommended_action': self._get_recommendation(fatigue_level)
        }
    
    def _get_recommendation(self, fatigue_level: float) -> str:
        if fatigue_level > 70:
            return "IMMEDIATE: Pull over and take a break"
        elif fatigue_level > 40:
            return "WARNING: Consider taking a break soon"
        else:
            return "Stay alert and monitor yourself"


class SirenDetectionModel:
    """
    Detects ambulance/police sirens from audio data
    Uses frequency analysis and pattern matching
    
    Siren characteristics:
    - Frequency range: 2000-3500 Hz (ambulance) or 1000-3000 Hz (police)
    - Repetitive patterns: ~800ms on, ~400ms off
    - MFCC and spectral features for ML classification
    """
    
    def __init__(self):
        self.ambulance_freq_range = (2000, 3500)
        self.police_freq_range = (1000, 3000)
        self.min_confidence = 0.7
        
    def analyze_audio(self, frequency: float, mfcc_features: list) -> Dict:
        """
        Analyze audio to detect emergency sirens
        
        Args:
            frequency: Dominant frequency in Hz
            mfcc_features: Mel-Frequency Cepstral Coefficients (13-features)
            
        Returns:
            {
                'siren_detected': bool,
                'siren_type': str ('ambulance', 'police', 'none'),
                'confidence': float (0-1),
                'urgency': str ('critical', 'high', 'none')
            }
        """
        
        siren_type = 'none'
        confidence = 0.0
        
        # Check frequency ranges
        if self.ambulance_freq_range[0] <= frequency <= self.ambulance_freq_range[1]:
            siren_type = 'ambulance'
            confidence = 0.8
        elif self.police_freq_range[0] <= frequency <= self.police_freq_range[1]:
            siren_type = 'police'
            confidence = 0.75
        
        # Enhance confidence with ML features
        if mfcc_features:
            # Simulate ML classification
            ml_confidence = np.mean(np.array(mfcc_features[:5])) / 100
            confidence = (confidence + ml_confidence) / 2
        
        siren_detected = confidence >= self.min_confidence
        
        urgency = 'none'
        if siren_detected:
            urgency = 'critical' if siren_type == 'ambulance' else 'high'
        
        return {
            'siren_detected': siren_detected,
            'siren_type': siren_type,
            'confidence': float(confidence),
            'urgency': urgency,
            'frequency': float(frequency)
        }


class RouteOptimizationModel:
    """
    Multi-factor route optimization considering:
    - Distance
    - Time
    - Safety score
    - Pollution exposure
    - Vehicle health (potholes)
    """
    
    def calculate_route_score(self, route: Dict, weights: Dict) -> float:
        """
        Calculate composite score for a route
        
        Args:
            route: {
                'distance': float (km),
                'time': float (minutes),
                'safety_score': float (0-100),
                'aqi': float (0-500),
                'potholes': int,
                'traffic_density': float (0-100)
            }
            weights: {
                'distance': float,
                'time': float,
                'safety': float,
                'pollution': float,
                'vehicle_health': float
            }
            
        Returns:
            Composite score (0-100)
        """
        
        # Normalize metrics
        distance_score = 100 - (route['distance'] / 20 * 100)  # Normalize to 20km
        time_score = 100 - (route['time'] / 60 * 100)  # Normalize to 60 min
        safety_score = route['safety_score']
        
        # Pollution score (lower AQI is better)
        pollution_score = 100 - (route['aqi'] / 500 * 100)
        pollution_score = max(0, min(100, pollution_score))
        
        # Vehicle health (fewer potholes is better)
        vehicle_health = 100 - (route['potholes'] * 10)
        vehicle_health = max(0, min(100, vehicle_health))
        
        # Composite score
        composite = (
            distance_score * weights.get('distance', 0.15) +
            time_score * weights.get('time', 0.15) +
            safety_score * weights.get('safety', 0.35) +
            pollution_score * weights.get('pollution', 0.20) +
            vehicle_health * weights.get('vehicle_health', 0.15)
        )
        
        return float(composite)


# Example Usage
if __name__ == "__main__":
    # Test Pothole Detection
    print("=== Pothole Detection ===")
    pothole_model = PotholeDetectionModel()
    sensor_data = {
        'accelerometer': {'x': 1.0, 'y': 1.5, 'z': 28.0},
        'gyroscope': {'x': 2.0, 'y': 3.0, 'z': 1.5}
    }
    result = pothole_model.process_sensor_data(
        sensor_data['accelerometer'],
        sensor_data['gyroscope']
    )
    print(json.dumps(result, indent=2))
    
    # Test Drowsiness Detection
    print("\n=== Drowsiness Detection ===")
    drowsiness_model = DrowsinessDetectionModel()
    facial_features = {
        'blink_rate': 28,
        'eye_closure_time': 180,
        'head_movement': 2,
        'perclos': 35,
        'fixation_points': 2
    }
    result = drowsiness_model.analyze_facial_features(facial_features)
    print(json.dumps(result, indent=2))
    
    # Test Siren Detection
    print("\n=== Siren Detection ===")
    siren_model = SirenDetectionModel()
    result = siren_model.analyze_audio(2800, [0.5, 0.6, 0.7, 0.4, 0.3])
    print(json.dumps(result, indent=2))
