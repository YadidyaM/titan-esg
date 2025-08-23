import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

const Compliance = () => {
  const complianceItems = [
    {
      id: 1,
      regulation: 'EU Taxonomy Regulation',
      category: 'Environmental',
      status: 'compliant',
      lastReview: '2024-12-15',
      nextReview: '2025-03-15',
      riskLevel: 'low'
    },
    {
      id: 2,
      regulation: 'CSRD Directive',
      category: 'Reporting',
      status: 'pending',
      lastReview: '2024-11-30',
      nextReview: '2025-01-30',
      riskLevel: 'medium'
    },
    {
      id: 3,
      regulation: 'SFDR Article 9',
      category: 'Financial',
      status: 'compliant',
      lastReview: '2024-12-10',
      nextReview: '2025-06-10',
      riskLevel: 'low'
    },
    {
      id: 4,
      regulation: 'TCFD Recommendations',
      category: 'Climate',
      status: 'review',
      lastReview: '2024-12-01',
      nextReview: '2025-02-01',
      riskLevel: 'high'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-400" />;
      case 'review':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default:
        return <Shield className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-emerald-400 bg-emerald-400/20';
      case 'pending': return 'text-orange-400 bg-orange-400/20';
      case 'review': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-orange-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Compliance Hub</h1>
          <p className="text-slate-400 mt-1">Monitor and manage regulatory compliance</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <Shield className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-slate-300">92.1% Compliant</span>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <p className="text-sm text-slate-400">Fully Compliant</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">3</div>
          <p className="text-sm text-slate-400">Under Review</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">1</div>
          <p className="text-sm text-slate-400">Needs Attention</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">+5%</div>
          <p className="text-sm text-slate-400">This Quarter</p>
        </div>
      </div>

      {/* Risk Assessment Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span>Risk Assessment</span>
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-400">High Risk</span>
                <span className="text-xs text-slate-400">1 item</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div className="w-1/12 h-full bg-red-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-400">Medium Risk</span>
                <span className="text-xs text-slate-400">3 items</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div className="w-3/12 h-full bg-orange-500 rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-emerald-400">Low Risk</span>
                <span className="text-xs text-slate-400">12 items</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div className="w-full h-full bg-emerald-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-morphism p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Compliance Trends</span>
          </h3>
          
          <div className="h-48 flex items-end space-x-2">
            {[65, 72, 78, 85, 89, 92].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t"
                  style={{ height: `${value}%` }}
                ></div>
                <span className="text-xs text-slate-400 mt-2">
                  {['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <span className="text-sm text-emerald-400">+27% improvement this year</span>
          </div>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Regulatory Requirements</h3>
        
        <div className="space-y-4">
          {complianceItems.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(item.status)}
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {item.regulation}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-slate-400">{item.category}</span>
                    <span className={`text-xs font-medium ${getRiskColor(item.riskLevel)}`}>
                      {item.riskLevel} risk
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Last Review</div>
                  <div className="text-sm text-white">{item.lastReview}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Next Review</div>
                  <div className="text-sm text-white">{item.nextReview}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Required Actions</h3>
        
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-400">TCFD Climate Risk Disclosure</p>
                <p className="text-xs text-slate-300 mt-1">
                  Climate risk assessment report due in 30 days. Schedule board review meeting.
                </p>
                <button className="text-xs text-red-400 hover:text-red-300 mt-2">
                  Take action →
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-400">CSRD Reporting Preparation</p>
                <p className="text-xs text-slate-300 mt-1">
                  Begin data collection for Corporate Sustainability Reporting Directive.
                </p>
                <button className="text-xs text-orange-400 hover:text-orange-300 mt-2">
                  Start preparation →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
