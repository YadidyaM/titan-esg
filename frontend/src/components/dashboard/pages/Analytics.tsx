import React from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Target, Users, Leaf, Shield } from 'lucide-react';

const Analytics = () => {
  const performanceMetrics = [
    { category: 'Environmental', score: 87, target: 90, trend: '+2.3%', color: 'emerald' },
    { category: 'Social', score: 80, target: 85, trend: '+1.8%', color: 'blue' },
    { category: 'Governance', score: 84, target: 88, trend: '+0.9%', color: 'purple' }
  ];

  const dataSources = [
    { name: 'Internal Systems', percentage: 45, color: 'emerald' },
    { name: 'IoT Sensors', percentage: 28, color: 'blue' },
    { name: 'External APIs', percentage: 18, color: 'purple' },
    { name: 'Manual Entry', percentage: 9, color: 'orange' }
  ];

  const kpis = [
    { name: 'Carbon Intensity', value: '2.3', unit: 'tCO2e/MWh', change: '-12%', trend: 'down' },
    { name: 'Energy Efficiency', value: '87.4', unit: '%', change: '+5.2%', trend: 'up' },
    { name: 'Water Usage', value: '1.2', unit: 'm³/ton', change: '-8.7%', trend: 'down' },
    { name: 'Waste Reduction', value: '23.1', unit: '%', change: '+3.4%', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Analytics Hub</h1>
          <p className="text-slate-400 mt-1">Advanced ESG analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-slate-300">Real-time Analytics</span>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div
            key={metric.category}
            className="glass-morphism p-6 rounded-2xl hover:scale-105 transition-all duration-300 float-animation"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{metric.category}</h3>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-600 flex items-center justify-center`}>
                {metric.category === 'Environmental' && <Leaf className="w-6 h-6 text-white" />}
                {metric.category === 'Social' && <Users className="w-6 h-6 text-white" />}
                {metric.category === 'Governance' && <Shield className="w-6 h-6 text-white" />}
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white mb-1">{metric.score}</div>
              <div className="text-sm text-slate-400">Target: {metric.target}</div>
            </div>
            
            <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
              <div 
                className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400 rounded-full transition-all duration-1000`}
                style={{ width: `${(metric.score / metric.target) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* KPI Dashboard */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Target className="w-6 h-6 text-emerald-400" />
          <span>Key Performance Indicators</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, index) => (
            <div
              key={kpi.name}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <h4 className="text-sm font-medium text-slate-400 mb-2">{kpi.name}</h4>
                <div className="text-2xl font-bold text-white mb-1">
                  {kpi.value}
                  <span className="text-sm text-slate-400 ml-1">{kpi.unit}</span>
                </div>
                <div className={`flex items-center justify-center space-x-1 ${
                  kpi.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingUp className="w-4 h-4 transform rotate-180" />
                  )}
                  <span className="text-sm font-medium">{kpi.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Sources */}
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-blue-400" />
            <span>Data Sources</span>
          </h3>
          
          <div className="space-y-4">
            {dataSources.map((source, index) => (
              <div
                key={source.name}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-${source.color}-500`}></div>
                  <span className="text-sm font-medium text-white">{source.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${source.color}-500 transition-all duration-1000`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Trend Analysis</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Carbon Emissions Trend</span>
                <span className="text-sm text-emerald-400">-12.3%</span>
              </div>
              <div className="h-16 bg-slate-800 rounded-lg p-2">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path
                    d="M 0,35 L 20,30 L 40,25 L 60,20 L 80,15 L 100,10"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />
                  <circle cx="100" cy="10" r="2" fill="#10B981" />
                </svg>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Energy Efficiency</span>
                <span className="text-sm text-blue-400">+5.2%</span>
              </div>
              <div className="h-16 bg-slate-800 rounded-lg p-2">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path
                    d="M 0,25 L 20,22 L 40,18 L 60,15 L 80,12 L 100,8"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    className="drop-shadow-lg"
                  />
                  <circle cx="100" cy="8" r="2" fill="#3B82F6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Advanced Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30">
            <div className="text-3xl font-bold text-white mb-2">94.7%</div>
            <p className="text-sm text-slate-400">Data Accuracy</p>
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div className="w-[94.7%] h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <div className="text-3xl font-bold text-white mb-2">2.3s</div>
            <p className="text-sm text-slate-400">Avg Response Time</p>
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div className="w-[85%] h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
            <div className="text-3xl font-bold text-white mb-2">99.9%</div>
            <p className="text-sm text-slate-400">Uptime</p>
            <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
              <div className="w-[99.9%] h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data Stream */}
      <div className="relative overflow-hidden glass-morphism rounded-2xl p-1">
        <div className="h-2 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent data-stream"></div>
        <div className="text-center py-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-400 font-medium">Live Data Stream</span>
          </div>
          <span className="text-xs text-slate-500">Processing 2,847 data points per second</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
