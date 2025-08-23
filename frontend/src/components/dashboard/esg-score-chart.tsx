import React from 'react';
import { Leaf, Users, Shield, TrendingUp } from 'lucide-react';

const ESGChart = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const environmentalData = [65, 72, 78, 81, 85, 87, 84, 88, 91, 89, 92, 87];
  const socialData = [70, 75, 73, 78, 80, 82, 85, 83, 86, 88, 85, 80];
  const governanceData = [75, 78, 82, 79, 83, 85, 88, 90, 87, 91, 89, 84];

  const currentMonth = 'Feb';
  const currentScores = { environmental: 87, social: 80, governance: 84 };

  return (
    <div className="glass-morphism p-6 rounded-2xl neural-network">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">ESG Performance Trend</h3>
          <p className="text-sm text-slate-400">Monthly ESG scores across Environmental, Social, and Governance dimensions</p>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-emerald-400 font-medium">Trending Up</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-80 mb-6">
        <svg className="w-full h-full" viewBox="0 0 800 300">
          <defs>
            <linearGradient id="environmentalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="socialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05"/>
            </linearGradient>
            <linearGradient id="governanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 75, 150, 225, 300].map((y, i) => (
            <line key={i} x1="60" y1={y} x2="740" y2={y} stroke="#334155" strokeOpacity="0.3" strokeWidth="1"/>
          ))}
          
          {/* Y-axis labels */}
          {[100, 75, 50, 25, 0].map((value, i) => (
            <text key={i} x="45" y={i * 75 + 5} fill="#64748B" fontSize="12" textAnchor="end">
              {value}
            </text>
          ))}

          {/* Area Charts */}
          <path
            d={`M 60,${300 - environmentalData[0] * 3} ${environmentalData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')} L 720,300 L 60,300 Z`}
            fill="url(#environmentalGradient)"
          />
          <path
            d={`M 60,${300 - socialData[0] * 3} ${socialData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')} L 720,300 L 60,300 Z`}
            fill="url(#socialGradient)"
          />
          <path
            d={`M 60,${300 - governanceData[0] * 3} ${governanceData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')} L 720,300 L 60,300 Z`}
            fill="url(#governanceGradient)"
          />

          {/* Lines */}
          <path
            d={`M 60,${300 - environmentalData[0] * 3} ${environmentalData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          <path
            d={`M 60,${300 - socialData[0] * 3} ${socialData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          <path
            d={`M 60,${300 - governanceData[0] * 3} ${governanceData.map((val, i) => 
              `L ${60 + (i * 60)},${300 - val * 3}`).join(' ')}`}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            className="drop-shadow-lg"
          />

          {/* Data points */}
          {environmentalData.map((val, i) => (
            <circle
              key={`env-${i}`}
              cx={60 + (i * 60)}
              cy={300 - val * 3}
              r="4"
              fill="#10B981"
              className="drop-shadow-lg hover:r-6 transition-all duration-200"
            />
          ))}

          {/* Month labels */}
          {months.map((month, i) => (
            <text
              key={month}
              x={60 + (i * 60)}
              y={320}
              fill="#64748B"
              fontSize="11"
              textAnchor="middle"
            >
              {month}
            </text>
          ))}

          {/* Highlight current month */}
          <rect
            x={60 + (months.indexOf(currentMonth) * 60) - 25}
            y={-10}
            width="50"
            height="320"
            fill="rgba(16, 185, 129, 0.1)"
            stroke="rgba(16, 185, 129, 0.3)"
            strokeWidth="1"
            rx="8"
          />
        </svg>

        {/* Tooltip for current month */}
        <div className="absolute top-4 left-32 glass-morphism p-3 rounded-xl">
          <p className="text-xs text-slate-400 mb-1">{currentMonth}</p>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-xs text-white">Environmental: {currentScores.environmental}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-white">Social: {currentScores.social}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-white">Governance: {currentScores.governance}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-2">
          <Leaf className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">Environmental</span>
          <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-white">Social</span>
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-white">Governance</span>
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ESGChart;
