// src/components/Analyst.js
import React from 'react';
import '../styles/Analyst.css';


const getEdgeColor = (flow, capacity) => {
const ratio = flow / capacity;
if (ratio < 0.3) return 'blue';
if (ratio <= 0.8) return 'green';
return 'red';
};

const getStatusColor = (status) => {
switch (status) {
case 'met': return 'green';
case 'partially_met': return 'orange';
case 'unmet': return 'red';
default: return 'gray';
}
};

const Analyst = ({ maxFlow, edgeFlows = {}, nodeStatus = {} }) => {
return ( <div className="analyst-container"> <h2>🔍 Power Flow Analysis Report</h2>

```
  <div className="summary-box">
    <h3>Total Maximum Flow: ⚡ {maxFlow} kW</h3>
  </div>

  <div className="section">
    <h4>📊 Edge Flows</h4>
    <table className="flow-table">
      <thead>
        <tr>
          <th>Edge ID</th>
          <th>Flow</th>
          <th>Capacity</th>
          <th>Usage %</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(edgeFlows).map(([id, { flow, capacity }]) => (
          <tr key={id} style={{ color: getEdgeColor(flow, capacity) }}>
            <td>{id}</td>
            <td>{flow} kW</td>
            <td>{capacity} kW</td>
            <td>{Math.round((flow / capacity) * 100)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="section">
    <h4>🧩 Node Status</h4>
    <div className="node-status-grid">
      {Object.entries(nodeStatus).map(([nodeId, status]) => (
        <div key={nodeId} className="node-status-card">
          <div
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(status) }}
          />
          <div className="node-id">{nodeId}</div>
          <div className="node-status-label">{status.replace('_', ' ')}</div>
        </div>
      ))}
    </div>
  </div>
</div>

);
};

export default Analyst;
