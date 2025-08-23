import React from 'react';
import { BarChart3, TrendingUp, Target, Zap } from 'lucide-react';

const Analytics = () => {
  const sectorBenchmarks = [
    { sector: 'Technology', score: 84.2, comparison: '+3.8' },
    { sector: 'Healthcare', score: 79.6, comparison: '+7.9' },
    { sector: 'Finance', score: 81.3, comparison: '+6.2' },
    { sector: 'Manufacturing', score: 73.4, comparison: '+14.1' },
    { sector: 'Energy', score: 68.9, comparison: '+18.6' }
  ];

  const kpiMetrics = [
    { name: 'Carbon Intensity', value: '2.4', unit: 'tCO2e/M$', target: '2.0', progress: 80 },
    { name: 'Water Usage', value: '847', unit: 'm³/day', target: '750', progress: 68 },
    { name: 'Waste Diversion', value: '94.2', unit: '%', target: '95', progress: 99 },
    { name: 'Renewable Energy', value: '78', unit: '%', target: '85', progress: 92 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Analytics Hub</h1>
          <p className="text-slate-400 mt-1">Advanced ESG performance analytics and insights</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <span className="text-sm text-slate-300">Real-time Analytics</span>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="glass-morphism p-6 rounded-2xl neural-network">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <Target className="w-6 h-6 text-emerald-400" />
          <span>KPI Performance</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiMetrics.map((kpi, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group float-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {kpi.value} <span className="text-sm text-slate-400">{kpi.unit}</span>
                </div>
                <p className="text-sm text-slate-400">{kpi.name}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Progress to Target</span>
                  <span className="text-emerald-400">{kpi.progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${kpi.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-400">
                  Target: {kpi.target} {kpi.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Sector Benchmarking</span>
          </h3>
          
          <div className="space-y-4">
            {sectorBenchmarks.map((sector, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {sector.sector.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{sector.sector}</p>
                    <p className="text-xs text-slate-400">Industry Average: {sector.score}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">
                    {sector.comparison}
                  </div>
                  <div className="text-xs text-slate-400">vs our score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESG Risk Distribution */}
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Risk Distribution</span>
          </h3>
          
          <div className="relative h-64 flex items-center justify-center">
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {/* Donut Chart */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#1E293B" strokeWidth="20" />
              
              {/* Environmental - 45% */}
              <circle 
                cx="100" cy="100" r="80" fill="none" 
                stroke="#10B981" strokeWidth="20"
                strokeDasharray="226 502"
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000"
              />
              
              {/* Social - 30% */}
              <circle 
                cx="100" cy="100" r="80" fill="none" 
                stroke="#3B82F6" strokeWidth="20"
                strokeDasharray="151 502"
                strokeDashoffset="-226"
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000"
              />
              
              {/* Governance - 25% */}
              <circle 
                cx="100" cy="100" r="80" fill="none" 
                stroke="#8B5CF6" strokeWidth="20"
                strokeDasharray="125 502"
                strokeDashoffset="-377"
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000"
              />
              
              {/* Center text */}
              <text x="100" y="95" fill="white" fontSize="20" textAnchor="middle" fontWeight="bold">
                87.5
              </text>
              <text x="100" y="110" fill="#64748B" fontSize="12" textAnchor="middle">
                ESG Score
              </text>
            </svg>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Environmental</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">45% Weight</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Social</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">30% Weight</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-white">Governance</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">25% Weight</div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-400 mb-1">Strong Environmental Performance</p>
                <p className="text-xs text-slate-300">
                  Your carbon footprint has decreased by 23% this quarter, outperforming 
                  industry benchmarks by 14.1 percentage points.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-400 mb-1">Social Impact Growth</p>
                <p className="text-xs text-slate-300">
                  Employee satisfaction scores have increased by 12% following 
                  diversity and inclusion initiatives.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-400 mb-1">Governance Excellence</p>
                <p className="text-xs text-slate-300">
                  Board diversity targets achieved with 40% female representation, 
                  exceeding the industry average of 28%.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-400 mb-1">Area for Improvement</p>
                <p className="text-xs text-slate-300">
                  Water usage efficiency could be improved. Consider implementing 
                  water recycling systems to achieve 2025 targets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
