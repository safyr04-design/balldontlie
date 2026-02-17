import React, { useState, useEffect } from 'react';

export default function Dashboard({ apiKey }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your betting models and performance</p>
      </div>

      <div className="grid grid-4">
        <StatCard title="Active Models" value="0" change="+0" />
        <StatCard title="Win Rate" value="0%" change="+0%" />
        <StatCard title="ROI" value="0%" change="+0%" color="success" />
        <StatCard title="Predictions" value="0" change="+0" />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Recent Models</h3>
          <p className="text-secondary">No models created yet</p>
          <p className="mt-4">
            Create your first model using our pre-built strategies in the Models section.
          </p>
        </div>

        <div className="card">
          <h3>High Confidence Picks</h3>
          <p className="text-secondary">No predictions available</p>
          <p className="mt-4">
            Generate predictions from your models to see high-confidence picks here.
          </p>
        </div>
      </div>

      <div className="card">
        <h3>Quick Start Guide</h3>
        <div className="quick-start-grid">
          <QuickStartItem
            step="1"
            title="Explore Factors"
            description="Visit the Analysis tab to explore available factors for each sport"
          />
          <QuickStartItem
            step="2"
            title="Create a Model"
            description="Go to Models and create your first betting model with pre-built strategies"
          />
          <QuickStartItem
            step="3"
            title="Backtest"
            description="Run historical backtests to evaluate your model's performance"
          />
          <QuickStartItem
            step="4"
            title="Generate Predictions"
            description="Create predictions for upcoming games and track your results"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, color = 'primary' }) {
  return (
    <div className="card">
      <div className="stat-card">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change stat-change-${color}`}>{change}</div>
      </div>
    </div>
  );
}

function QuickStartItem({ step, title, description }) {
  return (
    <div className="quick-start-item">
      <div className="quick-start-step">{step}</div>
      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
