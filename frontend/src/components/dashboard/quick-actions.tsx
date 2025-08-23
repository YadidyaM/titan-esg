import React, { useState } from 'react';
import { Upload, Brain, FileText, Shield, ChevronRight, Zap, Activity } from 'lucide-react';

interface QuickActionsProps {
  onActionClick?: (actionId: string) => void;
}

const QuickActions = ({ onActionClick }: QuickActionsProps) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'data-upload',
      icon: Upload,
      title: 'Upload ESG Data',
      description: 'Upload CSV or Excel files',
      color: 'blue',
      bgColor: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-400 to-blue-500',
      shadowColor: 'shadow-blue-500/25',
      borderColor: 'border-blue-400/30',
      status: 'Ready',
      count: '+12 today'
    },
    {
      id: 'ai-analysis',
      icon: Brain,
      title: 'AI Analysis',
      description: 'Run AI-powered ESG analysis',
      color: 'purple',
      bgColor: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-400 to-purple-500',
      shadowColor: 'shadow-purple-500/25',
      borderColor: 'border-purple-400/30',
      status: 'Active',
      count: '3 running'
    },
    {
      id: 'reports',
      icon: FileText,
      title: 'Generate Report',
      description: 'Create compliance reports',
      color: 'emerald',
      bgColor: 'from-emerald-500 to-emerald-600',
      hoverColor: 'from-emerald-400 to-emerald-500',
      shadowColor: 'shadow-emerald-500/25',
      borderColor: 'border-emerald-400/30',
      status: 'Ready',
      count: '8 templates'
    },
    {
      id: 'compliance',
      icon: Shield,
      title: 'Compliance Check',
      description: 'Verify regulatory compliance',
      color: 'orange',
      bgColor: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-400 to-orange-500',
      shadowColor: 'shadow-orange-500/25',
      borderColor: 'border-orange-400/30',
      status: 'Alert',
      count: '2 pending'
    }
  ];

  const handleActionClick = async (action: any) => {
    if (processingAction) return;

    setActiveAction(action.id);
    setProcessingAction(action.id);

    // Simulate processing
    setTimeout(() => {
      setProcessingAction(null);
      setActiveAction(null);
      onActionClick?.(action.id);
    }, 1500);
  };

  return (
    <div className="glass-morphism p-6 rounded-2xl neural-network">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        <div className="flex items-center space-x-1">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400 font-medium">Live</span>
        </div>
      </div>
      <p className="text-sm text-slate-400 mb-6">Common tasks and shortcuts</p>
      
      <div className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isProcessing = processingAction === action.id;
          const isActive = activeAction === action.id;
          
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              disabled={processingAction !== null}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-500 ${
                isProcessing 
                  ? 'scale-105 shadow-2xl border border-white/20' 
                  : 'hover:scale-102 hover:shadow-lg border border-transparent'
              } ${processingAction && !isProcessing ? 'opacity-50' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${
                isProcessing ? action.hoverColor : 'from-white/5 to-white/10'
              } transition-all duration-500`} />
              
              {/* Processing Animation */}
              {isProcessing && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
              )}
              
              <div className="relative flex items-center space-x-4 p-4">
                {/* Icon Container */}
                <div className={`relative p-3 rounded-xl bg-gradient-to-r ${
                  isProcessing ? action.hoverColor : action.bgColor
                } shadow-lg transition-all duration-500 ${
                  isProcessing ? `${action.shadowColor} shadow-2xl glow-effect` : `group-hover:${action.shadowColor} group-hover:shadow-xl`
                }`}>
                  {isProcessing ? (
                    <div className="w-5 h-5 relative">
                      <Zap className="w-5 h-5 text-white animate-spin" />
                      <div className="absolute inset-0 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Icon className={`w-5 h-5 text-white transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    }`} />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium transition-colors duration-300 ${
                      isProcessing ? 'text-white' : 'text-white group-hover:text-emerald-400'
                    }`}>
                      {action.title}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                      action.status === 'Active' ? 'text-emerald-400 bg-emerald-400/20' :
                      action.status === 'Alert' ? 'text-orange-400 bg-orange-400/20' :
                      'text-slate-400 bg-slate-400/20'
                    }`}>
                      {action.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-slate-400">{action.description}</p>
                    <span className="text-xs text-slate-500">{action.count}</span>
                  </div>
                  
                  {/* Processing Status */}
                  {isProcessing && (
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse" style={{
                          animation: 'data-stream 1.5s ease-in-out infinite'
                        }} />
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">Processing...</span>
                    </div>
                  )}
                </div>
                
                {/* Arrow Indicator */}
                <div className={`transition-all duration-300 ${
                  isProcessing ? 'opacity-0 translate-x-2' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-1'
                }`}>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              
              {/* Bottom Border Animation */}
              <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${action.bgColor} transition-all duration-500 ${
                isProcessing ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          );
        })}
      </div>
      
      {/* Activity Indicator */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            {processingAction ? 'Processing action...' : 'All systems operational'}
          </span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              processingAction ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400'
            }`} />
            <span className="text-slate-400">
              {processingAction ? 'Busy' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
