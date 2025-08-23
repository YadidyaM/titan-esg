import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';

const DataUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([
    {
      id: 1,
      name: 'carbon-emissions-q4.csv',
      size: '2.3 MB',
      progress: 100,
      status: 'completed',
      type: 'Environmental'
    },
    {
      id: 2,
      name: 'employee-diversity.xlsx',
      size: '1.8 MB',
      progress: 65,
      status: 'processing',
      type: 'Social'
    },
    {
      id: 3,
      name: 'governance-metrics.pdf',
      size: '0.5 MB',
      progress: 0,
      status: 'queued',
      type: 'Governance'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400';
      case 'processing':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const removeFromQueue = (id: number) => {
    setUploadQueue(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Data Upload Center</h1>
          <p className="text-slate-400 mt-1">Upload and process your ESG datasets</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <Upload className="w-5 h-5 text-blue-400" />
          <span className="text-sm text-slate-300">3 Files in Queue</span>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div
            className={`glass-morphism p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isDragOver 
                ? 'border-emerald-400 bg-emerald-400/10' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              // Handle file drop
            }}
          >
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300 ${
                isDragOver 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}>
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragOver ? 'Drop files here' : 'Drag & drop your files'}
              </h3>
              <p className="text-slate-400 mb-6">
                or click to browse your computer
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
                Browse Files
              </button>
              <div className="mt-6 text-xs text-slate-500">
                Supported formats: CSV, Excel, PDF, JSON • Max size: 50MB
              </div>
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="glass-morphism p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Guidelines</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">Data Format</p>
                  <p className="text-xs text-slate-400">Use standardized ESG templates for best results</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">File Organization</p>
                  <p className="text-xs text-slate-400">Include date ranges and categories in filename</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-white">Data Quality</p>
                  <p className="text-xs text-slate-400">Ensure complete data with minimal missing values</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Queue */}
        <div className="glass-morphism p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Processing Queue</h3>
            <span className="text-sm text-slate-400">{uploadQueue.length} files</span>
          </div>

          <div className="space-y-4">
            {uploadQueue.map((file, index) => (
              <div
                key={file.id}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(file.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">{file.size} • {file.type}</p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(file.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
                      >
                        <X className="w-4 h-4 text-slate-400 hover:text-red-400" />
                      </button>
                    </div>
                    
                    {file.status === 'processing' && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Processing...</span>
                          <span className="text-blue-400">{file.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {file.status === 'completed' && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-xs text-emerald-400">Validation: 98% quality score</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <button className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors">
              View upload history →
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <FileText className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">147</div>
          <p className="text-sm text-slate-400">Files Processed Today</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">98.7%</div>
          <p className="text-sm text-slate-400">Success Rate</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">2.3s</div>
          <p className="text-sm text-slate-400">Avg Processing Time</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">12.4GB</div>
          <p className="text-sm text-slate-400">Total Data Uploaded</p>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
