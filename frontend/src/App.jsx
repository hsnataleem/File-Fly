import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Download from './pages/Download';
import HowItWorks from './pages/HowItWorks';
import ActiveTransfers from './pages/ActiveTransfers';
import ErrorBoundary from './ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/active-transfers" element={<ActiveTransfers />} />
          <Route path="/file/:id" element={<Download />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
