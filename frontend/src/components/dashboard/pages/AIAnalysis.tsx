import React from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const AIAnalysis = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">AI Analysis Hub</h1>
          <p className="text-slate-400 mt-1">Advanced AI-powered ESG insights and predictions</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
          <span className="text-sm text-slate-300">Neural Network Active</span>
        </div>
      </div>

      {/* Neural Network Visualization */}
      <div className="glass-morphism p-8 rounded-2xl neural-network">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">ESG Neural Network</h2>
          <p className="text-slate-400">Real-time AI processing of sustainability data</p>
        </div>

        <div className="relative h-64 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 600 200">
            {/* Network Nodes */}
            <circle cx="100" cy="100" r="12" fill="#10B981" className="animate-pulse">
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="60" r="10" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '0.5s'}} />
            <circle cx="200" cy="140" r="10" fill="#3B82F6" className="animate-pulse" style={{animationDelay: '1s'}} />
            <circle cx="300" cy="80" r="8" fill="#8B5CF6" className="animate-pulse" style={{animationDelay: '1.5s'}} />
            <circle cx="300" cy="120" r="8" fill="#8B5CF6" className="animate-pulse" style={{animationDelay: '0.7s'}} />
            <circle cx="400" cy="60" r="8" fill="#0EA5E9" className="animate-pulse" style={{animationDelay: '0.3s'}} />
            <circle cx="400" cy="140" r="8" fill="#0EA5E9" className="animate-pulse" style={{animationDelay: '1.2s'}} />
            <circle cx="500" cy="100" r="12" fill="#F59E0B" className="animate-pulse" style={{animationDelay: '0.8s'}}>
              <animate attributeName="r" values="8;16;8" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Network Connections */}
            <line x1="100" y1="100" x2="200" y2="60" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="100" y1="100" x2="200" y2="140" stroke="rgba(16, 185, 129, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="200" y1="60" x2="300" y2="80" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="200" y1="140" x2="300" y2="120" stroke="rgba(59, 130, 246, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="300" y1="80" x2="400" y2="60" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="300" y1="120" x2="400" y2="140" stroke="rgba(139, 92, 246, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="400" y1="60" x2="500" y2="100" stroke="rgba(14, 165, 233, 0.6)" strokeWidth="2" className="carbon-flow" />
            <line x1="400" y1="140" x2="500" y2="100" stroke="rgba(14, 165, 233, 0.6)" strokeWidth="2" className="carbon-flow" />

            {/* Labels */}
            <text x="100" y="130" fill="white" fontSize="10" textAnchor="middle">Input</text>
            <text x="250" y="40" fill="white" fontSize="10" textAnchor="middle">Layer 1</text>
            <text x="350" y="40" fill="white" fontSize="10" textAnchor="middle">Layer 2</text>
            <text x="500" y="130" fill="white" fontSize="10" textAnchor="middle">Output</text>
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">Environmental</div>
            <div className="text-sm text-slate-400">87% Processed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">Social</div>
            <div className="text-sm text-slate-400">94% Processed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-400">Governance</div>
            <div className="text-sm text-slate-400">91% Processed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-400">ESG Score</div>
            <div className="text-sm text-slate-400">87.5/100</div>
          </div>
        </div>
      </div>

      {/* Analysis Queue and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span>Analysis Queue</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-white">Carbon Footprint Analysis</p>
                  <p className="text-xs text-slate-400">Processing Q4 emissions data</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-400">72%</div>
                <div className="w-16 h-2 bg-slate-700 rounded-full mt-1">
                  <div className="w-3/4 h-full bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">Supply Chain Risk Assessment</p>
                  <p className="text-xs text-slate-400">Analysis completed</p>
                </div>
              </div>
              <div className="text-sm text-emerald-400">Complete</div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-white">Compliance Monitoring</p>
                  <p className="text-xs text-slate-400">Queued for processing</p>
                </div>
              </div>
              <div className="text-sm text-slate-400">Pending</div>
            </div>
          </div>
        </div>

        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Key Insights</span>
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400">Carbon Reduction Success</p>
                  <p className="text-xs text-slate-300 mt-1">
                    AI detected 23% reduction in carbon emissions compared to last quarter
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">Social Impact Growth</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Employee satisfaction scores increased by 15% with new diversity initiatives
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-400">Governance Alert</p>
                  <p className="text-xs text-slate-300 mt-1">
                    Board diversity targets need attention - recommendation: add 2 female directors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center float-animation">
          <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">127</div>
          <p className="text-sm text-slate-400">AI Models Active</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center float-animation" style={{animationDelay: '0.2s'}}>
          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">99.7%</div>
          <p className="text-sm text-slate-400">Accuracy Rate</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center float-animation" style={{animationDelay: '0.4s'}}>
          <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">847</div>
          <p className="text-sm text-slate-400">Insights Generated</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center float-animation" style={{animationDelay: '0.6s'}}>
          <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">1.2s</div>
          <p className="text-sm text-slate-400">Avg Analysis Time</p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
