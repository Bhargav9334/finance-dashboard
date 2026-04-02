import React from 'react';
import { useStore } from './store';
import { generateMockTransactions } from './utils';
import { Dashboard } from './components/Dashboard';
import { DashboardDark } from './components/DashboardDark';
import { DashboardMinimal } from './components/DashboardMinimal';
import { DashboardCompact } from './components/DashboardCompact';
import { DashboardMaterial } from './components/DashboardMaterial';
import { DashboardGlass } from './components/DashboardGlass';
import { DashboardRetro } from './components/DashboardRetro';
import { DashboardNature } from './components/DashboardNature';
import './index.css';

function App() {
  const setTransactions = useStore(state => state.setTransactions);
  const [theme, setTheme] = React.useState('default');

  React.useEffect(() => {
    // Initialize with mock data
    const mockTransactions = generateMockTransactions();
    setTransactions(mockTransactions);
  }, [setTransactions]);

  const renderDashboard = () => {
    switch(theme) {
      case 'dark':
        return <DashboardDark />;
      case 'minimal':
        return <DashboardMinimal />;
      case 'compact':
        return <DashboardCompact />;
      case 'material':
        return <DashboardMaterial />;
      case 'glass':
        return <DashboardGlass />;
      case 'retro':
        return <DashboardRetro />;
      case 'nature':
        return <DashboardNature />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="relative">
      {/* Theme Selector */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="default">Default Theme</option>
          <option value="dark">Dark Theme</option>
          <option value="minimal">Minimalist</option>
          <option value="compact">Mobile Compact</option>
          <option value="material">Material Design</option>
          <option value="glass">Glassmorphism</option>
          <option value="retro">Retro 80s</option>
          <option value="nature">Nature Theme</option>
        </select>
      </div>

      {renderDashboard()}
    </div>
  );
}

export default App;
