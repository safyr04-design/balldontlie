import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, TrendingUp, Target, Filter, Award, Clock, Loader, AlertCircle, CheckCircle, X, RefreshCw } from 'lucide-react';

export default function Predictions({ apiKey }) {
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);

  const availableModels = [
    { id: 1, name: 'NBA Rest & Defense', sport: 'NBA', active: true },
    { id: 2, name: 'NBA Offensive Explosion', sport: 'NBA', active: true },
    { id: 3, name: 'NFL Turnover Edge', sport: 'NFL', active: true },
    { id: 4, name: 'NHL Goalie Advantage', sport: 'NHL', active: true },
    { id: 5, name: 'MLB Pitcher Dominance', sport: 'MLB', active: false },
  ];

  const [predictions, setPredictions] = useState([
    { id: 1, game: 'Lakers vs Warriors', sport: 'NBA', prediction: 'Lakers -4.5', confidence: 87, time: '7:30 PM', status: 'pending', model: 'NBA Rest & Defense' },
    { id: 2, game: 'Celtics vs Heat', sport: 'NBA', prediction: 'Over 215.5', confidence: 82, time: '8:00 PM', status: 'pending', model: 'NBA Offensive Explosion' },
    { id: 3, game: 'Cowboys vs Eagles', sport: 'NFL', prediction: 'Cowboys ML', confidence: 75, time: 'Sun 1:00 PM', status: 'win', model: 'NFL Turnover Edge' },
    { id: 4, game: 'Maple Leafs vs Canadiens', sport: 'NHL', prediction: 'Leafs -1.5', confidence: 69, time: '7:00 PM', status: 'loss', model: 'NHL Goalie Advantage' },
  ]);

  const handleGeneratePredictions = async () => {
    if (selectedModels.length === 0) {
      setError('Please select at least one model to generate predictions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock predictions
      const newPredictions = selectedModels.map((modelId, index) => {
        const model = availableModels.find(m => m.id === modelId);
        const games = {
          NBA: ['Lakers vs Warriors', 'Celtics vs Heat', 'Nuggets vs Suns'],
          NFL: ['Cowboys vs Eagles', 'Chiefs vs Bills', '49ers vs Seahawks'],
          NHL: ['Maple Leafs vs Canadiens', 'Rangers vs Devils', 'Avalanche vs Stars'],
          MLB: ['Yankees vs Red Sox', 'Dodgers vs Giants', 'Astros vs Rangers'],
        };
        
        const sportGames = games[model.sport] || [];
        const randomGame = sportGames[Math.floor(Math.random() * sportGames.length)];
        const predictions = ['ML', '-1.5', '+2.5', 'Over 215.5', 'Under 48.5'];
        const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
        
        return {
          id: Date.now() + index,
          game: randomGame,
          sport: model.sport,
          prediction: randomPrediction,
          confidence: Math.floor(Math.random() * 30) + 70,
          time: 'Tomorrow',
          status: 'pending',
          model: model.name,
        };
      });

      setPredictions([...newPredictions, ...predictions]);
      setShowModal(false);
      setSelectedModels([]);
      setLoading(false);
    } catch (err) {
      setError('Failed to generate predictions. Please try again.');
      setLoading(false);
    }
  };

  const toggleModelSelection = (modelId) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const filteredPredictions = filter === 'all' 
    ? predictions 
    : predictions.filter(p => p.status === filter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Predictions</h1>
          <p className="text-gray-400">Track your betting predictions and results</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
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
          {filteredPredictions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No predictions found</p>
              <p className="text-gray-500 text-sm mt-2">Generate predictions to see them here</p>
            </div>
          ) : (
            filteredPredictions.map((pred, index) => (
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
            ))
          )}
        </div>
      </div>

      {/* Generate Predictions Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => !loading && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Generate Predictions</h2>
                    <p className="text-sm text-gray-400">Select models to generate predictions from</p>
                  </div>
                </div>
                <button
                  onClick={() => !loading && setShowModal(false)}
                  className="p-2 hover:bg-dark-800 rounded-lg transition-colors"
                  disabled={loading}
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-medium">Error</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <p className="text-sm text-gray-400 mb-4">
                  Select one or more models to generate predictions. Each model will analyze upcoming games based on its configuration.
                </p>

                {availableModels.map((model) => (
                  <motion.div
                    key={model.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => model.active && toggleModelSelection(model.id)}
                    className={`
                      p-4 rounded-lg border-2 transition-all cursor-pointer
                      ${!model.active ? 'opacity-50 cursor-not-allowed' : ''}
                      ${selectedModels.includes(model.id)
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                          ${selectedModels.includes(model.id)
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-600'
                          }
                        `}>
                          {selectedModels.includes(model.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{model.name}</h4>
                          <p className="text-sm text-gray-400">{model.sport}</p>
                        </div>
                      </div>
                      <span className={`badge ${model.active ? 'badge-success' : 'badge-warning'}`}>
                        {model.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">API Integration Required</p>
                    <p className="text-blue-300 text-sm mt-1">
                      Live prediction generation requires a LAB PRO or ALL-ACCESS subscription. 
                      This demo generates sample predictions for testing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => !loading && setShowModal(false)}
                  className="btn btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleGeneratePredictions}
                  disabled={loading || selectedModels.length === 0}
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Generate {selectedModels.length > 0 && `(${selectedModels.length})`}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
