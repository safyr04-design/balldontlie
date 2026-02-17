import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Target, Users, Clock, MapPin } from 'lucide-react';

export default function FactorAnalysis({ apiKey }) {
  const [selectedSport, setSelectedSport] = useState('NBA');

  const factors = {
    'Team Performance': [
      { name: 'Scoring Average', impact: 92, description: 'Average points scored in last N games', icon: Target },
      { name: 'Points Allowed', impact: 88, description: 'Average points allowed', icon: Target },
      { name: 'Home/Away Split', impact: 75, description: 'Performance difference at home vs away', icon: MapPin },
    ],
    'Matchup': [
      { name: 'Head-to-Head', impact: 82, description: 'Historical record against opponent', icon: Users },
      { name: 'Pace Differential', impact: 71, description: 'Difference in game tempo', icon: TrendingUp },
    ],
    'Situational': [
      { name: 'Rest Days', impact: 95, description: 'Days of rest before game', icon: Clock },
      { name: 'Back-to-Back', impact: 87, description: 'Playing on consecutive days', icon: Clock },
      { name: 'Travel Context', impact: 68, description: 'Road trip length and distance', icon: MapPin },
    ],
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Factor Analysis</h1>
        <p className="text-gray-400">Explore betting factors and their impact on predictions</p>
      </div>

      <div className="card">
        <div className="flex gap-2">
          {['NBA', 'NFL', 'NHL', 'MLB'].map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedSport === sport
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>
      </div>

      {Object.entries(factors).map(([category, items], catIndex) => (
        <div key={category} className="card">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-400" />
            {category}
          </h3>
          <div className="space-y-3">
            {items.map((factor, index) => {
              const Icon = factor.icon;
              return (
                <motion.div
                  key={factor.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                  className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-600/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">{factor.name}</h4>
                      <p className="text-sm text-gray-400">{factor.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Impact Score</div>
                      <div className="text-2xl font-bold text-green-400">{factor.impact}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.impact}%` }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary-600 to-green-600"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
