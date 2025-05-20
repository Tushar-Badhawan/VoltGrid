import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import VoltGrid from './components/VoltGrid';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/voltgrid" element={<VoltGrid />} />
      </Routes>
    </Router>
  );
}

export default App;
