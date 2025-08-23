import React from 'react';
import { 
  Home, Database, Upload, Brain, FileText, Shield, 
  Link2, Settings, Leaf, Zap, Bot, BarChart3 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: 'text-emerald-400' },
    { id: 'esg-data', icon: Database, label: 'ESG Data', color: 'text-blue-400' },
    { id: 'data-upload', icon: Upload, label: 'Data Upload', color: 'text-cyan-400' },
    { id: 'ai-analysis', icon: Brain, label: 'AI Analysis', color: 'text-purple-400' },
    { id: 'carbon-calculator', icon: Leaf, label: 'Carbon Calculator', color: 'text-green-400' },
    { id: 'trading-bots', icon: Bot, label: 'Trading Bots', color: 'text-pink-400' },
    { id: 'esg-visualization', icon: BarChart3, label: 'ESG Visualization', color: 'text-orange-400' },
    { id: 'reports', icon: FileText, label: 'Reports', color: 'text-indigo-400' },
    { id: 'compliance', icon: Shield, label: 'Compliance', color: 'text-orange-400' },
    { id: 'blockchain', icon: Link2, label: 'Blockchain', color: 'text-yellow-400' },
    { id: 'settings', icon: Settings, label: 'Settings', color: 'text-slate-400' },
  ];

  return (
    <div className="w-64 glass-morphism m-4 rounded-2xl relative overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center glow-effect">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold hologram-text">Titan ESG</h1>
            <p className="text-xs text-slate-400">Sustainability Platform</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group hover:transform hover:scale-105 ${
                    activeTab === item.id 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 shadow-lg shadow-emerald-500/20' 
                      : 'hover:bg-white/5 hover:border hover:border-white/10'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-all duration-300 ${
                      activeTab === item.id ? item.color : 'text-slate-400 group-hover:text-slate-300'
                    }`} 
                  />
                  <span 
                    className={`text-sm font-medium transition-all duration-300 ${
                      activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="glass-morphism p-4 rounded-xl">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Carbon Credits</span>
          </div>
          <div className="text-2xl font-bold text-white">1,247</div>
          <div className="text-xs text-slate-400">+89 this month</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
