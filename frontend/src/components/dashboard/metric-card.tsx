import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: LucideIcon;
  color: 'emerald' | 'blue' | 'purple' | 'cyan' | 'orange';
  description: string;
  delay?: number;
}

const MetricCard = ({ title, value, change, changeType, icon: Icon, color, description, delay = 0 }: MetricCardProps) => {
  const colorClasses = {
    emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20',
    blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
    purple: 'from-purple-500 to-purple-600 shadow-purple-500/20',
    cyan: 'from-cyan-500 to-cyan-600 shadow-cyan-500/20',
    orange: 'from-orange-500 to-orange-600 shadow-orange-500/20'
  };

  const iconColors = {
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400'
  };

  return (
    <div 
      className="glass-morphism p-6 rounded-2xl hover:scale-105 transition-all duration-300 float-animation group relative"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-1">
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {change}
          </span>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      {/* Animated bottom border */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${colorClasses[color]} group-hover:w-full transition-all duration-500 rounded-full`}></div>
    </div>
  );
};

export default MetricCard;
