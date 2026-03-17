'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Smartphone, Cloud, Zap } from 'lucide-react';

export function TechStack() {
  const technologies = [
    {
      category: 'Frontend',
      icon: Smartphone,
      stack: ['React / Next.js', 'Tailwind CSS', 'Framer Motion', 'Mapbox GL'],
      color: 'from-blue-500 to-cyan-500',
    },
    {
      category: 'Backend',
      icon: Cloud,
      stack: ['Node.js / Express', 'Python FastAPI', 'PostgreSQL', 'Redis'],
      color: 'from-green-500 to-emerald-500',
    },
    {
      category: 'AI/ML',
      icon: Zap,
      stack: ['TensorFlow / PyTorch', 'OpenCV (Vision)', 'Ollama (LLM)', 'Scikit-learn'],
      color: 'from-orange-500 to-red-500',
    },
    {
      category: 'Data/Sensors',
      icon: Users,
      stack: ['Accelerometer/Gyroscope', 'AQI APIs', 'Crowdsourced Data', 'OSM'],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-slate-900 border border-slate-700 rounded-xl p-8"
    >
      <h2 className="text-2xl font-bold text-white mb-8">Technology Stack</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {technologies.map((tech, index) => {
          const Icon = tech.icon;
          return (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${tech.color} p-6 rounded-lg shadow-lg`}
            >
              <Icon className="w-8 h-8 text-white mb-3" />
              <h3 className="text-lg font-semibold text-white mb-4">{tech.category}</h3>
              <ul className="space-y-2">
                {tech.stack.map((item) => (
                  <li key={item} className="text-sm text-white/90">
                    • {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
