import React from 'react';
import { TrendingUp, Leaf, Shield, DollarSign, Brain, AlertTriangle, ArrowUpRight } from 'lucide-react';
import MetricCard from '../metric-card';
import ESGChart from '../esg-score-chart';
import QuickActions from '../quick-actions';
import RecentActivity from '../recent-activity';

interface DashboardHomeProps {
  onNavigate?: (tabId: string) => void;
}

const DashboardHome = ({ onNavigate }: DashboardHomeProps) => {
  const handleQuickAction = (actionId: string) => {
    // Map action IDs to navigation tab IDs
    const navigationMap: { [key: string]: string } = {
      'data-upload': 'data-upload',
      'ai-analysis': 'ai-analysis',
      'reports': 'reports',
      'compliance': 'compliance'
    };
    
    const tabId = navigationMap[actionId];
    if (tabId && onNavigate) {
      onNavigate(tabId);
    }
  };
  const metrics = [
    {
      title: 'Overall ESG Score',
      value: '87.5',
      change: '+2.3',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'emerald' as const,
      description: 'from last month'
    },
    {
      title: 'Data Quality',
      value: '94.2%',
      change: '+1.8%',
      changeType: 'positive' as const,
      icon: Leaf,
      color: 'blue' as const,
      description: 'from last month'
    },
    {
      title: 'Compliance Status',
      value: '92.1%',
      change: '+0.5%',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'purple' as const,
      description: 'from last month'
    },
    {
      title: 'Carbon Credits',
      value: '1,247',
      change: '+89',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'cyan' as const,
      description: 'from last month'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">ESG Dashboard</h1>
          <p className="text-slate-400 mt-1">Comprehensive sustainability insights and analytics</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-slate-300">AI Analysis: Active</span>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} delay={index * 0.1} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ESG Performance Chart */}
        <div className="lg:col-span-2">
          <ESGChart />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions onActionClick={handleQuickAction} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        
        {/* Risk Alert Panel */}
        <div className="glass-morphism p-6 rounded-2xl float-animation">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Risk Alerts</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 animate-pulse"></div>
              <div>
                <p className="text-sm text-white font-medium">Medium Risk: Water Usage</p>
                <p className="text-xs text-slate-400">Consumption exceeded target by 12%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse"></div>
              <div>
                <p className="text-sm text-white font-medium">Low Risk: Supply Chain</p>
                <p className="text-xs text-slate-400">2 suppliers pending ESG verification</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-white font-medium">Resolved: Energy Efficiency</p>
                <p className="text-xs text-slate-400">Solar panel installation completed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Stream Visualization */}
      <div className="relative overflow-hidden glass-morphism rounded-2xl p-1">
        <div className="h-2 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent data-stream"></div>
        <div className="text-center py-2">
          <span className="text-xs text-slate-500">Real-time ESG data processing</span>
        </div>
      </div>

      {/* AI-Powered Features Section */}
      <div className="glass-morphism p-6 rounded-2xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Brain className="w-6 h-6 text-purple-400 mr-2" />
          AI-Powered Sustainability Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Carbon Footprint Calculator */}
          <div 
            onClick={() => onNavigate('carbon-calculator')}
            className="glass-morphism p-6 rounded-xl border border-white/10 hover:border-emerald-400/50 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌱</div>
            <h3 className="text-xl font-bold text-white mb-2">Carbon Footprint Calculator</h3>
            <p className="text-slate-400 text-sm mb-4">
              Discover your environmental impact with our AI-powered calculator. Get personalized recommendations to reduce your carbon footprint.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-sm font-medium">AI Powered</span>
              <ArrowUpRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>

          {/* AI Trading Bot Marketplace */}
          <div 
            onClick={() => onNavigate('trading-bots')}
            className="glass-morphism p-6 rounded-xl border border-white/10 hover:border-pink-400/50 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">AI Trading Bot Marketplace</h3>
            <p className="text-slate-400 text-sm mb-4">
              Deploy AI-powered trading bots for carbon credits. Get AI analysis of strategies and optimize your sustainable investments.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-pink-400 text-sm font-medium">AI Powered</span>
              <ArrowUpRight className="w-5 h-5 text-pink-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>

          {/* Dynamic ESG Visualization */}
          <div 
            onClick={() => onNavigate('esg-visualization')}
            className="glass-morphism p-6 rounded-xl border border-white/10 hover:border-orange-400/50 transition-all duration-300 cursor-pointer group hover:transform hover:scale-105"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Dynamic ESG Visualization</h3>
            <p className="text-slate-400 text-sm mb-4">
              Interactive ESG score tracking with AI-powered insights, trend analysis, and actionable recommendations.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-orange-400 text-sm font-medium">AI Powered</span>
              <ArrowUpRight className="w-5 h-5 text-orange-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
