import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, Code, Database, Zap, Shield, Clock, 
  CheckCircle, AlertCircle, Search, ChevronDown,
  ChevronRight, Copy, ExternalLink
} from 'lucide-react';

export default function ApiDocs({ apiKey }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
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
            { name: 'sport', type: 'string', required: true, description: 'Sport code (nba, nfl, nhl, mlb)' },
            { name: 'category', type: 'string', required: false, description: 'Filter by category' }
          ]
        },
        {
          id: 'get-factor-detail',
          method: 'GET',
          path: '/lab/v1/factors/{id}',
          title: 'Get Factor Details',
          description: 'Get detailed information about a specific factor',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Factor ID' }
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
            { name: 'sport', type: 'string', required: false, description: 'Filter by sport' },
            { name: 'bet_type', type: 'string', required: false, description: 'Filter by bet type' }
          ]
        },
        {
          id: 'create-model',
          method: 'POST',
          path: '/lab/v1/models',
          title: 'Create Model',
          description: 'Create a new betting model',
          body: {
            name: 'string',
            sport: 'string',
            bet_type: 'string',
            factors: 'array'
          }
        },
        {
          id: 'get-model',
          method: 'GET',
          path: '/lab/v1/models/{id}',
          title: 'Get Model',
          description: 'Get details of a specific model',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
          ]
        },
        {
          id: 'update-model',
          method: 'PATCH',
          path: '/lab/v1/models/{id}',
          title: 'Update Model',
          description: 'Update an existing model',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
          ]
        },
        {
          id: 'delete-model',
          method: 'DELETE',
          path: '/lab/v1/models/{id}',
          title: 'Delete Model',
          description: 'Delete a model',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
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
            { name: 'model_id', type: 'string', required: true, description: 'Model ID' },
            { name: 'result', type: 'string', required: false, description: 'Filter by result' },
            { name: 'start_date', type: 'string', required: false, description: 'Start date (YYYY-MM-DD)' },
            { name: 'end_date', type: 'string', required: false, description: 'End date (YYYY-MM-DD)' }
          ]
        },
        {
          id: 'get-prediction',
          method: 'GET',
          path: '/lab/v1/predictions/{id}',
          title: 'Get Prediction',
          description: 'Get details of a specific prediction',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Prediction ID' }
          ]
        },
        {
          id: 'generate-predictions',
          method: 'POST',
          path: '/lab/v1/models/{id}/predictions/generate',
          title: 'Generate Predictions',
          description: 'Generate new predictions for a model',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
          ]
        },
        {
          id: 'prediction-stats',
          method: 'GET',
          path: '/lab/v1/predictions/stats',
          title: 'Prediction Statistics',
          description: 'Get aggregated statistics for predictions',
          params: [
            { name: 'model_id', type: 'string', required: true, description: 'Model ID' }
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
          description: 'Get model performance metrics',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
          ]
        },
        {
          id: 'backtest-model',
          method: 'POST',
          path: '/lab/v1/models/{id}/performance',
          title: 'Run Backtest',
          description: 'Start a backtest evaluation',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
          ],
          body: {
            seasons: 'array'
          }
        },
        {
          id: 'performance-games',
          method: 'GET',
          path: '/lab/v1/models/{id}/performance/games',
          title: 'Performance Games',
          description: 'Get per-game performance results',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' },
            { name: 'limit', type: 'number', required: false, description: 'Results per page' },
            { name: 'offset', type: 'number', required: false, description: 'Page offset' }
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
            { name: 'id', type: 'string', required: true, description: 'Job ID' }
          ]
        },
        {
          id: 'cancel-job',
          method: 'DELETE',
          path: '/lab/v1/jobs/{id}',
          title: 'Cancel Job',
          description: 'Cancel a running job',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Job ID' }
          ]
        },
        {
          id: 'list-active-jobs',
          method: 'GET',
          path: '/lab/v1/models/{id}/jobs/active',
          title: 'List Active Jobs',
          description: 'Get all active jobs for a model',
          params: [
            { name: 'id', type: 'string', required: true, description: 'Model ID' }
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
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;
    curl += `\n  -H "Authorization: ${apiKey}"`;
    
    if (endpoint.body) {
      curl += `\n  -H "Content-Type: application/json"`;
      curl += `\n  -d '${JSON.stringify(endpoint.body, null, 2)}'`;
    }
    
    return curl;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            API Documentation
          </h1>
          <p className="text-gray-400">
            Complete reference for the Ball Don't Lie Lab API
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card card-hover p-4"
        >
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card card-hover p-4"
        >
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card card-hover p-4"
        >
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

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card card-hover p-4"
        >
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

      {/* Endpoints */}
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
              className="space-y-6"
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

              {/* Parameters */}
              {selectedEndpoint.params && selectedEndpoint.params.length > 0 && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Parameters</h3>
                  <div className="space-y-3">
                    {selectedEndpoint.params.map((param) => (
                      <div key={param.name} className="border border-dark-700 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="text-primary-400 font-mono">
                            {param.name}
                          </code>
                          <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">
                            {param.type}
                          </span>
                          {param.required && (
                            <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">
                              required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Request Body */}
              {selectedEndpoint.body && (
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Request Body</h3>
                  <pre className="bg-dark-950 p-4 rounded-lg overflow-x-auto">
                    <code className="text-sm text-gray-300">
                      {JSON.stringify(selectedEndpoint.body, null, 2)}
                    </code>
                  </pre>
                </div>
              )}

              {/* Code Example */}
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Example Request</h3>
                  <button
                    onClick={() => copyToClipboard(generateCurlExample(selectedEndpoint), selectedEndpoint.id)}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    {copiedCode === selectedEndpoint.id ? (
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
              <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Select an Endpoint
              </h3>
              <p className="text-gray-500">
                Choose an endpoint from the sidebar to view documentation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
