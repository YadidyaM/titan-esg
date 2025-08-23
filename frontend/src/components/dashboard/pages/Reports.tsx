import React from 'react';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

const Reports = () => {
  const reports = [
    {
      id: 1,
      title: 'Q4 2024 ESG Performance Report',
      type: 'Quarterly Report',
      date: '2024-12-31',
      status: 'completed',
      size: '2.4 MB',
      downloads: 127
    },
    {
      id: 2,
      title: 'Carbon Emissions Analysis',
      type: 'Environmental Report',
      date: '2024-12-15',
      status: 'completed',
      size: '1.8 MB',
      downloads: 89
    },
    {
      id: 3,
      title: 'Social Impact Assessment',
      type: 'Social Report',
      date: '2024-12-10',
      status: 'processing',
      size: '3.1 MB',
      downloads: 0
    },
    {
      id: 4,
      title: 'Governance Compliance Review',
      type: 'Compliance Report',
      date: '2024-12-05',
      status: 'completed',
      size: '1.2 MB',
      downloads: 156
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/20';
      case 'draft': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Reports Center</h1>
          <p className="text-slate-400 mt-1">Generate and manage ESG performance reports</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-300">Schedule Report</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
            <FileText className="w-5 h-5" />
            <span className="text-sm">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">24</div>
          <p className="text-sm text-slate-400">Reports Generated</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Download className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">847</div>
          <p className="text-sm text-slate-400">Total Downloads</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">3.2k</div>
          <p className="text-sm text-slate-400">Report Views</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <p className="text-sm text-slate-400">Scheduled Reports</p>
        </div>
      </div>

      {/* Report Templates */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Report Templates</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-6 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 hover:from-emerald-500/30 hover:to-green-500/30 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">ESG Performance</h4>
              <p className="text-sm text-slate-400">Comprehensive ESG scorecard</p>
            </div>
          </button>

          <button className="p-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">Carbon Footprint</h4>
              <p className="text-sm text-slate-400">Detailed emissions analysis</p>
            </div>
          </button>

          <button className="p-6 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 group">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-white font-medium mb-1">Compliance Report</h4>
              <p className="text-sm text-slate-400">Regulatory compliance status</p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Reports</h3>
        
        <div className="space-y-4">
          {reports.map((report, index) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                    {report.title}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-slate-400">{report.type}</span>
                    <span className="text-xs text-slate-400">{report.date}</span>
                    <span className="text-xs text-slate-400">{report.size}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <div className="text-right">
                  <div className="text-sm text-slate-400">{report.downloads} downloads</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>
                  <button className="p-2 hover:bg-emerald-500/20 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
