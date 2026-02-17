import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Target, Calendar,
  Activity, Sparkles, ArrowRight, ChevronRight, Award
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard({ apiKey }) {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activeModels: 8,
    winRate: 58.7,
    roi: 12.3,
    totalPredictions: 156,
    todaysPicks: 5,
    weeklyROI: 8.5
  });

  // Sample data for charts
  const performanceData = [
    { date: 'Mon', profit: 120, predictions: 8 },
    { date: 'Tue', profit: -45, predictions: 6 },
    { date: 'Wed', profit: 200, predictions: 12 },
    { date: 'Thu', profit: 95, predictions: 7 },
    { date: 'Fri', profit: 180, predictions: 10 },
    { date: 'Sat', profit: 240, predictions: 15 },
    { date: 'Sun', profit: 160, predictions: 11 },
  ];

  const sportDistribution = [
    { name: 'NBA', value: 45, color: '#3b82f6' },
    { name: 'NFL', value: 25, color: '#8b5cf6' },
    { name: 'NHL', value: 20, color: '#10b981' },
    { name: 'MLB', value: 10, color: '#f59e0b' },
  ];

  const recentModels = [
    { id: 1, name: 'NBA Rest & Defense', sport: 'NBA', winRate: 62.5, roi: 15.2, picks: 32, status: 'active' },
    { id: 2, name: 'NFL Turnover Edge', sport: 'NFL', winRate: 58.3, roi: 10.8, picks: 24, status: 'active' },
    { id: 3, name: 'NHL Goalie Advantage', sport: 'NHL', winRate: 55.7, roi: 8.5, picks: 18, status: 'active' },
  ];

  const highConfidencePicks = [
    { game: 'Lakers vs Warriors', prediction: 'Lakers -4.5', confidence: 87, time: '7:30 PM' },
    { game: 'Celtics vs Heat', prediction: 'Over 215.5', confidence: 82, time: '8:00 PM' },
    { game: 'Nuggets vs Suns', prediction: 'Nuggets ML', confidence: 79, time: '9:00 PM' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your betting models today.
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Create Model
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          label="Active Models"
          value={stats.activeModels}
          change="+2 this week"
          color="blue"
        />
        <StatCard
          icon={Target}
          label="Win Rate"
          value={`${stats.winRate}%`}
          change="+2.4% from last week"
          color="green"
          positive
        />
        <StatCard
          icon={DollarSign}
          label="Total ROI"
          value={`${stats.roi}%`}
          change="+3.1% from last week"
          color="purple"
          positive
        />
        <StatCard
          icon={Calendar}
          label="Predictions"
          value={stats.totalPredictions}
          change={`${stats.todaysPicks} today`}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Performance</h3>
              <p className="text-sm text-gray-400">Weekly profit & predictions</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-400">
                +${performanceData.reduce((acc, d) => acc + d.profit, 0)}
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                fill="url(#profitGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sport Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-6">
            Sport Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sportDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {sportDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #374151', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sportDistribution.map((sport) => (
              <div key={sport.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sport.color }} />
                  <span className="text-gray-300">{sport.name}</span>
                </div>
                <span className="text-gray-400">{sport.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Models & High Confidence Picks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Models */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top Models</h3>
            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-600/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">
                      {model.name}
                    </h4>
                    <p className="text-sm text-gray-400">{model.sport} • {model.picks} picks</p>
                  </div>
                  <span className="badge badge-success">Active</span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-400">Win Rate</span>
                    <p className="text-green-400 font-semibold">{model.winRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-400">ROI</span>
                    <p className="text-primary-400 font-semibold">+{model.roi}%</p>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-400 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* High Confidence Picks */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Today's Top Picks</h3>
            </div>
            <span className="badge badge-warning">{highConfidencePicks.length} picks</span>
          </div>
          <div className="space-y-3">
            {highConfidencePicks.map((pick, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-dark-800 to-dark-800/50 rounded-lg p-4 border border-dark-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-white">{pick.game}</h4>
                    <p className="text-sm text-gray-400">{pick.time}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                    <div className="text-lg font-bold text-green-400">{pick.confidence}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-primary-600/20 rounded-full border border-primary-600/30">
                    <span className="text-primary-400 text-sm font-medium">{pick.prediction}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-br from-primary-600/10 to-purple-600/10 border-primary-600/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              🚀 Ready to create your first model?
            </h3>
            <p className="text-gray-400">
              Use our pre-built strategies or create a custom model from scratch
            </p>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, change, color, positive }) {
  const colorClasses = {
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/30',
    green: 'from-green-600/20 to-green-600/5 border-green-600/30',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/30',
    yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-600/30',
  };

  const iconColorClasses = {
    blue: 'bg-blue-600/20 text-blue-400',
    green: 'bg-green-600/20 text-green-400',
    purple: 'bg-purple-600/20 text-purple-400',
    yellow: 'bg-yellow-600/20 text-yellow-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`stat-card bg-gradient-to-br ${colorClasses[color]} card-hover`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconColorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-1">{label}</p>
        <p className="text-3xl font-bold text-white mb-2">{value}</p>
        <div className="flex items-center gap-1 text-sm">
          {positive !== undefined && (
            positive ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )
          )}
          <span className={positive ? 'text-green-400' : positive === false ? 'text-red-400' : 'text-gray-400'}>
            {change}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
