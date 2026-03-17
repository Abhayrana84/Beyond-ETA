import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Users, Zap } from 'lucide-react';

export function FeaturesShowcase() {
  const features = [
    {
      id: 1,
      title: 'Pothole Detection',
      description: 'AI identifies road imperfections using smartphone sensors',
      icon: AlertCircle,
      metrics: ['Accelerometer', 'Gyroscope', 'Crowd Verified'],
      color: 'from-yellow-500 to-orange-500',
    },
    {
      id: 2,
      title: 'Pollution Monitoring',
      description: 'Real-time air quality tracking with health recommendations',
      icon: Zap,
      metrics: ['PM2.5', 'NO₂', 'AQI Index'],
      color: 'from-cyan-500 to-blue-500',
    },
    {
      id: 3,
      title: 'Safety Prioritization',
      description: 'Well-lit, populated routes with emergency SOS integration',
      icon: Users,
      metrics: ['Street Lighting', 'Traffic Density', 'Population'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      title: 'Driver Monitoring',
      description: 'Detects drowsiness and keeps drivers alert on long journeys',
      icon: MapPin,
      metrics: ['Eye Tracking', 'Blink Rate', 'Head Position'],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="bg-slate-900 border border-slate-700 rounded-xl p-8 my-8"
    >
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Core Features</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${feature.color} p-6 rounded-lg shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/90 text-sm mb-4">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.metrics.map((metric) => (
                  <span
                    key={metric}
                    className="px-3 py-1 bg-white/20 text-white text-xs rounded-full"
                  >
                    {metric}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
