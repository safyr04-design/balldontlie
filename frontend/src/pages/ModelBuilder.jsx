import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Save, Play, Trash2, Info, AlertCircle, CheckCircle,
  TrendingUp, Target, BarChart3, Settings, ChevronRight,
  ChevronDown, Star, Award, Zap, Clock, Shield
} from 'lucide-react';

export default function ModelBuilder({ apiKey }) {
  const [step, setStep] = useState(1);
  const [modelConfig, setModelConfig] = useState({
    name: '',
    sport: '',
    bet_type: '',
    mode: 'simple',
    factors: []
  });
  const [previewResults, setPreviewResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFactor, setExpandedFactor] = useState(null);

  // Available factors by sport
  const factorsByCategory = {
    nba: {
      team_performance: [
        {
          id: 'team_last_n_pts_allowed_avg',
          name: 'Points Allowed Average',
          description: 'Defense travels. Teams allowing fewer points tend to keep games close.',
          recommended: 'high',
          category: 'Team Performance'
        },
        {
          id: 'team_last_n_pts_avg',
          name: 'Points Scored Average',
          description: 'Recent offensive performance over last N games',
          recommended: 'medium',
          category: 'Team Performance'
        },
        {
          id: 'team_offensive_rating',
          name: 'Offensive Rating',
          description: 'Points per 100 possessions - measures offensive efficiency',
          recommended: 'medium',
          category: 'Team Performance'
        },
        {
          id: 'team_defensive_rating',
          name: 'Defensive Rating',
          description: 'Points allowed per 100 possessions - key defensive metric',
          recommended: 'high',
          category: 'Team Performance'
        },
        {
          id: 'team_net_rating',
          name: 'Net Rating',
          description: 'Point differential per 100 possessions - overall team quality',
          recommended: 'medium',
          category: 'Team Performance'
        }
      ],
      matchup: [
        {
          id: 'h2h_record',
          name: 'Head-to-Head Record',
          description: 'Historical performance against specific opponent',
          recommended: 'low',
          category: 'Matchup'
        },
        {
          id: 'pace_differential',
          name: 'Pace Differential',
          description: 'Difference in possessions per game - impacts total scoring',
          recommended: 'medium',
          category: 'Matchup'
        }
      ],
      situational: [
        {
          id: 'rest_days',
          name: 'Rest Days Advantage',
          description: 'Rest is one of the most predictive factors. Teams on 0 rest underperform by 2-3 points.',
          recommended: 'high',
          category: 'Situational'
        },
        {
          id: 'back_to_back',
          name: 'Back-to-Back Game',
          description: 'Specifically penalizes second game of back-to-back. Complements rest_days.',
          recommended: 'medium',
          category: 'Situational'
        },
        {
          id: 'travel_context',
          name: 'Travel Context',
          description: 'Extended road trips cause fatigue - secondary situational factor',
          recommended: 'low',
          category: 'Situational'
        },
        {
          id: 'schedule_density',
          name: 'Schedule Density',
          description: 'Games played in last N days - measures accumulated fatigue',
          recommended: 'medium',
          category: 'Situational'
        }
      ],
      market: [
        {
          id: 'team_ats_record',
          name: 'Against The Spread Record',
          description: 'Teams that consistently cover may have qualities not captured by other metrics.',
          recommended: 'medium',
          category: 'Market'
        },
        {
          id: 'line_movement',
          name: 'Line Movement',
          description: 'Opening vs current line - indicates sharp money movement',
          recommended: 'low',
          category: 'Market'
        },
        {
          id: 'public_betting_pct',
          name: 'Public Betting Percentage',
          description: 'Fading the public can provide value',
          recommended: 'low',
          category: 'Market'
        }
      ],
      player: [
        {
          id: 'star_player_status',
          name: 'Star Player Availability',
          description: 'Impact of key players being out or questionable',
          recommended: 'high',
          category: 'Player'
        }
      ]
    }
  };

  const recommendedModels = [
    {
      name: 'NBA Rest & Defense',
      sport: 'nba',
      bet_type: 'spread',
      description: 'Focuses on situational advantages and defensive performance',
      factors: [
        { factor_id: 'team_last_n_pts_allowed_avg', importance: 'high' },
        { factor_id: 'rest_days', importance: 'high' },
        { factor_id: 'back_to_back', importance: 'medium' },
        { factor_id: 'team_ats_record', importance: 'medium' },
        { factor_id: 'travel_context', importance: 'low' }
      ],
      expectedPerformance: { winRate: '54.2%', roi: '+3.8%' }
    },
    {
      name: 'NBA Offensive Explosion',
      sport: 'nba',
      bet_type: 'over_under',
      description: 'Targets high-scoring games with fast pace',
      factors: [
        { factor_id: 'team_last_n_pts_avg', importance: 'high' },
        { factor_id: 'pace_differential', importance: 'high' },
        { factor_id: 'team_offensive_rating', importance: 'medium' },
        { factor_id: 'back_to_back', importance: 'medium' },
        { factor_id: 'team_defensive_rating', importance: 'low' }
      ],
      expectedPerformance: { winRate: '53.8%', roi: '+2.9%' }
    },
    {
      name: 'NBA Home Court Value',
      sport: 'nba',
      bet_type: 'spread',
      description: 'Exploits home court advantage with strong home teams',
      factors: [
        { factor_id: 'team_net_rating', importance: 'high' },
        { factor_id: 'rest_days', importance: 'medium' },
        { factor_id: 'star_player_status', importance: 'high' },
        { factor_id: 'team_ats_record', importance: 'medium' },
        { factor_id: 'public_betting_pct', importance: 'low' }
      ],
      expectedPerformance: { winRate: '55.1%', roi: '+4.2%' }
    }
  ];

  const loadRecommendedModel = (model) => {
    setModelConfig({
      name: model.name,
      sport: model.sport,
      bet_type: model.bet_type,
      mode: 'simple',
      factors: model.factors
    });
    setStep(2);
  };

  const addFactor = (factorId) => {
    if (!modelConfig.factors.find(f => f.factor_id === factorId)) {
      setModelConfig({
        ...modelConfig,
        factors: [...modelConfig.factors, { factor_id: factorId, importance: 'medium', config: {} }]
      });
    }
  };

  const removeFactor = (factorId) => {
    setModelConfig({
      ...modelConfig,
      factors: modelConfig.factors.filter(f => f.factor_id !== factorId)
    });
  };

  const updateFactorImportance = (factorId, importance) => {
    setModelConfig({
      ...modelConfig,
      factors: modelConfig.factors.map(f =>
        f.factor_id === factorId ? { ...f, importance } : f
      )
    });
  };

  const getImportanceWeight = (importance) => {
    const weights = { low: 10, medium: 30, high: 50 };
    return weights[importance] || 30;
  };

  const calculateWeights = () => {
    const total = modelConfig.factors.reduce((sum, f) => sum + getImportanceWeight(f.importance), 0);
    return modelConfig.factors.map(f => ({
      ...f,
      percentage: ((getImportanceWeight(f.importance) / total) * 100).toFixed(1)
    }));
  };

  const getFactorDetails = (factorId) => {
    const allFactors = Object.values(factorsByCategory.nba).flat();
    return allFactors.find(f => f.id === factorId);
  };

  const runPreview = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPreviewResults({
        totalGames: 4892,
        gamesWithPredictions: 3156,
        record: { wins: 1672, losses: 1412, pushes: 72 },
        winRate: 54.2,
        roi: 3.8,
        byConfidence: {
          low: { record: '512-498', winRate: 50.7, roi: 0.2 },
          medium: { record: '724-612', winRate: 54.2, roi: 3.1 },
          high: { record: '436-302', winRate: 59.1, roi: 8.4 }
        }
      });
      setIsLoading(false);
      setStep(4);
    }, 2000);
  };

  const saveModel = () => {
    console.log('Saving model:', modelConfig);
    alert('Model saved successfully! (This would create a model via API)');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Model Builder
          </h1>
          <p className="text-gray-400">
            Create detailed betting models following best practices
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Choose Template', icon: Target },
            { num: 2, label: 'Configure Model', icon: Settings },
            { num: 3, label: 'Select Factors', icon: BarChart3 },
            { num: 4, label: 'Preview & Save', icon: TrendingUp }
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all
                  ${step >= s.num 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-dark-800 text-gray-500'
                  }
                `}>
                  <s.icon className="w-6 h-6" />
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? 'text-white' : 'text-gray-500'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && (
                <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? 'bg-primary-600' : 'bg-dark-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Choose Template */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Choose a Starting Point</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setStep(2)}
                  className="card card-hover p-6 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-600/20 rounded-lg">
                      <Plus className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Start from Scratch</h3>
                      <p className="text-sm text-gray-400">
                        Build a custom model by selecting your own factors
                      </p>
                    </div>
                  </div>
                </button>

                <div className="card p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-purple-600/20 rounded-lg">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Use Recommended Model</h3>
                      <p className="text-sm text-gray-400">
                        Start with proven configurations
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Recommended Models</h3>
              <div className="space-y-3">
                {recommendedModels.map((model) => (
                  <div key={model.name} className="card card-hover p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-white">{model.name}</h4>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded uppercase">
                            {model.sport}
                          </span>
                          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                            {model.bet_type.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{model.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-gray-300">Win Rate: <span className="text-green-400 font-semibold">{model.expectedPerformance.winRate}</span></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-300">ROI: <span className="text-blue-400 font-semibold">{model.expectedPerformance.roi}</span></span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => loadRecommendedModel(model)}
                        className="btn btn-primary ml-4"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Configure Model */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Model Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model Name
                  </label>
                  <input
                    type="text"
                    value={modelConfig.name}
                    onChange={(e) => setModelConfig({ ...modelConfig, name: e.target.value })}
                    placeholder="e.g., NBA Rest & Defense"
                    className="input w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sport
                    </label>
                    <select
                      value={modelConfig.sport}
                      onChange={(e) => setModelConfig({ ...modelConfig, sport: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Select sport</option>
                      <option value="nba">NBA</option>
                      <option value="nfl">NFL</option>
                      <option value="nhl">NHL</option>
                      <option value="mlb">MLB</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bet Type
                    </label>
                    <select
                      value={modelConfig.bet_type}
                      onChange={(e) => setModelConfig({ ...modelConfig, bet_type: e.target.value })}
                      className="input w-full"
                    >
                      <option value="">Select bet type</option>
                      <option value="spread">Point Spread</option>
                      <option value="moneyline">Moneyline</option>
                      <option value="over_under">Over/Under</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mode
                    </label>
                    <select
                      value={modelConfig.mode}
                      onChange={(e) => setModelConfig({ ...modelConfig, mode: e.target.value })}
                      className="input w-full"
                    >
                      <option value="simple">Simple (Low/Med/High)</option>
                      <option value="weighted">Weighted (Percentages)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="text-sm text-blue-300">
                      <p className="font-medium mb-1">Why these choices matter:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>Point Spread:</strong> Best for finding edges. Requires 52.4% win rate to break even.</li>
                        <li>• <strong>Simple Mode:</strong> Recommended when learning. System normalizes weights automatically.</li>
                        <li>• <strong>NBA:</strong> 82 games/team = largest backtest sample size.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn btn-secondary">
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!modelConfig.name || !modelConfig.sport || !modelConfig.bet_type}
                  className="btn btn-primary"
                >
                  Next: Select Factors
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Select Factors */}
        {step === 3 && modelConfig.sport && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Factor Library */}
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Available Factors</h2>
                
                {Object.entries(factorsByCategory[modelConfig.sport]).map(([category, factors]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-300 mb-3 capitalize">
                      {category.replace('_', ' ')}
                    </h3>
                    <div className="space-y-2">
                      {factors.map((factor) => {
                        const isSelected = modelConfig.factors.find(f => f.factor_id === factor.id);
                        const isExpanded = expandedFactor === factor.id;
                        
                        return (
                          <div key={factor.id} className="card">
                            <div className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <button
                                      onClick={() => setExpandedFactor(isExpanded ? null : factor.id)}
                                      className="text-gray-300 hover:text-white"
                                    >
                                      {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                      ) : (
                                        <ChevronRight className="w-4 h-4" />
                                      )}
                                    </button>
                                    <h4 className="font-semibold text-white">{factor.name}</h4>
                                    {factor.recommended === 'high' && (
                                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 ml-6">{factor.description}</p>
                                </div>
                                <button
                                  onClick={() => isSelected ? removeFactor(factor.id) : addFactor(factor.id)}
                                  className={`btn ${isSelected ? 'btn-secondary' : 'btn-primary'} ml-4`}
                                >
                                  {isSelected ? 'Remove' : 'Add'}
                                </button>
                              </div>
                              
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="mt-4 ml-6 p-3 bg-dark-950 rounded-lg border border-dark-700"
                                >
                                  <div className="text-sm space-y-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">Category:</span>
                                      <span className="text-gray-300">{factor.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">Recommended:</span>
                                      <span className={`
                                        px-2 py-0.5 rounded text-xs
                                        ${factor.recommended === 'high' ? 'bg-green-500/20 text-green-400' : ''}
                                        ${factor.recommended === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                                        ${factor.recommended === 'low' ? 'bg-gray-500/20 text-gray-400' : ''}
                                      `}>
                                        {factor.recommended} importance
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Factors */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Selected Factors ({modelConfig.factors.length})
                </h3>
                
                {modelConfig.factors.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No factors selected yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {calculateWeights().map((factor) => {
                      const details = getFactorDetails(factor.factor_id);
                      return (
                        <div key={factor.factor_id} className="p-3 bg-dark-950 rounded-lg border border-dark-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white mb-1">
                                {details?.name}
                              </div>
                              <div className="text-xs text-gray-400">
                                Weight: {factor.percentage}%
                              </div>
                            </div>
                            <button
                              onClick={() => removeFactor(factor.factor_id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <select
                            value={factor.importance}
                            onChange={(e) => updateFactorImportance(factor.factor_id, e.target.value)}
                            className="input input-sm w-full"
                          >
                            <option value="low">Low (10)</option>
                            <option value="medium">Medium (30)</option>
                            <option value="high">High (50)</option>
                          </select>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <button onClick={() => setStep(2)} className="btn btn-secondary w-full">
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={modelConfig.factors.length < 3}
                    className="btn btn-primary w-full"
                  >
                    Next: Preview
                  </button>
                  {modelConfig.factors.length < 3 && (
                    <p className="text-xs text-yellow-400 text-center">
                      Select at least 3 factors
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Preview & Save */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Model Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Model Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{modelConfig.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sport:</span>
                      <span className="text-white uppercase">{modelConfig.sport}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bet Type:</span>
                      <span className="text-white capitalize">{modelConfig.bet_type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mode:</span>
                      <span className="text-white capitalize">{modelConfig.mode}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Factor Weights</h3>
                  <div className="space-y-2">
                    {calculateWeights().map((factor) => {
                      const details = getFactorDetails(factor.factor_id);
                      return (
                        <div key={factor.factor_id} className="flex items-center gap-2">
                          <div className="flex-1 bg-dark-800 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-600 to-purple-600"
                              style={{ width: `${factor.percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400 w-12 text-right">{factor.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Results */}
            {!previewResults ? (
              <div className="card p-6 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Ready to Preview</h3>
                <p className="text-gray-400 mb-6">
                  Run a preview to see how this model would have performed historically
                </p>
                <button
                  onClick={runPreview}
                  disabled={isLoading}
                  className="btn btn-primary mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-5 h-5 animate-spin" />
                      Running Preview...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Run Preview
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="card p-4">
                    <div className="text-sm text-gray-400 mb-1">Total Games</div>
                    <div className="text-2xl font-bold text-white">{previewResults.totalGames.toLocaleString()}</div>
                  </div>
                  <div className="card p-4">
                    <div className="text-sm text-gray-400 mb-1">Win Rate</div>
                    <div className="text-2xl font-bold text-green-400">{previewResults.winRate}%</div>
                  </div>
                  <div className="card p-4">
                    <div className="text-sm text-gray-400 mb-1">ROI</div>
                    <div className="text-2xl font-bold text-blue-400">+{previewResults.roi}%</div>
                  </div>
                  <div className="card p-4">
                    <div className="text-sm text-gray-400 mb-1">Record</div>
                    <div className="text-lg font-bold text-white">
                      {previewResults.record.wins}-{previewResults.record.losses}-{previewResults.record.pushes}
                    </div>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Performance by Confidence</h3>
                  <div className="space-y-3">
                    {Object.entries(previewResults.byConfidence).map(([level, data]) => (
                      <div key={level} className="flex items-center justify-between p-3 bg-dark-950 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-2 h-2 rounded-full
                            ${level === 'high' ? 'bg-green-400' : ''}
                            ${level === 'medium' ? 'bg-yellow-400' : ''}
                            ${level === 'low' ? 'bg-gray-400' : ''}
                          `} />
                          <span className="text-white capitalize font-medium">{level} Confidence</span>
                          <span className="text-sm text-gray-400">{data.record}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-400">Win Rate: </span>
                            <span className="text-green-400 font-semibold">{data.winRate}%</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-400">ROI: </span>
                            <span className="text-blue-400 font-semibold">+{data.roi}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                      <div className="text-sm text-green-300">
                        <p className="font-medium mb-1">Strong Performance!</p>
                        <p className="text-xs">
                          High confidence picks show {previewResults.byConfidence.high.winRate}% win rate with +{previewResults.byConfidence.high.roi}% ROI.
                          Consider only betting on high confidence picks for best results.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="btn btn-secondary">
                Back to Factors
              </button>
              <div className="flex gap-3">
                <button onClick={runPreview} className="btn btn-secondary">
                  <Play className="w-4 h-4" />
                  Run Again
                </button>
                <button onClick={saveModel} className="btn btn-primary">
                  <Save className="w-4 h-4" />
                  Save Model
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
