import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TeamManagement from './components/TeamManagement';
import ScorecardManagement from './components/ScorecardManagement';
import './App.css'; 
function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/teams">Manage Teams</Link></li>
            <li><Link to="/scorecards">Manage Scorecards</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<TeamManagement />} />
          <Route path="/scorecards" element={<ScorecardManagement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
