'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useESGData } from '@/hooks/useESGData';
import PropertySearch from '@/components/dashboard/property-search';
import { 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Building2,
  Calendar,
  DollarSign,
  Leaf,
  Users,
  Shield,
  Info,
  Eye,
  Database,
  RefreshCw
} from 'lucide-react';

interface DatasetQuery {
  dataset: 'financial' | 'ratings' | 'both';
  searchTerm: string;
  industry: string;
  region: string;
  year: string;
  esgScoreRange: [number, number];
  marketCapRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  limit: number;
}

interface QueryResult {
  id: string;
  companyName: string;
  ticker?: string;
  industry: string;
  region?: string;
  year?: number;
  esgScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  revenue?: number;
  marketCap?: number;
  carbonEmissions?: number;
  lastUpdated?: string;
}

const ESGDataHub = () => {
  const { datasets, loading, error, refreshData } = useESGData();
  const [activeTab, setActiveTab] = useState<'datasets' | 'property-search' | 'query-interface'>('datasets');
  const [queryParams, setQueryParams] = useState<DatasetQuery>({
    dataset: 'both',
    searchTerm: '',
    industry: '',
    region: '',
    year: '',
    esgScoreRange: [0, 100],
    marketCapRange: [0, 10000],
    sortBy: 'esgScore',
    sortOrder: 'desc',
    limit: 100
  });
  const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [showQueryInterface, setShowQueryInterface] = useState(false);

  // Mock data for demonstration - in real app, this would come from backend API
  const mockFinancialData = [
    {
      id: '1',
      companyName: 'Company_1',
      industry: 'Retail',
      region: 'Latin America',
      year: 2018,
      esgScore: 58.0,
      environmentalScore: 62.3,
      socialScore: 33.4,
      governanceScore: 78.3,
      revenue: 558.4,
      marketCap: 283.0,
      carbonEmissions: 42650.1
    },
    {
      id: '2',
      companyName: 'Company_2',
      industry: 'Technology',
      region: 'North America',
      year: 2018,
      esgScore: 72.5,
      environmentalScore: 68.9,
      socialScore: 75.2,
      governanceScore: 73.4,
      revenue: 1250.8,
      marketCap: 1850.0,
      carbonEmissions: 28900.3
    },
    {
      id: '3',
      companyName: 'Company_3',
      industry: 'Manufacturing',
      region: 'Europe',
      year: 2018,
      esgScore: 65.8,
      environmentalScore: 58.7,
      socialScore: 69.1,
      governanceScore: 69.6,
      revenue: 890.2,
      marketCap: 1250.0,
      carbonEmissions: 52300.8
    }
  ];

  const mockRatingsData = [
    {
      id: 'dis',
      companyName: 'Walt Disney Co',
      ticker: 'DIS',
      industry: 'Media',
      esgScore: 1147,
      environmentalScore: 510,
      socialScore: 316,
      governanceScore: 321,
      lastUpdated: '19-04-2022'
    },
    {
      id: 'gm',
      companyName: 'General Motors Co',
      ticker: 'GM',
      industry: 'Automobiles',
      esgScore: 1068,
      environmentalScore: 510,
      socialScore: 303,
      governanceScore: 255,
      lastUpdated: '17-04-2022'
    },
    {
      id: 'gww',
      companyName: 'WW Grainger Inc',
      ticker: 'GWW',
      industry: 'Trading Companies and Distributors',
      esgScore: 880,
      environmentalScore: 255,
      socialScore: 385,
      governanceScore: 240,
      lastUpdated: '19-04-2022'
    }
  ];

  const handlePropertySearch = async (postcode: string) => {
    try {
      // This would call the actual API in production
      const epcData = await fetch(`/api/epc?postcode=${postcode}`).then(res => res.json());
      const propertyData = await fetch(`/api/property?postcode=${postcode}`).then(res => res.json());
      return { epcData, propertyData };
    } catch (error) {
      console.error('Search failed:', error);
      return { epcData: [], propertyData: [] };
    }
  };

  const executeQuery = useCallback(async () => {
    setIsQuerying(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let results: QueryResult[] = [];
      
      if (queryParams.dataset === 'financial' || queryParams.dataset === 'both') {
        results.push(...mockFinancialData);
      }
      
      if (queryParams.dataset === 'ratings' || queryParams.dataset === 'both') {
        results.push(...mockRatingsData);
      }
      
      // Apply filters
      if (queryParams.searchTerm) {
        results = results.filter(item => 
          item.companyName.toLowerCase().includes(queryParams.searchTerm.toLowerCase()) ||
          item.ticker?.toLowerCase().includes(queryParams.searchTerm.toLowerCase())
        );
      }
      
      if (queryParams.industry) {
        results = results.filter(item => 
          item.industry.toLowerCase().includes(queryParams.industry.toLowerCase())
        );
      }
      
      if (queryParams.region) {
        results = results.filter(item => 
          item.region?.toLowerCase().includes(queryParams.region.toLowerCase())
        );
      }
      
      if (queryParams.year) {
        results = results.filter(item => item.year === parseInt(queryParams.year));
      }
      
      // Apply score ranges
      results = results.filter(item => 
        item.esgScore >= queryParams.esgScoreRange[0] && 
        item.esgScore <= queryParams.esgScoreRange[1]
      );
      
      // Apply market cap range
      if (queryParams.marketCapRange[1] > 0) {
        results = results.filter(item => 
          (item.marketCap || 0) >= queryParams.marketCapRange[0] && 
          (item.marketCap || 0) <= queryParams.marketCapRange[1]
        );
      }
      
      // Apply sorting
      results.sort((a, b) => {
        let aValue: any = a[queryParams.sortBy as keyof QueryResult] || 0;
        let bValue: any = b[queryParams.sortBy as keyof QueryResult] || 0;
        
        if (queryParams.sortOrder === 'desc') {
          return bValue - aValue;
        }
        return aValue - bValue;
      });
      
      // Apply limit
      results = results.slice(0, queryParams.limit);
      
      setQueryResults(results);
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setIsQuerying(false);
    }
  }, [queryParams]);

  const exportToExcel = () => {
    if (queryResults.length === 0) return;
    
    // Create CSV content
    const headers = [
      'Company Name', 'Ticker', 'Industry', 'Region', 'Year', 'ESG Score',
      'Environmental Score', 'Social Score', 'Governance Score',
      'Revenue', 'Market Cap', 'Carbon Emissions', 'Last Updated'
    ];
    
    const csvContent = [
      headers.join(','),
      ...queryResults.map(item => [
        item.companyName,
        item.ticker || '',
        item.industry,
        item.region || '',
        item.year || '',
        item.esgScore,
        item.environmentalScore,
        item.socialScore,
        item.governanceScore,
        item.revenue || '',
        item.marketCap || '',
        item.carbonEmissions || '',
        item.lastUpdated || ''
      ].join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `esg-query-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetQuery = () => {
    setQueryParams({
      dataset: 'both',
      searchTerm: '',
      industry: '',
      region: '',
      year: '',
      esgScoreRange: [0, 100],
      marketCapRange: [0, 10000],
      sortBy: 'esgScore',
      sortOrder: 'desc',
      limit: 100
    });
    setQueryResults([]);
  };

  useEffect(() => {
    if (showQueryInterface) {
      executeQuery();
    }
  }, [showQueryInterface]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading ESG datasets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Failed to Load Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We encountered an error while loading the ESG datasets. This could be due to:
          </p>
          <ul className="text-left text-sm text-gray-600 dark:text-gray-400 space-y-1 mb-6">
            <li>• Invalid or expired API keys</li>
            <li>• Network connectivity issues</li>
            <li>• API rate limiting</li>
            <li>• Service maintenance</li>
          </ul>
          <button
            onClick={refreshData}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ESG Data Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive ESG datasets, property analysis, and advanced querying capabilities
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('datasets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'datasets'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Datasets
            </button>
            <button
              onClick={() => setActiveTab('query-interface')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'query-interface'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Query Interface
            </button>
            <button
              onClick={() => setActiveTab('property-search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'property-search'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Building2 className="w-4 h-4 inline mr-2" />
              Property Search
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'datasets' && (
          <div className="space-y-6">
            {/* Dataset Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Datasets</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{datasets.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Data Volume</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {datasets.reduce((sum, dataset) => sum + dataset.records, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Quality</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {datasets.length > 0 
                        ? Math.round(datasets.reduce((sum, dataset) => sum + dataset.quality, 0) / datasets.length)
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <Globe className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sources</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {datasets.filter(dataset => dataset.status === 'validated').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dataset List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Datasets</h3>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{dataset.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{dataset.category} Dataset</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {dataset.records.toLocaleString()} records
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Quality: {dataset.quality}%
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              dataset.status === 'validated' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {dataset.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setActiveTab('query-interface');
                            setQueryParams(prev => ({ ...prev, dataset: 'both' }));
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Query this dataset"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setActiveTab('query-interface');
                            setQueryParams(prev => ({ ...prev, dataset: 'both' }));
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'query-interface' && (
          <div className="space-y-6">
            {/* Query Interface Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ESG Data Query Interface</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Query and analyze ESG datasets with advanced filtering and export capabilities
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={resetQuery}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={executeQuery}
                    disabled={isQuerying}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                  >
                    {isQuerying ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>{isQuerying ? 'Querying...' : 'Execute Query'}</span>
                  </button>
                </div>
              </div>

              {/* Query Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Dataset Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Dataset
                  </label>
                  <select
                    value={queryParams.dataset}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, dataset: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="both">Both Datasets</option>
                    <option value="financial">Financial ESG Data</option>
                    <option value="ratings">ESG Ratings Data</option>
                  </select>
                </div>

                {/* Search Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Term
                  </label>
                  <input
                    type="text"
                    placeholder="Company name or ticker..."
                    value={queryParams.searchTerm}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Technology, Retail..."
                    value={queryParams.industry}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., North America, Europe..."
                    value={queryParams.region}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2018"
                    value={queryParams.year}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, year: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* ESG Score Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ESG Score Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={queryParams.esgScoreRange[0]}
                      onChange={(e) => setQueryParams(prev => ({ 
                        ...prev, 
                        esgScoreRange: [parseInt(e.target.value) || 0, prev.esgScoreRange[1]] 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={queryParams.esgScoreRange[1]}
                      onChange={(e) => setQueryParams(prev => ({ 
                        ...prev, 
                        esgScoreRange: [prev.esgScoreRange[0], parseInt(e.target.value) || 100] 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Market Cap Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Market Cap Range (M)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={queryParams.marketCapRange[0]}
                      onChange={(e) => setQueryParams(prev => ({ 
                        ...prev, 
                        marketCapRange: [parseInt(e.target.value) || 0, prev.marketCapRange[1]] 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={queryParams.marketCapRange[1]}
                      onChange={(e) => setQueryParams(prev => ({ 
                        ...prev, 
                        marketCapRange: [prev.marketCapRange[0], parseInt(e.target.value) || 10000] 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={queryParams.sortBy}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="esgScore">ESG Score</option>
                    <option value="companyName">Company Name</option>
                    <option value="industry">Industry</option>
                    <option value="revenue">Revenue</option>
                    <option value="marketCap">Market Cap</option>
                    <option value="carbonEmissions">Carbon Emissions</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={queryParams.sortOrder}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, sortOrder: e.target.value as 'asc' | 'desc' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>

                {/* Result Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Result Limit
                  </label>
                  <input
                    type="number"
                    placeholder="100"
                    value={queryParams.limit}
                    onChange={(e) => setQueryParams(prev => ({ ...prev, limit: parseInt(e.target.value) || 100 }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Query Results */}
            {queryResults.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Query Results ({queryResults.length} companies)
                    </h3>
                    <button
                      onClick={exportToExcel}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export to Excel</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Company
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Industry
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          ESG Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Environmental
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Social
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Governance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Financial
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {queryResults.map((company) => (
                        <tr key={company.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {company.companyName}
                              </div>
                              {company.ticker && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {company.ticker}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {company.industry}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {company.esgScore}
                            </div>
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(company.esgScore / 1200) * 100}%` }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {company.environmentalScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {company.socialScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {company.governanceScore}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {company.revenue && (
                              <div>Revenue: ${company.revenue}M</div>
                            )}
                            {company.marketCap && (
                              <div>Market Cap: ${company.marketCap}M</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* No Results */}
            {queryResults.length === 0 && !isQuerying && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Results Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters to find matching companies.
                </p>
                <button
                  onClick={executeQuery}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Run Default Query
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'property-search' && (
          <PropertySearch onSearch={handlePropertySearch} />
        )}
      </div>
    </div>
  );
};

export default ESGDataHub;
