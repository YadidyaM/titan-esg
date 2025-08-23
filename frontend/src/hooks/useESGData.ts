import { useState, useEffect, useCallback } from 'react';
import { esgDataService, ESGDataSet } from '@/lib/api/esg-data';

export const useESGData = () => {
  const [datasets, setDatasets] = useState<ESGDataSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch ESG datasets
  const fetchDatasets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await esgDataService.generateESGDatasets();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ESG data');
      console.error('Error fetching ESG datasets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Filter datasets based on search and category
  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dataset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get statistics
  const statistics = {
    totalVolume: datasets.reduce((sum, dataset) => {
      const sizeInMB = parseFloat(dataset.size.replace(' MB', ''));
      return sum + sizeInMB;
    }, 0),
    averageQuality: datasets.length > 0 
      ? Math.round(datasets.reduce((sum, dataset) => sum + dataset.quality, 0) / datasets.length)
      : 0,
    activeSources: datasets.filter(dataset => dataset.status === 'validated').length,
    totalRecords: datasets.reduce((sum, dataset) => sum + dataset.records, 0)
  };

  // Effect to fetch data on mount and refresh
  useEffect(() => {
    fetchDatasets();
  }, [fetchDatasets, refreshTrigger]);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    datasets: filteredDatasets,
    allDatasets: datasets,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    refreshData,
    statistics
  };
};
