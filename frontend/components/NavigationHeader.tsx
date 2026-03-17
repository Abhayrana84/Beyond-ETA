'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search } from 'lucide-react';
import { useNavigationStore } from '@/app/store';
import toast from 'react-hot-toast';

export function NavigationHeader() {
  const { startLocation, endLocation, setStartLocation, setEndLocation } = useNavigationStore();
  const [localStart, setLocalStart] = React.useState(startLocation);
  const [localEnd, setLocalEnd] = React.useState(endLocation);

  const handleSearch = () => {
    if (localStart && localEnd) {
      setStartLocation(localStart);
      setEndLocation(localEnd);
      toast.success('Route search initiated!', {
        icon: '🗺️',
        style: { background: '#1e293b', color: '#e2e8f0' },
      });
    } else {
      toast.error('Please enter both start and end locations');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Beyond-ETA</h1>
              <p className="text-xs text-slate-400">Smart, Safe, Healthy Routes</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-center gap-3 focus-within:border-blue-500 transition-colors">
            <MapPin className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="From: Current location or address"
              value={localStart}
              onChange={(e) => setLocalStart(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
            />
          </div>

          <div className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 flex items-center gap-3 focus-within:border-blue-500 transition-colors">
            <MapPin className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="To: Destination address"
              value={localEnd}
              onChange={(e) => setLocalEnd(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:inline">Calculate Best Route</span>
            <span className="sm:hidden">Search</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
