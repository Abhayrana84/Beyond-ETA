'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Wind, Leaf, Heart } from 'lucide-react';
import { useNavigationStore } from '@/app/store';
import toast from 'react-hot-toast';

interface Mode {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const modes: Mode[] = [
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Fast & Safe',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-orange-400 to-orange-600',
    gradient: 'bg-gradient-to-br from-orange-400/20 to-orange-600/20',
  },
  {
    id: 'safe',
    label: 'Safety First',
    description: 'Well-lit routes',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-red-400 to-red-600',
    gradient: 'bg-gradient-to-br from-red-400/20 to-red-600/20',
  },
  {
    id: 'health',
    label: 'Breathe Better',
    description: 'Low pollution',
    icon: <Wind className="w-5 h-5" />,
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-400/20 to-green-600/20',
  },
  {
    id: 'eco',
    label: 'Eco Mode',
    description: 'Carbon neutral',
    icon: <Leaf className="w-5 h-5" />,
    color: 'from-emerald-400 to-emerald-600',
    gradient: 'bg-gradient-to-br from-emerald-400/20 to-emerald-600/20',
  },
  {
    id: 'women-safe',
    label: 'Women Safety',
    description: 'Maximum security',
    icon: <Heart className="w-5 h-5" />,
    color: 'from-pink-400 to-pink-600',
    gradient: 'bg-gradient-to-br from-pink-400/20 to-pink-600/20',
  },
];

export function ModeSelector() {
  const { selectedMode, setSelectedMode } = useNavigationStore();

  const handleModeChange = (modeId: string) => {
    setSelectedMode(modeId);
    const mode = modes.find(m => m.id === modeId);
    if (mode) {
      toast.success(`Switched to ${mode.label} mode`, {
        icon: '✨',
        style: { background: '#1e293b', color: '#e2e8f0' },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-3"
    >
      <h2 className="text-lg font-semibold text-white">Navigation Mode</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleModeChange(mode.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              selectedMode === mode.id
                ? `border-blue-500 ${mode.gradient} shadow-lg shadow-blue-500/20`
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mode.color} flex items-center justify-center text-white`}>
                {mode.icon}
              </div>
              <p className="font-semibold text-white text-sm">{mode.label}</p>
              <p className="text-xs text-slate-400">{mode.description}</p>
            </div>
            {selectedMode === mode.id && (
              <motion.div
                layoutId="activeMode"
                className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
