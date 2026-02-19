import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Brain, TrendingUp, Award, Play, Pause, Trash2 } from 'lucide-react';

export default function Models({ apiKey }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');

  const models = [
    {
      id: 1,
      name: 'NBA Rest & Defense',
      sport: 'NBA',
      betType: 'Spread',
      winRate: 62.5,
      roi: 15.2,
      picks: 32,
      status: 'active',
      description: 'Focuses on rest advantages and defensive performance',
      factors: 5
    },
    {
      id: 2,
      name: 'NFL Turnover Edge',
      sport: 'NFL',
      betType: 'Spread',
      winRate: 58.3,
      roi: 10.8,
      picks: 24,
      status: 'active',
      description: 'Exploits turnover differential as primary predictor',
      factors: 5
    },
    {
      id: 3,
      name: 'NHL Goalie Advantage',
      sport: 'NHL',
      betType: 'Puckline',
      winRate: 55.7,
      roi: 8.5,
      picks: 18,
      status: 'paused',
      description: 'Prioritizes goaltending quality and rest factors',
      factors: 5
    },
    {
      id: 4,
      name: 'MLB Pitcher Dominance',
      sport: 'MLB',
      betType: 'Runline',
      winRate: 59.2,
      roi: 12.1,
      picks: 28,
      status: 'active',
      description: 'Focuses on starting pitcher matchups',
      factors: 5
    },
  ];

  const strategies = [
    { id: 1, name: 'NBA Rest & Defense', sport: 'NBA', description: 'Exploits rest differentials and defensive metrics', icon: '🛡️' },
    { id: 2, name: 'NBA Offensive Explosion', sport: 'NBA', description: 'Targets high-scoring games for totals', icon: '💥' },
    { id: 3, name: 'NFL Turnover Edge', sport: 'NFL', description: 'Focuses on ball security', icon: '🏈' },
    { id: 4, name: 'NHL Goalie Advantage', sport: 'NHL', description: 'Prioritizes goaltending and rest', icon: '🥅' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Models</h1>
          <p className="text-gray-400">
            Create and manage your betting models
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Model
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'NBA', 'NFL', 'NHL', 'MLB'].map((sport) => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedSport === sport
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                }`}
              >
                {sport.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card card-hover"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{model.name}</h3>
                  <p className="text-sm text-gray-400">{model.sport} • {model.betType}</p>
                </div>
              </div>
              <span className={`badge ${model.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                {model.status}
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">{model.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-dark-800 rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Win Rate</p>
                <p className="text-lg font-bold text-green-400">{model.winRate}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">ROI</p>
                <p className="text-lg font-bold text-primary-400">+{model.roi}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Picks</p>
                <p className="text-lg font-bold text-white">{model.picks}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="btn btn-primary flex-1 text-sm">
                View Details
              </button>
              <button className="btn btn-secondary p-2">
                {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="btn btn-secondary p-2 hover:border-red-600 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pre-built Strategies */}
      <div className="card bg-gradient-to-br from-primary-600/10 to-purple-600/10 border-primary-600/30">
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-primary-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">Pre-Built Strategies</h3>
            <p className="text-sm text-gray-400">Get started quickly with our research-backed models</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="bg-dark-800/50 rounded-lg p-4 border border-dark-700 hover:border-primary-600/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{strategy.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors mb-1">
                    {strategy.name}
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">{strategy.description}</p>
                  <span className="text-xs text-primary-400">{strategy.sport}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
