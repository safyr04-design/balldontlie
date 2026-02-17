import React from 'react';

export default function Predictions({ apiKey }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Predictions</h1>
        <p>View and track your betting predictions</p>
      </div>
      <div className="card">
        <h3>Active Predictions</h3>
        <p className="text-secondary">No predictions available</p>
      </div>
    </div>
  );
}
