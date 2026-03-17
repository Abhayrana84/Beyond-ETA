'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Gauge, Leaf, Shield, AlertCircle } from 'lucide-react';
import { useNavigationStore } from '@/app/store';

export function RouteComparison() {
  const { selectedMode, distance, estimatedTime, safetyScore } = useNavigationStore();

  const routes = [
    {
      id: 1,
      name: 'Fastest Route',
      distance: 8.2,
      time: 12,
      safety: 65,
      potholes: 5,
      aqi: 140,
      description: 'Highway via main road',
      pros: ['Shortest time', 'Direct path'],
      cons: ['Heavy traffic', 'Poor road quality'],
    },
    {
      id: 2,
      name: 'Recommended Route',
      distance: 9.1,
      time: 18,
      safety: 92,
      potholes: 1,
      aqi: 65,
      description: 'Well-lit, populated neighborhoods',
      pros: ['High safety', 'Good air quality', 'Well-maintained'],
      cons: ['Takes longer'],
      recommended: true,
    },
    {
      id: 3,
      name: 'Health-First Route',
      distance: 9.8,
      time: 20,
      safety: 88,
      potholes: 2,
      aqi: 45,
      description: 'Via parks and green areas',
      pros: ['Best air quality', 'Scenic', 'Low pollution'],
      cons: ['Longest route'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-400" />
        Route Comparison
      </h2>

      <div className="grid gap-4">
        {routes.map((route, index) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-lg border p-5 transition-all cursor-pointer group overflow-hidden ${
              route.recommended
                ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                : 'bg-slate-900 border-slate-700 hover:border-slate-600'
            }`}
          >
            {route.recommended && (
              <div className="absolute top-3 right-3 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                Recommended
              </div>
            )}

            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{route.name}</h3>
                <p className="text-sm text-slate-400">{route.description}</p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Distance</p>
                <p className="text-lg font-bold text-blue-400">{route.distance} km</p>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Est. Time</p>
                <p className="text-lg font-bold text-cyan-400">{route.time} min</p>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Safety Score</p>
                <p className="text-lg font-bold text-green-400">{route.safety}/100</p>
              </div>
              <div className="bg-slate-800/50 rounded p-3">
                <p className="text-xs text-slate-400 mb-1">Air Quality</p>
                <p className={`text-lg font-bold ${route.aqi > 100 ? 'text-red-400' : 'text-green-400'}`}>
                  {route.aqi}
                </p>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-2">✓ Advantages</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {route.pros.map((pro) => (
                    <li key={pro}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-2">⚠ Considerations</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  {route.cons.map((con) => (
                    <li key={con}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                route.recommended
                  ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {route.recommended ? 'Start Navigation' : 'Select Route'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
