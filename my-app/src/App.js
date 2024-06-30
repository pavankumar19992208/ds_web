import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import P2pHeader from './components/P2pHeader/P2pHeader';
import WelcomeBoard from './components/WelcomeBoard/WelcomeBoard'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<WelcomeBoard  />} />
          <Route path="/p2pheader" element={<P2pHeader />} />
        </Routes>
    </Router>
  );
}

export default App;