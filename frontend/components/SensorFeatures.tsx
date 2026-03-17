'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Zap, Settings } from 'lucide-react';
import { useNavigationStore } from '@/app/store';
import toast from 'react-hot-toast';

export function SensorFeatures() {
  const {
    enableDrowsinessDetection,
    enablePollutionCheck,
    enableSOS,
    setEnableDrowsinessDetection,
    setEnablePollutionCheck,
    setEnableSOS,
  } = useNavigationStore();

  const features = [
    {
      id: 'drowsiness',
      label: 'Driver Drowsiness Detection',
      description: 'AI monitors eye movement, blink rate & head position',
      icon: Eye,
      enabled: enableDrowsinessDetection,
      setEnabled: setEnableDrowsinessDetection,
      color: 'from-orange-500 to-red-500',
      metrics: ['Eye Closure Duration', 'Blink Rate', 'Head Movement'],
    },
    {
      id: 'pollution',
      label: 'Breathe Better Mode',
      description: 'Real-time AQI monitoring with pollution exposure alerts',
      icon: Zap,
      enabled: enablePollutionCheck,
      setEnabled: setEnablePollutionCheck,
      color: 'from-cyan-500 to-blue-500',
      metrics: ['PM2.5 Level', 'NO₂ Concentration', 'AQI Index'],
    },
    {
      id: 'sos',
      label: 'Emergency SOS System',
      description: 'One-tap emergency call with automatic location sharing',
      icon: Settings,
      enabled: enableSOS,
      setEnabled: setEnableSOS,
      color: 'from-red-500 to-pink-500',
      metrics: ['Emergency Contacts', 'Live Location', 'Police/Ambulance'],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-br ${feature.color} rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{feature.label}</h3>
                  <p className="text-sm text-slate-400 mb-3">{feature.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {feature.metrics.map((metric) => (
                      <span
                        key={metric}
                        className="px-2 py-1 bg-slate-800 text-xs text-slate-300 rounded"
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  feature.setEnabled(!feature.enabled);
                  toast.success(
                    `${feature.label} ${!feature.enabled ? 'enabled' : 'disabled'}`
                  );
                }}
                className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                  feature.enabled ? 'bg-blue-500' : 'bg-slate-700'
                }`}
              >
                <motion.div
                  layout
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${
                    feature.enabled ? 'right-1' : 'left-1'
                  }`}
                />
              </motion.button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
