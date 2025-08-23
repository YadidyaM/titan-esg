'use client'

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Navigation from '../navigation';
import DashboardHome from './pages/DashboardHome';
import ESGDataHub from '../../app/esg-data/page';
import DataUpload from '../../app/data-upload/page';
import AIAnalysis from '../../app/ai-analysis/page';
import CarbonFootprintCalculator from './pages/CarbonFootprintCalculator';
import AITradingBotMarketplace from './pages/AITradingBotMarketplace';
import DynamicESGVisualization from './pages/DynamicESGVisualization';
import Reports from '../../app/reports/page';
import Compliance from '../../app/compliance/page';
import Blockchain from './pages/Blockchain';
import Settings from '../../app/settings/page';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardHome onNavigate={setActiveTab} />;
      case 'esg-data': return <ESGDataHub />;
      case 'data-upload': return <DataUpload />;
      case 'ai-analysis': return <AIAnalysis />;
      case 'carbon-calculator': return <CarbonFootprintCalculator />;
      case 'trading-bots': return <AITradingBotMarketplace />;
      case 'esg-visualization': return <DynamicESGVisualization />;
      case 'reports': return <Reports />;
      case 'compliance': return <Compliance />;
      case 'blockchain': return <Blockchain />;
      case 'settings': return <Settings />;
      default: return <DashboardHome onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navigation />
      
      <div className="flex min-h-screen relative z-10 pt-16">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
