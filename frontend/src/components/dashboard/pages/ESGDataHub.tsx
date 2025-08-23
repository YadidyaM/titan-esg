import React, { useState } from 'react';
import { Search, Filter, Database, TrendingUp, Leaf, Users, Shield } from 'lucide-react';

const ESGDataHub = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const datasets = [
    {
      id: 1,
      name: 'Carbon Emissions Q4 2024',
      category: 'environmental',
      records: 1247,
      lastUpdated: '2 hours ago',
      quality: 98,
      status: 'validated',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Employee Diversity Metrics',
      category: 'social',
      records: 892,
      lastUpdated: '1 day ago',
      quality: 94,
      status: 'processing',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Board Governance Structure',
      category: 'governance',
      records: 156,
      lastUpdated: '3 days ago',
      quality: 100,
      status: 'validated',
      size: '0.5 MB'
    },
    {
      id: 4,
      name: 'Water Usage Monitoring',
      category: 'environmental',
      records: 2104,
      lastUpdated: '5 hours ago',
      quality: 91,
      status: 'validated',
      size: '3.1 MB'
    },
    {
      id: 5,
      name: 'Supply Chain Ethics',
      category: 'social',
      records: 634,
      lastUpdated: '2 days ago',
      quality: 89,
      status: 'review',
      size: '1.2 MB'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Data', icon: Database, color: 'slate' },
    { id: 'environmental', label: 'Environmental', icon: Leaf, color: 'emerald' },
    { id: 'social', label: 'Social', icon: Users, color: 'blue' },
    { id: 'governance', label: 'Governance', icon: Shield, color: 'purple' }
  ];

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'text-emerald-400 bg-emerald-400/20';
      case 'processing': return 'text-blue-400 bg-blue-400/20';
      case 'review': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">ESG Data Hub</h1>
          <p className="text-slate-400 mt-1">Manage and explore your sustainability datasets</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <span className="text-sm text-slate-300">5 Datasets Active</span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="glass-morphism p-6 rounded-2xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search datasets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50"
            />
          </div>
          <div className="flex space-x-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-400'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dataset Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDatasets.map((dataset, index) => (
          <div
            key={dataset.id}
            className="glass-morphism p-6 rounded-2xl hover:scale-105 transition-all duration-300 float-animation group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {dataset.name}
                  </h3>
                  <p className="text-sm text-slate-400 capitalize">{dataset.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(dataset.status)}`}>
                {dataset.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Records</span>
                <span className="text-sm font-medium text-white">{dataset.records.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Data Quality</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000"
                      style={{ width: `${dataset.quality}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-white">{dataset.quality}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Size</span>
                <span className="text-sm font-medium text-white">{dataset.size}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Last Updated</span>
                <span className="text-sm font-medium text-white">{dataset.lastUpdated}</span>
              </div>
            </div>

            <div className="mt-6 flex space-x-2">
              <button className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                View Data
              </button>
              <button className="px-4 py-2 bg-white/5 text-slate-400 rounded-lg text-sm font-medium hover:bg-white/10 hover:text-white transition-colors">
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center">
          <div className="text-3xl font-bold hologram-text mb-2">5.2TB</div>
          <p className="text-slate-400">Total Data Volume</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center">
          <div className="text-3xl font-bold hologram-text mb-2">94.2%</div>
          <p className="text-slate-400">Average Data Quality</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center">
          <div className="text-3xl font-bold hologram-text mb-2">32</div>
          <p className="text-slate-400">Active Data Sources</p>
        </div>
      </div>
    </div>
  );
};

export default ESGDataHub;
