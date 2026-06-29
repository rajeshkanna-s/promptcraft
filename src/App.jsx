import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';

// App shell: shared header + routed pages.
export default function App() {
  return (
    <div className="min-h-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header />

      <Routes>
        <Route path="/" element={<GeneratorPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/tools/:toolId" element={<ToolsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
