import React, { useState } from 'react';
import { X, Database, MapPin, Building, Leaf, Users, Shield, TrendingUp, Calendar, Zap, Eye, Download } from 'lucide-react';
import { ESGDataSet, EPCData, PropertyData } from '@/lib/api/esg-data';

interface DataViewerModalProps {
  dataset: ESGDataSet | null;
  isOpen: boolean;
  onClose: () => void;
}

const DataViewerModal = ({ dataset, isOpen, onClose }: DataViewerModalProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'raw-data' | 'analytics'>('overview');

  if (!isOpen || !dataset) return null;

  const renderEPCData = (data: EPCData[]) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((record, index) => (
            <div key={index} className="glass-morphism p-4 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <Building className="w-5 h-5 text-blue-400" />
                <h4 className="font-semibold text-white">{record.address}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Current Rating:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      record.current_energy_rating === 'A' ? 'bg-emerald-500' :
                      record.current_energy_rating === 'B' ? 'bg-blue-500' :
                      record.current_energy_rating === 'C' ? 'bg-yellow-500' :
                      record.current_energy_rating === 'D' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      {record.current_energy_rating}
                    </div>
                    <span className="text-white">{record.current_energy_efficiency}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-400">Potential Rating:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      record.potential_energy_rating === 'A' ? 'bg-emerald-500' :
                      record.potential_energy_rating === 'B' ? 'bg-blue-500' :
                      record.potential_energy_rating === 'C' ? 'bg-yellow-500' :
                      record.potential_energy_rating === 'D' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      {record.potential_energy_rating}
                    </div>
                    <span className="text-white">{record.potential_energy_efficiency}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-400">CO2 Current:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white">{record.co2_current} kg/m²/year</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      record.co2_current_rating === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                      record.co2_current_rating === 'B' ? 'bg-blue-500/20 text-blue-400' :
                      record.co2_current_rating === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {record.co2_current_rating}
                    </div>
                  </div>
                </div>
                
                <div>
                  <span className="text-slate-400">Energy Consumption:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-white">{record.energy_consumption_current} kWh/m²/year</span>
                    <div className={`px-2 py-1 rounded text-xs ${
                      record.energy_consumption_current_rating === 'A' ? 'bg-emerald-500/20 text-emerald-400' :
                      record.energy_consumption_current_rating === 'B' ? 'bg-blue-500/20 text-blue-400' :
                      record.energy_consumption_current_rating === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {record.energy_consumption_current_rating}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>Property: {record.property_type}</div>
                  <div>Built Form: {record.built_form}</div>
                  <div>Local Authority: {record.local_authority}</div>
                  <div>Inspection: {new Date(record.inspection_date).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPropertyData = (data: PropertyData[]) => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((record, index) => (
            <div key={index} className="glass-morphism p-4 rounded-xl border border-white/10">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold text-white">{record.address}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400">Postcode:</span>
                  <div className="text-white mt-1">{record.postcode}</div>
                </div>
                
                <div>
                  <span className="text-slate-400">Property Type:</span>
                  <div className="text-white mt-1">{record.property_type}</div>
                </div>
                
                <div>
                  <span className="text-slate-400">Tenure:</span>
                  <div className="text-white mt-1">{record.tenure}</div>
                </div>
                
                <div>
                  <span className="text-slate-400">Council Tax:</span>
                  <div className="text-white mt-1">Band {record.council_tax_band}</div>
                </div>
                
                <div>
                  <span className="text-slate-400">Local Authority:</span>
                  <div className="text-white mt-1">{record.local_authority}</div>
                </div>
                
                <div>
                  <span className="text-slate-400">Region:</span>
                  <div className="text-white mt-1">{record.region}</div>
                </div>
              </div>
              
              {record.estimated_value && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <span className="text-slate-400 text-sm">Estimated Value:</span>
                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                      £{record.estimated_value.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRawData = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Raw Data Structure</h3>
          <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
            <Download className="w-4 h-4 inline mr-2" />
            Export JSON
          </button>
        </div>
        
        <div className="glass-morphism p-4 rounded-xl">
          <pre className="text-xs text-slate-300 overflow-auto max-h-96">
            {JSON.stringify(dataset.data, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    const isEPC = dataset.source === 'EPC';
    const isProperty = dataset.source === 'PropertyData';
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-morphism p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-400 mb-1">{dataset.quality}%</div>
            <div className="text-sm text-slate-400">Data Quality</div>
          </div>
          <div className="glass-morphism p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{dataset.compliance_score}%</div>
            <div className="text-sm text-slate-400">Compliance Score</div>
          </div>
          <div className="glass-morphism p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{dataset.records}</div>
            <div className="text-sm text-slate-400">Total Records</div>
          </div>
        </div>
        
        {isEPC && (
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-4">Energy Performance Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-emerald-400 mb-2">A-B Ratings</div>
                <div className="text-sm text-slate-400">High Efficiency Properties</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-orange-400 mb-2">C-D Ratings</div>
                <div className="text-sm text-slate-400">Medium Efficiency Properties</div>
              </div>
            </div>
          </div>
        )}
        
        {isProperty && (
          <div className="glass-morphism p-4 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-4">Property Demographics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-blue-400 mb-2">Freehold</div>
                <div className="text-sm text-slate-400">Property Tenure</div>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <div className="text-3xl font-bold text-purple-400 mb-2">Band H</div>
                <div className="text-sm text-slate-400">Council Tax Band</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden glass-morphism border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{dataset.name}</h2>
              <p className="text-sm text-slate-400 capitalize">{dataset.category} • {dataset.source}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {['overview', 'raw-data', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'overview' && <Eye className="w-4 h-4 inline mr-2" />}
              {tab === 'raw-data' && <Database className="w-4 h-4 inline mr-2" />}
              {tab === 'analytics' && <TrendingUp className="w-4 h-4 inline mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-morphism p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Leaf className="w-5 h-5 text-emerald-400" />
                    <span>Dataset Information</span>
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        dataset.status === 'validated' ? 'bg-emerald-500/20 text-emerald-400' :
                        dataset.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-orange-500/20 text-orange-400'
                      }`}>
                        {dataset.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Records:</span>
                      <span className="text-white">{dataset.records.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Size:</span>
                      <span className="text-white">{dataset.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Last Updated:</span>
                      <span className="text-white">{dataset.lastUpdated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Compliance Score:</span>
                      <span className="text-emerald-400">{dataset.compliance_score}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sustainability:</span>
                      <span className={`${
                        dataset.sustainability_rating === 'Excellent' ? 'text-emerald-400' :
                        dataset.sustainability_rating === 'Good' ? 'text-blue-400' :
                        dataset.sustainability_rating === 'Fair' ? 'text-orange-400' :
                        'text-red-400'
                      }`}>
                        {dataset.sustainability_rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass-morphism p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-400" />
                    <span>Data Quality</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Overall Quality</span>
                        <span className="text-white">{dataset.quality}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${dataset.quality}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Compliance</span>
                        <span className="text-emerald-400">{dataset.compliance_score}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
                          style={{ width: `${dataset.compliance_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Preview */}
              <div className="glass-morphism p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <span>Data Preview</span>
                </h3>
                
                {dataset.source === 'EPC' && dataset.data.length > 0 && 
                  renderEPCData(dataset.data as EPCData[])
                }
                
                {dataset.source === 'PropertyData' && dataset.data.length > 0 && 
                  renderPropertyData(dataset.data as PropertyData[])
                }
                
                {dataset.source === 'Manual' && (
                  <div className="text-center py-8 text-slate-400">
                    <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Manual dataset - no raw data available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'raw-data' && renderRawData()}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>
    </div>
  );
};

export default DataViewerModal;
