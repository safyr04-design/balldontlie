import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Target, Filter, Award, Clock } from 'lucide-react';

export default function Predictions({ apiKey }) {
  const [filter, setFilter] = useState('all');

  const predictions = [
    { id: 1, game: 'Lakers vs Warriors', sport: 'NBA', prediction: 'Lakers -4.5', confidence: 87, time: '7:30 PM', status: 'pending', model: 'NBA Rest & Defense' },
    { id: 2, game: 'Celtics vs Heat', sport: 'NBA', prediction: 'Over 215.5', confidence: 82, time: '8:00 PM', status: 'pending', model: 'NBA Offensive Explosion' },
    { id: 3, game: 'Cowboys vs Eagles', sport: 'NFL', prediction: 'Cowboys ML', confidence: 75, time: 'Sun 1:00 PM', status: 'win', model: 'NFL Turnover Edge' },
    { id: 4, game: 'Maple Leafs vs Canadiens', sport: 'NHL', prediction: 'Leafs -1.5', confidence: 69, time: '7:00 PM', status: 'loss', model: 'NHL Goalie Advantage' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Predictions</h1>
          <p className="text-gray-400">Track your betting predictions and results</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Generate Predictions
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-gradient-to-br from-blue-600/20 to-blue-600/5">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-600/20 to-green-600/5">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-sm text-gray-400">Won</p>
              <p className="text-2xl font-bold text-white">8</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-red-600/20 to-red-600/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-sm text-gray-400">Lost</p>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </div>
        </div>
        <div className="card bg-gradient-to-br from-purple-600/20 to-purple-600/5">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-sm text-gray-400">Win Rate</p>
              <p className="text-2xl font-bold text-white">66.7%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'win', 'loss'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {predictions.map((pred, index) => (
            <motion.div
              key={pred.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-600/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium text-white">{pred.game}</h4>
                    <span className="badge badge-info">{pred.sport}</span>
                    <span className={`badge ${
                      pred.status === 'pending' ? 'badge-warning' :
                      pred.status === 'win' ? 'badge-success' :
                      'badge-danger'
                    }`}>
                      {pred.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{pred.model} • {pred.time}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary-400 mb-1">{pred.prediction}</div>
                  <div className="text-sm text-gray-400">Confidence: <span className="text-green-400 font-semibold">{pred.confidence}%</span></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
