import React from 'react';

export default function Models({ apiKey }) {
  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Models</h1>
        <p>Create and manage your betting models</p>
      </div>
      <div className="card">
        <h3>Your Models</h3>
        <p className="text-secondary">Connect to the API to manage your models</p>
      </div>
    </div>
  );
}
