import React from 'react';

export default function FactorAnalysis({ apiKey }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Factor Analysis</h1>
        <p>Explore and analyze betting factors</p>
      </div>
      <div className="card">
        <h3>Available Factors</h3>
        <p className="text-secondary">Connect to the API to view factors</p>
      </div>
    </div>
  );
}
