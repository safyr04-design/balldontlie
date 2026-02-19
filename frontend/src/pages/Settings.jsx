import React from 'react';

export default function Settings({ apiKey }) {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              readOnly
              className="input"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
