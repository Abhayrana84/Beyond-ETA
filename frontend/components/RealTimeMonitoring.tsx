'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Zap, Wind, AlertTriangle, Users, Phone } from 'lucide-react';
import { useNavigationStore } from '@/app/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function RealTimeMonitoring() {
  const { potholesDetected, aqi, safetyScore, enableDrowsinessDetection } = useNavigationStore();
  const [drowsinessAlert, setDrowsinessAlert] = useState(false);
  const [emergencyDetected, setEmergencyDetected] = useState(false);

  // Simulate sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (enableDrowsinessDetection && Math.random() > 0.7) {
        setDrowsinessAlert(true);
        setTimeout(() => setDrowsinessAlert(false), 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [enableDrowsinessDetection]);

  const healthMetrics = [
    {
      icon: AlertTriangle,
      label: 'Potholes Detected',
      value: potholesDetected,
      unit: 'on route',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Wind,
      label: 'AQI Level',
      value: aqi || 'Good',
      unit: aqi ? (aqi > 200 ? 'Unhealthy' : aqi > 100 ? 'Moderate' : 'Good') : '',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      icon: Activity,
      label: 'Safety Score',
      value: safetyScore,
      unit: '/100',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  const chartData = [
    { time: '0km', aqi: 60 },
    { time: '2km', aqi: 75 },
    { time: '4km', aqi: 65 },
    { time: '6km', aqi: 90 },
    { time: '8km', aqi: 85 },
    { time: '10km', aqi: 70 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Alerts */}
      {(drowsinessAlert || emergencyDetected) && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <p className="font-semibold text-red-300">
                {drowsinessAlert ? '⚠️ Driver Drowsiness Detected!' : '🚑 Emergency Vehicle Nearby!'}
              </p>
              <p className="text-sm text-red-200">
                {drowsinessAlert 
                  ? 'Please take a break or pull over safely' 
                  : 'Please clear the path for emergency vehicle'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {healthMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${metric.bgColor} border border-slate-700 rounded-lg p-5 backdrop-blur-sm hover:border-slate-600 transition-colors`}
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={`w-6 h-6 ${metric.color}`} />
              </div>
              <p className="text-sm text-slate-400 mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                <p className="text-xs text-slate-400">{metric.unit}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AQI Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-900 border border-slate-700 rounded-lg p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Wind className="w-5 h-5 text-cyan-400" />
          Pollution Exposure Along Route
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Line 
              type="monotone" 
              dataKey="aqi" 
              stroke="#06b6d4" 
              strokeWidth={2}
              dot={{ fill: '#06b6d4', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* SOS Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="font-semibold text-white">Emergency SOS</h3>
              <p className="text-sm text-slate-400">One-tap emergency assistance</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200"
          >
            SOS
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
