'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calendar, 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  TrendingUp,
  Globe,
  Users,
  Shield,
  Zap,
  Save,
  Share2,
  Filter,
  Search
} from 'lucide-react';
import { mongodbService } from '@/lib/services/mongodb';
import { aiAnalysisService } from '@/lib/services/ai-analysis';

interface Report {
  id: string;
  title: string;
  type: 'quarterly' | 'environmental' | 'social' | 'governance' | 'comprehensive' | 'custom';
  status: 'draft' | 'processing' | 'completed' | 'failed';
  date: Date;
  size: number;
  downloads: number;
  userId: string;
  aiAnalysisId?: string;
  template?: string;
  content?: any;
  metadata: {
    esgScore?: number;
    carbonReduction?: number;
    complianceStatus?: string;
    riskLevel?: string;
    recommendations?: string[];
    customFields?: Record<string, any>;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'esg_performance' | 'carbon_footprint' | 'compliance' | 'custom';
  color: string;
  icon: React.ReactNode;
  fields: string[];
  sections: string[];
}

interface CustomReportBuilder {
  isOpen: boolean;
  selectedTemplate: ReportTemplate | null;
  reportData: any;
  currentSection: string;
}

const ReportsCenter = () => {
  // State management
  const [reports, setReports] = useState<Report[]>([]);
  const [templates] = useState<ReportTemplate[]>([
    {
      id: 'esg_performance',
      name: 'ESG Performance',
      description: 'Comprehensive ESG scorecard',
      category: 'esg_performance',
      color: 'bg-green-500',
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      fields: ['esgScore', 'environmentalScore', 'socialScore', 'governanceScore', 'trends', 'benchmarks'],
      sections: ['Executive Summary', 'ESG Metrics', 'Performance Analysis', 'Recommendations', 'Appendices']
    },
    {
      id: 'carbon_footprint',
      name: 'Carbon Footprint',
      description: 'Detailed emissions analysis',
      category: 'carbon_footprint',
      color: 'bg-blue-500',
      icon: <Globe className="w-6 h-6 text-white" />,
      fields: ['carbonEmissions', 'energyConsumption', 'reductionTargets', 'offsetPrograms', 'compliance'],
      sections: ['Emissions Overview', 'Energy Analysis', 'Reduction Strategies', 'Compliance Status', 'Future Plans']
    },
    {
      id: 'compliance',
      name: 'Compliance Report',
      description: 'Regulatory compliance status',
      category: 'compliance',
      color: 'bg-purple-500',
      icon: <Shield className="w-6 h-6 text-white" />,
      fields: ['complianceStatus', 'regulations', 'auditResults', 'riskAssessment', 'actionItems'],
      sections: ['Compliance Overview', 'Regulatory Requirements', 'Audit Results', 'Risk Assessment', 'Action Plan']
    }
  ]);
  
  const [reportBuilder, setReportBuilder] = useState<CustomReportBuilder>({
    isOpen: false,
    selectedTemplate: null,
    reportData: {},
    currentSection: ''
  });
  
  const [stats, setStats] = useState({
    reportsGenerated: 0,
    totalDownloads: 0,
    reportViews: 0,
    scheduledReports: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock user ID for demo purposes
  const userId = 'user_1';

  useEffect(() => {
    loadReports();
    loadStats();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      // In real app, this would call mongodbService.getUserReports(userId)
      const mockReports: Report[] = [
        {
          id: '1',
          title: 'Q4 2024 ESG Performance Report',
          type: 'quarterly',
          status: 'completed',
          date: new Date('2024-12-31'),
          size: 2.4 * 1024 * 1024, // 2.4 MB
          downloads: 127,
          userId,
          aiAnalysisId: 'analysis_1',
          metadata: {
            esgScore: 78,
            carbonReduction: 23,
            complianceStatus: 'compliant',
            riskLevel: 'medium',
            recommendations: [
              'Implement smart energy monitoring systems',
              'Upgrade to LED lighting across facilities',
              'Develop supplier sustainability program'
            ]
          },
          createdAt: new Date('2024-12-31'),
          updatedAt: new Date('2024-12-31')
        },
        {
          id: '2',
          title: 'Carbon Emissions Analysis',
          type: 'environmental',
          status: 'completed',
          date: new Date('2024-12-15'),
          size: 1.8 * 1024 * 1024, // 1.8 MB
          downloads: 89,
          userId,
          aiAnalysisId: 'analysis_2',
          metadata: {
            esgScore: 82,
            carbonReduction: 35,
            complianceStatus: 'compliant',
            riskLevel: 'low',
            recommendations: [
              'Install solar panels on warehouse roofs',
              'Optimize HVAC systems for energy efficiency',
              'Implement carbon offset program'
            ]
          },
          createdAt: new Date('2024-12-15'),
          updatedAt: new Date('2024-12-15')
        },
        {
          id: '3',
          title: 'Social Impact Assessment',
          type: 'social',
          status: 'processing',
          date: new Date('2024-12-10'),
          size: 3.1 * 1024 * 1024, // 3.1 MB
          downloads: 0,
          userId,
          metadata: {
            esgScore: 75,
            complianceStatus: 'partially_compliant',
            riskLevel: 'medium'
          },
          createdAt: new Date('2024-12-10'),
          updatedAt: new Date('2024-12-10')
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // In real app, this would call mongodbService.getReportStats(userId)
      setStats({
        reportsGenerated: reports.length,
        totalDownloads: reports.reduce((sum, report) => sum + report.downloads, 0),
        reportViews: Math.floor(reports.reduce((sum, report) => sum + report.downloads, 0) * 3.8), // Estimate views
        scheduledReports: 12
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const openReportBuilder = (template: ReportTemplate) => {
    setReportBuilder({
      isOpen: true,
      selectedTemplate: template,
      reportData: {
        title: `New ${template.name} Report`,
        sections: template.sections.reduce((acc, section) => {
          acc[section] = '';
          return acc;
        }, {} as Record<string, string>),
        metadata: {}
      },
      currentSection: template.sections[0]
    });
  };

  const closeReportBuilder = () => {
    setReportBuilder({
      isOpen: false,
      selectedTemplate: null,
      reportData: {},
      currentSection: ''
    });
  };

  const updateReportSection = (section: string, content: string) => {
    setReportBuilder(prev => ({
      ...prev,
      reportData: {
        ...prev.reportData,
        sections: {
          ...prev.reportData.sections,
          [section]: content
        }
      }
    }));
  };

  const saveReport = async () => {
    try {
      if (!reportBuilder.selectedTemplate) return;
      
      const newReport: Omit<Report, 'id'> = {
        title: reportBuilder.reportData.title || 'Untitled Report',
        type: reportBuilder.selectedTemplate.category === 'esg_performance' ? 'comprehensive' : 
              reportBuilder.selectedTemplate.category === 'carbon_footprint' ? 'environmental' : 'custom',
        status: 'draft',
        date: new Date(),
        size: JSON.stringify(reportBuilder.reportData).length,
        downloads: 0,
        userId,
        template: reportBuilder.selectedTemplate.id,
        content: reportBuilder.reportData,
        metadata: {
          customFields: reportBuilder.reportData.metadata
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // In real app, this would call mongodbService.createReport(newReport)
      const savedReport: Report = {
        ...newReport,
        id: `report_${Date.now()}`
      };
      
      setReports(prev => [savedReport, ...prev]);
      closeReportBuilder();
      
      // Refresh stats
      loadStats();
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  };

  const downloadReport = async (reportId: string) => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;
      
      // In real app, this would generate and download the actual report file
      const reportContent = generateReportContent(report);
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Update download count
      setReports(prev => prev.map(r => 
        r.id === reportId ? { ...r, downloads: r.downloads + 1 } : r
      ));
      
      // Refresh stats
      loadStats();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  const generateReportContent = (report: Report): string => {
    let content = `${report.title}\n`;
    content += `Generated on: ${report.date.toLocaleDateString()}\n`;
    content += `Type: ${report.type}\n`;
    content += `Status: ${report.status}\n\n`;
    
    if (report.metadata.esgScore) {
      content += `ESG Score: ${report.metadata.esgScore}/100\n`;
    }
    if (report.metadata.carbonReduction) {
      content += `Carbon Reduction: ${report.metadata.carbonReduction}%\n`;
    }
    if (report.metadata.complianceStatus) {
      content += `Compliance Status: ${report.metadata.complianceStatus}\n`;
    }
    if (report.metadata.riskLevel) {
      content += `Risk Level: ${report.metadata.riskLevel}\n`;
    }
    
    if (report.metadata.recommendations) {
      content += `\nRecommendations:\n`;
      report.metadata.recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec}\n`;
      });
    }
    
    if (report.content?.sections) {
      content += `\nReport Content:\n`;
      Object.entries(report.content.sections).forEach(([section, sectionContent]) => {
        content += `\n${section}:\n${sectionContent}\n`;
      });
    }
    
    return content;
  };

  const deleteReport = async (reportId: string) => {
    try {
      // In real app, this would call mongodbService.deleteReport(reportId)
      setReports(prev => prev.filter(r => r.id !== reportId));
      loadStats();
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const scheduleReport = () => {
    // In real app, this would open a scheduling interface
    alert('Report scheduling feature coming soon!');
  };

  const filteredAndSortedReports = reports
    .filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || report.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'date') {
        aValue = a.date.getTime();
        bValue = b.date.getTime();
      }
      
      if (sortOrder === 'desc') {
        return bValue - aValue;
      }
      return aValue - bValue;
    });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
      processing: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', icon: <Clock className="w-4 h-4" /> },
      draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', icon: <Edit3 className="w-4 h-4" /> },
      failed: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', icon: <AlertCircle className="w-4 h-4" /> }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate and manage ESG performance reports
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-3">
            <button
              onClick={scheduleReport}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Report</span>
            </button>
          </div>
          <button
            onClick={() => openReportBuilder(templates[0])}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reports Generated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reportsGenerated}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalDownloads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Report Views</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.reportViews.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Scheduled Reports</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.scheduledReports}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`${template.color} rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => openReportBuilder(template)}
              >
                <div className="flex items-center justify-between mb-2">
                  {template.icon}
                  <Plus className="w-5 h-5 text-white opacity-80" />
                </div>
                <h4 className="text-white font-semibold mb-1">{template.name}</h4>
                <p className="text-white text-sm opacity-90">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="quarterly">Quarterly</option>
                <option value="environmental">Environmental</option>
                <option value="social">Social</option>
                <option value="governance">Governance</option>
                <option value="comprehensive">Comprehensive</option>
                <option value="custom">Custom</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
              </select>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Reports</h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reports...</p>
            </div>
          ) : filteredAndSortedReports.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No reports found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Get started by generating your first report using one of our templates.'
                }
              </p>
              {!searchTerm && filterType === 'all' && (
                <button
                  onClick={() => openReportBuilder(templates[0])}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Generate Report
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAndSortedReports.map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{report.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {report.type.replace('_', ' ')} Report
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {report.date.toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(report.size)}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {report.downloads} downloads
                        </div>
                        {report.metadata.esgScore && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ESG Score: {report.metadata.esgScore}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* View report details */}}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="View report"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => downloadReport(report.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                          title="Download report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteReport(report.id)}
                          className="p-2 text-red-400 hover:text-red-600 transition-colors"
                          title="Delete report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Builder Modal */}
      {reportBuilder.isOpen && reportBuilder.selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Create {reportBuilder.selectedTemplate.name} Report
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={closeReportBuilder}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveReport}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Report</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex h-96">
              {/* Sidebar - Section Navigation */}
              <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Report Sections</h4>
                  <div className="space-y-2">
                    {reportBuilder.selectedTemplate.sections.map((section) => (
                      <button
                        key={section}
                        onClick={() => setReportBuilder(prev => ({ ...prev, currentSection: section }))}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          reportBuilder.currentSection === section
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {section}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={reportBuilder.reportData.title}
                    onChange={(e) => setReportBuilder(prev => ({
                      ...prev,
                      reportData: { ...prev.reportData, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter report title..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {reportBuilder.currentSection}
                  </label>
                  <textarea
                    value={reportBuilder.reportData.sections?.[reportBuilder.currentSection] || ''}
                    onChange={(e) => updateReportSection(reportBuilder.currentSection, e.target.value)}
                    className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder={`Write content for ${reportBuilder.currentSection.toLowerCase()}...`}
                  />
                </div>
                
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <p>💡 <strong>Tip:</strong> Use the sidebar to navigate between different sections of your report.</p>
                  <p>📊 <strong>AI Integration:</strong> Your uploaded ESG data will be automatically analyzed and included in relevant sections.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsCenter;
