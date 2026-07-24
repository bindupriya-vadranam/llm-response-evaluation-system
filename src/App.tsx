import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Evaluate from './pages/Evaluate';
import Processing from './pages/Processing';
import Results from './pages/Results';
import KnowledgeBase from './pages/KnowledgeBase';
import Architecture from './pages/Architecture';
import HistoryPage from './pages/HistoryPage';
import Analytics from './pages/Analytics';
import About from './pages/About';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/evaluate" element={<Evaluate />} />
          <Route path="/processing" element={<Processing />} />
          <Route path="/results" element={<Results />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
