import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Book, Code, Database, Zap, Shield, Clock, 
  CheckCircle, AlertCircle, Search, ChevronDown,
  ChevronRight, Copy, ExternalLink, Play, RotateCw,
  ChevronUp, Info, XCircle
} from 'lucide-react';

export default function ApiDocs({ apiKey }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [paramValues, setParamValues] = useState({});
  const [bodyData, setBodyData] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    params: true,
    body: true,
    response: true
  });

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const resetForm = () => {
    setParamValues({});
    setBodyData('');
    setResponse(null);
  };

  const handleParamChange = (paramName, value) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const executeRequest = async () => {
    if (!selectedEndpoint) return;

    setIsLoading(true);
    setResponse(null);

    try {
      // Build URL with parameters
      let url = `https://api.balldontlie.io${selectedEndpoint.path}`;
      
      // Replace path parameters
      Object.keys(paramValues).forEach(key => {
        if (url.includes(`{${key}}`)) {
          url = url.replace(`{${key}}`, paramValues[key]);
        }
      });

      // Add query parameters
      const queryParams = new URLSearchParams();
      selectedEndpoint.params?.forEach(param => {
        if (!selectedEndpoint.path.includes(`{${param.name}}`) && paramValues[param.name]) {
          queryParams.append(param.name, paramValues[param.name]);
        }
      });

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      // Build request options
      const options = {
        method: selectedEndpoint.method,
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json'
        }
      };

      // Add body for POST/PUT/PATCH
      if (['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method) && bodyData) {
        options.body = bodyData;
      }

      // Make request
      const startTime = Date.now();
      const res = await fetch(url, options);
      const duration = Date.now() - startTime;
      
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: data,
        duration: duration,
        url: url
      });

    } catch (error) {
      setResponse({
        status: 0,
        statusText: 'Error',
        error: error.message,
        data: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const endpoints = [
    {
      category: 'Factors',
      items: [
        {
          id: 'get-factors',
          method: 'GET',
          path: '/lab/v1/factors',
          title: 'List All Factors',
          description: 'Retrieve all available analytical factors for a specific sport',
          params: [
            { 
              name: 'sport', 
              type: 'select', 
              required: true, 
              description: 'Sport code',
              options: ['nba', 'nfl', 'nhl', 'mlb']
            },
            { 
              name: 'category', 
              type: 'select', 
              required: false, 
              description: 'Filter by category',
              options: ['team_performance', 'matchup', 'situational', 'player', 'market']
            }
          ]
        },
        {
          id: 'get-factor-detail',
          method: 'GET',
          path: '/lab/v1/factors/{id}',
          title: 'Get Factor Details',
          description: 'Get detailed information about a specific factor',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Factor ID', placeholder: 'e.g., 1' }
          ]
        }
      ]
    },
    {
      category: 'Models',
      items: [
        {
          id: 'list-models',
          method: 'GET',
          path: '/lab/v1/models',
          title: 'List Models',
          description: 'Get all your betting models',
          params: [
            { 
              name: 'sport', 
              type: 'select', 
              required: false, 
              description: 'Filter by sport',
              options: ['nba', 'nfl', 'nhl', 'mlb']
            },
            { 
              name: 'bet_type', 
              type: 'select', 
              required: false, 
              description: 'Filter by bet type',
              options: ['spread', 'moneyline', 'over_under']
            }
          ]
        },
        {
          id: 'create-model',
          method: 'POST',
          path: '/lab/v1/models',
          title: 'Create Model',
          description: 'Create a new betting model',
          bodySchema: {
            name: { type: 'string', required: true, description: 'Model name' },
            sport: { type: 'select', required: true, description: 'Sport', options: ['nba', 'nfl', 'nhl', 'mlb'] },
            bet_type: { type: 'select', required: true, description: 'Bet type', options: ['spread', 'moneyline', 'over_under'] },
            mode: { type: 'select', required: true, description: 'Model mode', options: ['simple', 'weighted'] },
            factors: { type: 'array', required: true, description: 'Array of factor configurations' }
          },
          exampleBody: {
            name: "My NBA Spread Model",
            sport: "nba",
            bet_type: "spread",
            mode: "simple",
            factors: [
              {
                factor_id: 1,
                importance: "high",
                config: {}
              }
            ]
          }
        },
        {
          id: 'get-model',
          method: 'GET',
          path: '/lab/v1/models/{id}',
          title: 'Get Model',
          description: 'Get details of a specific model',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        },
        {
          id: 'update-model',
          method: 'PATCH',
          path: '/lab/v1/models/{id}',
          title: 'Update Model',
          description: 'Update an existing model',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ],
          bodySchema: {
            name: { type: 'string', required: false, description: 'New model name' },
            factors: { type: 'array', required: false, description: 'Updated factors' }
          },
          exampleBody: {
            name: "Updated Model Name"
          }
        },
        {
          id: 'delete-model',
          method: 'DELETE',
          path: '/lab/v1/models/{id}',
          title: 'Delete Model',
          description: 'Delete a model',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        }
      ]
    },
    {
      category: 'Predictions',
      items: [
        {
          id: 'list-predictions',
          method: 'GET',
          path: '/lab/v1/predictions',
          title: 'List Predictions',
          description: 'Get predictions for a model',
          params: [
            { name: 'model_id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' },
            { 
              name: 'result', 
              type: 'select', 
              required: false, 
              description: 'Filter by result',
              options: ['win', 'loss', 'push', 'pending']
            },
            { name: 'start_date', type: 'date', required: false, description: 'Start date (YYYY-MM-DD)' },
            { name: 'end_date', type: 'date', required: false, description: 'End date (YYYY-MM-DD)' },
            { name: 'per_page', type: 'number', required: false, description: 'Results per page (1-100)', placeholder: '25' },
            { name: 'cursor', type: 'number', required: false, description: 'Pagination cursor', placeholder: 'Optional' }
          ]
        },
        {
          id: 'get-prediction',
          method: 'GET',
          path: '/lab/v1/predictions/{id}',
          title: 'Get Prediction',
          description: 'Get details of a specific prediction',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Prediction ID', placeholder: 'e.g., 456' }
          ]
        },
        {
          id: 'generate-predictions',
          method: 'POST',
          path: '/lab/v1/models/{id}/predictions/generate',
          title: 'Generate Predictions',
          description: 'Generate new predictions for a model (creates background job)',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        },
        {
          id: 'prediction-stats',
          method: 'GET',
          path: '/lab/v1/predictions/stats',
          title: 'Prediction Statistics',
          description: 'Get aggregated statistics for predictions',
          params: [
            { name: 'model_id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        }
      ]
    },
    {
      category: 'Performance',
      items: [
        {
          id: 'get-performance',
          method: 'GET',
          path: '/lab/v1/models/{id}/performance',
          title: 'Get Performance',
          description: 'Get model performance metrics from backtest',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        },
        {
          id: 'backtest-model',
          method: 'POST',
          path: '/lab/v1/models/{id}/performance',
          title: 'Run Backtest',
          description: 'Start a backtest evaluation (creates background job)',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ],
          bodySchema: {
            seasons: { type: 'array', required: true, description: 'Seasons to backtest (e.g., ["2023", "2024"])' }
          },
          exampleBody: {
            seasons: ["2023", "2024"]
          }
        },
        {
          id: 'delete-performance',
          method: 'DELETE',
          path: '/lab/v1/models/{id}/performance',
          title: 'Clear Performance',
          description: 'Clear performance data for a model',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        },
        {
          id: 'performance-games',
          method: 'GET',
          path: '/lab/v1/models/{id}/performance/games',
          title: 'Performance Games',
          description: 'Get per-game performance results',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' },
            { name: 'limit', type: 'number', required: false, description: 'Results per page', placeholder: '25' },
            { name: 'offset', type: 'number', required: false, description: 'Page offset', placeholder: '0' },
            { 
              name: 'result', 
              type: 'select', 
              required: false, 
              description: 'Filter by result',
              options: ['win', 'loss', 'push']
            }
          ]
        }
      ]
    },
    {
      category: 'Jobs',
      items: [
        {
          id: 'get-job',
          method: 'GET',
          path: '/lab/v1/jobs/{id}',
          title: 'Get Job Status',
          description: 'Check status of a background job',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Job ID', placeholder: 'e.g., job_abc123' }
          ]
        },
        {
          id: 'cancel-job',
          method: 'DELETE',
          path: '/lab/v1/jobs/{id}',
          title: 'Cancel Job',
          description: 'Cancel a running job',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Job ID', placeholder: 'e.g., job_abc123' }
          ]
        },
        {
          id: 'list-active-jobs',
          method: 'GET',
          path: '/lab/v1/models/{id}/jobs/active',
          title: 'List Active Jobs',
          description: 'Get all active jobs for a model',
          params: [
            { name: 'id', type: 'number', required: true, description: 'Model ID', placeholder: 'e.g., 123' }
          ]
        }
      ]
    }
  ];

  const filteredEndpoints = endpoints.map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const generateCurlExample = (endpoint) => {
    const baseUrl = 'https://api.balldontlie.io';
    let path = endpoint.path;
    
    // Replace path parameters with values
    Object.keys(paramValues).forEach(key => {
      if (path.includes(`{${key}}`)) {
        path = path.replace(`{${key}}`, paramValues[key] || `{${key}}`);
      }
    });

    // Add query parameters
    const queryParams = [];
    endpoint.params?.forEach(param => {
      if (!endpoint.path.includes(`{${param.name}}`) && paramValues[param.name]) {
        queryParams.push(`${param.name}=${encodeURIComponent(paramValues[param.name])}`);
      }
    });

    let url = `${baseUrl}${path}`;
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    let curl = `curl -X ${endpoint.method} "${url}"`;
    curl += `\n  -H "Authorization: ${apiKey}"`;
    
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      curl += `\n  -H "Content-Type: application/json"`;
      const body = bodyData || (endpoint.exampleBody ? JSON.stringify(endpoint.exampleBody, null, 2) : '{}');
      curl += `\n  -d '${body}'`;
    }
    
    return curl;
  };

  useEffect(() => {
    if (selectedEndpoint) {
      resetForm();
      // Pre-fill with example body if available
      if (selectedEndpoint.exampleBody) {
        setBodyData(JSON.stringify(selectedEndpoint.exampleBody, null, 2));
      }
    }
  }, [selectedEndpoint]);

  const renderParamInput = (param) => {
    const value = paramValues[param.name] || '';

    if (param.type === 'select' && param.options) {
      return (
        <select
          value={value}
          onChange={(e) => handleParamChange(param.name, e.target.value)}
          className="input"
        >
          <option value="">-- Select {param.name} --</option>
          {param.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    if (param.type === 'date') {
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => handleParamChange(param.name, e.target.value)}
          className="input"
          placeholder={param.placeholder}
        />
      );
    }

    return (
      <input
        type={param.type === 'number' ? 'number' : 'text'}
        value={value}
        onChange={(e) => handleParamChange(param.name, e.target.value)}
        className="input"
        placeholder={param.placeholder || `Enter ${param.name}`}
      />
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Interactive API Explorer
          </h1>
          <p className="text-gray-400">
            Test API endpoints with live data and see real responses
          </p>
        </div>
        <a
          href="https://lab.balldontlie.io/docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Full Docs
        </a>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} className="card card-hover p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Rate Limit</div>
              <div className="text-lg font-bold text-white">100/min</div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card card-hover p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Auth Type</div>
              <div className="text-lg font-bold text-white">API Key</div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card card-hover p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Sports</div>
              <div className="text-lg font-bold text-white">4 Leagues</div>
            </div>
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card card-hover p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Backtest</div>
              <div className="text-lg font-bold text-white">6 Years</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search endpoints..."
          className="input pl-12 w-full"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="p-4 border-b border-dark-700">
              <h3 className="font-semibold text-white">Endpoints</h3>
            </div>
            <div className="p-2">
              {filteredEndpoints.map((category) => (
                <div key={category.category} className="mb-4">
                  <div className="px-3 py-2 text-sm font-medium text-gray-400">
                    {category.category}
                  </div>
                  {category.items.map((endpoint) => (
                    <button
                      key={endpoint.id}
                      onClick={() => setSelectedEndpoint(endpoint)}
                      className={`
                        w-full text-left px-3 py-2 rounded-lg mb-1 transition-all
                        ${selectedEndpoint?.id === endpoint.id
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                          : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`
                          text-xs px-2 py-0.5 rounded font-mono
                          ${endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : ''}
                          ${endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' : ''}
                          ${endpoint.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                          ${endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' : ''}
                        `}>
                          {endpoint.method}
                        </span>
                      </div>
                      <div className="text-sm font-medium">
                        {endpoint.title}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <motion.div
              key={selectedEndpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Endpoint Header */}
              <div className="card p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className={`
                    text-sm px-3 py-1 rounded font-mono font-bold
                    ${selectedEndpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : ''}
                    ${selectedEndpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' : ''}
                    ${selectedEndpoint.method === 'PATCH' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                    ${selectedEndpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' : ''}
                  `}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="flex-1 text-primary-400 font-mono break-all">
                    {selectedEndpoint.path}
                  </code>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedEndpoint.title}
                </h2>
                <p className="text-gray-400">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Parameters Section */}
              {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                <div className="card">
                  <button
                    onClick={() => toggleSection('params')}
                    className="w-full p-4 flex items-center justify-between border-b border-dark-700 hover:bg-dark-800 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">Parameters</h3>
                    {expandedSections.params ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.params && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          {selectedEndpoint.params.map((param) => (
                            <div key={param.name} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-300">
                                  {param.name}
                                </label>
                                {param.required && (
                                  <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                                    required
                                  </span>
                                )}
                                <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                                  {param.type}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{param.description}</p>
                              {renderParamInput(param)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Request Body Section */}
              {(['POST', 'PUT', 'PATCH'].includes(selectedEndpoint.method)) && (
                <div className="card">
                  <button
                    onClick={() => toggleSection('body')}
                    className="w-full p-4 flex items-center justify-between border-b border-dark-700 hover:bg-dark-800 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white">Request Body</h3>
                    {expandedSections.body ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.body && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4">
                          {selectedEndpoint.bodySchema && (
                            <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                              <div className="flex items-start gap-2 mb-2">
                                <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                                <div className="text-sm text-blue-300">
                                  <div className="font-medium mb-1">Schema:</div>
                                  {Object.entries(selectedEndpoint.bodySchema).map(([key, schema]) => (
                                    <div key={key} className="text-xs text-blue-400">
                                      • {key}: {schema.type} {schema.required && '(required)'} - {schema.description}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          <textarea
                            value={bodyData}
                            onChange={(e) => setBodyData(e.target.value)}
                            className="input font-mono text-sm min-h-[200px]"
                            placeholder="Enter JSON request body..."
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Execute Button */}
              <div className="card p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={executeRequest}
                    disabled={isLoading}
                    className="btn btn-primary flex items-center gap-2 flex-1"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        Executing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Execute Request
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetForm}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reset
                  </button>
                  <button
                    onClick={() => copyToClipboard(generateCurlExample(selectedEndpoint), 'curl')}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    {copiedCode === 'curl' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy cURL
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Response Section */}
              {response && (
                <div className="card">
                  <button
                    onClick={() => toggleSection('response')}
                    className="w-full p-4 flex items-center justify-between border-b border-dark-700 hover:bg-dark-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">Response</h3>
                      <span className={`
                        text-sm px-2 py-1 rounded font-mono
                        ${response.status >= 200 && response.status < 300 ? 'bg-green-500/20 text-green-400' : ''}
                        ${response.status >= 400 ? 'bg-red-500/20 text-red-400' : ''}
                        ${response.status === 0 ? 'bg-gray-500/20 text-gray-400' : ''}
                      `}>
                        {response.status} {response.statusText}
                      </span>
                      {response.duration && (
                        <span className="text-sm text-gray-500">
                          {response.duration}ms
                        </span>
                      )}
                    </div>
                    {expandedSections.response ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.response && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4">
                          {response.url && (
                            <div>
                              <div className="text-sm font-medium text-gray-400 mb-2">Request URL:</div>
                              <code className="block text-xs text-primary-400 bg-dark-950 p-3 rounded break-all">
                                {response.url}
                              </code>
                            </div>
                          )}
                          
                          {response.error ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                                <div>
                                  <div className="font-medium text-red-400 mb-1">Error</div>
                                  <div className="text-sm text-red-300">{response.error}</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <div className="text-sm font-medium text-gray-400 mb-2">Response Body:</div>
                                <pre className="bg-dark-950 p-4 rounded-lg overflow-x-auto max-h-96">
                                  <code className="text-sm text-gray-300">
                                    {JSON.stringify(response.data, null, 2)}
                                  </code>
                                </pre>
                              </div>
                              
                              {response.headers && (
                                <div>
                                  <div className="text-sm font-medium text-gray-400 mb-2">Response Headers:</div>
                                  <pre className="bg-dark-950 p-4 rounded-lg overflow-x-auto">
                                    <code className="text-xs text-gray-400">
                                      {JSON.stringify(response.headers, null, 2)}
                                    </code>
                                  </pre>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* cURL Example */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">cURL Command</h3>
                  <button
                    onClick={() => copyToClipboard(generateCurlExample(selectedEndpoint), 'curl-bottom')}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    {copiedCode === 'curl-bottom' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-dark-950 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-green-400">
                    {generateCurlExample(selectedEndpoint)}
                  </code>
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="card p-12 text-center">
              <Code className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Select an Endpoint
              </h3>
              <p className="text-gray-500">
                Choose an endpoint from the sidebar to start testing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
