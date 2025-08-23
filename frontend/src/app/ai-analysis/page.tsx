'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Brain, Zap, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3, Cpu, Network, Activity } from 'lucide-react';
import { aiAnalysisService } from '@/lib/services/ai-analysis';
import { mongodbService } from '@/lib/services/mongodb';
import { blockchainService } from '@/lib/services/blockchain';

interface AnalysisTask {
  id: string;
  name: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  type: 'carbon' | 'supply_chain' | 'compliance' | 'diversity' | 'governance';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  completedAt?: Date;
  result?: any;
  cryptoCreditsEarned?: number;
}

interface ESGInsight {
  id: string;
  category: 'success' | 'warning' | 'info' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  timestamp: Date;
  actionable: boolean;
  actionUrl?: string;
}

const AIAnalysis = () => {
  // State for dynamic data
  const [neuralNetworkStatus, setNeuralNetworkStatus] = useState<'active' | 'processing' | 'idle'>('active');
  const [esgFactors, setEsgFactors] = useState({
    environmental: { processed: 87, status: 'processing', lastUpdate: new Date() },
    social: { processed: 94, status: 'completed', lastUpdate: new Date() },
    governance: { processed: 91, status: 'processing', lastUpdate: new Date() }
  });
  const [overallESGScore, setOverallESGScore] = useState(87.5);
  const [analysisQueue, setAnalysisQueue] = useState<AnalysisTask[]>([]);
  const [keyInsights, setKeyInsights] = useState<ESGInsight[]>([]);
  const [processingStats, setProcessingStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    averageProcessingTime: 2.3,
    activeModels: 3
  });

  // Mock user ID for demo purposes
  const userId = 'user_1';

  useEffect(() => {
    initializeAnalysisHub();
    startRealTimeUpdates();
  }, []);

  const initializeAnalysisHub = async () => {
    try {
      // Load existing analysis data
      const userAnalysis = await mongodbService.getUserAnalysis(userId);
      const systemStats = await mongodbService.getSystemStats();
      
      // Initialize analysis queue with mock data
      initializeAnalysisQueue();
      
      // Initialize key insights
      initializeKeyInsights();
      
      // Start neural network simulation
      startNeuralNetworkSimulation();
      
    } catch (error) {
      console.error('Failed to initialize AI Analysis Hub:', error);
    }
  };

  const initializeAnalysisQueue = () => {
    const initialTasks: AnalysisTask[] = [
      {
        id: 'task_1',
        name: 'Carbon Footprint Analysis',
        status: 'processing',
        progress: 72,
        type: 'carbon',
        priority: 'high',
        createdAt: new Date(Date.now() - 300000), // 5 minutes ago
        result: {
          carbonReduction: 23,
          recommendations: ['Implement smart energy monitoring', 'Upgrade to LED lighting'],
          riskLevel: 'medium'
        }
      },
      {
        id: 'task_2',
        name: 'Supply Chain Risk Assessment',
        status: 'completed',
        progress: 100,
        type: 'supply_chain',
        priority: 'medium',
        createdAt: new Date(Date.now() - 600000), // 10 minutes ago
        completedAt: new Date(Date.now() - 120000), // 2 minutes ago
        result: {
          riskScore: 65,
          vulnerabilities: ['Single supplier dependency', 'Geographic concentration'],
          mitigation: ['Diversify suppliers', 'Implement monitoring systems']
        },
        cryptoCreditsEarned: 0.8
      },
      {
        id: 'task_3',
        name: 'Compliance Monitoring',
        status: 'queued',
        progress: 0,
        type: 'compliance',
        priority: 'high',
        createdAt: new Date()
      }
    ];

    setAnalysisQueue(initialTasks);
    updateProcessingStats(initialTasks);
  };

  const initializeKeyInsights = () => {
    const insights: ESGInsight[] = [
      {
        id: 'insight_1',
        category: 'success',
        title: 'Carbon Reduction Success',
        description: 'AI detected 23% reduction in carbon emissions compared to last quarter',
        impact: 'high',
        timestamp: new Date(Date.now() - 300000),
        actionable: true,
        actionUrl: '/reports/carbon-reduction'
      },
      {
        id: 'insight_2',
        category: 'info',
        title: 'Social Impact Growth',
        description: 'Employee satisfaction scores increased by 15% with new diversity initiatives',
        impact: 'medium',
        timestamp: new Date(Date.now() - 600000),
        actionable: false
      },
      {
        id: 'insight_3',
        category: 'warning',
        title: 'Governance Alert',
        description: 'Board diversity targets need attention - recommendation: add 2 female directors',
        impact: 'high',
        timestamp: new Date(Date.now() - 900000),
        actionable: true,
        actionUrl: '/compliance/governance'
      }
    ];

    setKeyInsights(insights);
  };

  const startNeuralNetworkSimulation = () => {
    // Simulate neural network activity
    const interval = setInterval(() => {
      setNeuralNetworkStatus(prev => {
        if (prev === 'active') return 'processing';
        if (prev === 'processing') return 'active';
        return 'idle';
      });

      // Update ESG factors with realistic variations
      setEsgFactors(prev => ({
        environmental: {
          ...prev.environmental,
          processed: Math.min(100, prev.environmental.processed + (Math.random() - 0.5) * 2),
          lastUpdate: new Date()
        },
        social: {
          ...prev.social,
          processed: Math.min(100, prev.social.processed + (Math.random() - 0.5) * 1),
          lastUpdate: new Date()
        },
        governance: {
          ...prev.governance,
          processed: Math.min(100, prev.governance.processed + (Math.random() - 0.5) * 1.5),
          lastUpdate: new Date()
        }
      }));

      // Update overall ESG score
      setOverallESGScore(prev => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(0, Math.min(100, prev + change));
      });

    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  };

  const startRealTimeUpdates = () => {
    // Simulate real-time task processing
    const taskInterval = setInterval(() => {
      setAnalysisQueue(prev => {
        const updated = prev.map(task => {
          if (task.status === 'processing') {
            const newProgress = Math.min(100, task.progress + Math.random() * 5);
            if (newProgress >= 100) {
              return {
                ...task,
                status: 'completed' as const,
                progress: 100,
                completedAt: new Date(),
                result: generateTaskResult(task.type),
                cryptoCreditsEarned: calculateTaskCredits(task.type)
              };
            }
            return { ...task, progress: newProgress };
          }
          return task;
        });

        // Add new tasks occasionally
        if (Math.random() < 0.1 && prev.length < 5) {
          const newTask = generateNewTask();
          updated.push(newTask);
        }

        updateProcessingStats(updated);
        return updated;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(taskInterval);
  };

  const generateTaskResult = (type: string) => {
    const results = {
      carbon: {
        carbonReduction: Math.floor(Math.random() * 40) + 10,
        recommendations: [
          'Implement smart energy monitoring systems',
          'Upgrade to LED lighting across facilities',
          'Install solar panels on warehouse roofs'
        ],
        riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
      },
      supply_chain: {
        riskScore: Math.floor(Math.random() * 40) + 30,
        vulnerabilities: [
          'Single supplier dependency',
          'Geographic concentration',
          'Limited backup options'
        ],
        mitigation: [
          'Diversify supplier base',
          'Implement real-time monitoring',
          'Develop contingency plans'
        ]
      },
      compliance: {
        complianceScore: Math.floor(Math.random() * 30) + 70,
        violations: Math.floor(Math.random() * 3),
        recommendations: [
          'Update policy documentation',
          'Conduct staff training',
          'Implement monitoring systems'
        ]
      }
    };

    return results[type as keyof typeof results] || results.carbon;
  };

  const calculateTaskCredits = (type: string): number => {
    const baseCredits = {
      carbon: 1.2,
      supply_chain: 0.8,
      compliance: 0.6,
      diversity: 0.5,
      governance: 0.7
    };

    return baseCredits[type as keyof typeof baseCredits] || 0.5;
  };

  const generateNewTask = (): AnalysisTask => {
    const taskTypes = ['carbon', 'supply_chain', 'compliance', 'diversity', 'governance'];
    const priorities = ['low', 'medium', 'high'];
    
    return {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${taskTypes[Math.floor(Math.random() * taskTypes.length)].replace('_', ' ').toUpperCase()} Analysis`,
      status: 'queued',
      progress: 0,
      type: taskTypes[Math.floor(Math.random() * taskTypes.length)] as any,
      priority: priorities[Math.floor(Math.random() * priorities.length)] as any,
      createdAt: new Date()
    };
  };

  const updateProcessingStats = (tasks: AnalysisTask[]) => {
    const completed = tasks.filter(t => t.status === 'completed').length;
    const failed = tasks.filter(t => t.status === 'failed').length;
    const total = tasks.length;
    
    setProcessingStats(prev => ({
      ...prev,
      totalTasks: total,
      completedTasks: completed,
      failedTasks: failed,
      averageProcessingTime: total > 0 ? (2.3 + (Math.random() - 0.5) * 0.5) : 2.3,
      activeModels: Math.max(1, Math.min(5, Math.floor(Math.random() * 3) + 2))
    }));
  };

  const handleTaskAction = useCallback(async (taskId: string, action: 'start' | 'pause' | 'cancel') => {
    setAnalysisQueue(prev => {
      return prev.map(task => {
        if (task.id === taskId) {
          switch (action) {
            case 'start':
              if (task.status === 'queued') {
                return { ...task, status: 'processing', progress: 0 };
              }
              break;
            case 'pause':
              if (task.status === 'processing') {
                return { ...task, status: 'queued' };
              }
              break;
            case 'cancel':
              return { ...task, status: 'failed', progress: 0 };
          }
        }
        return task;
      });
    });
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Cpu className="w-4 h-4 text-purple-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getInsightIcon = (category: string) => {
    switch (category) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced AI-powered ESG insights and predictions
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                neuralNetworkStatus === 'active' ? 'bg-green-500 animate-pulse' :
                neuralNetworkStatus === 'processing' ? 'bg-yellow-500 animate-pulse' :
                'bg-gray-500'
              }`} />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Neural Network {neuralNetworkStatus}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Cpu className="w-4 h-4" />
              <span>{processingStats.activeModels} Active Models</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* ESG Neural Network */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Network className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">ESG Neural Network</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Real-time AI processing of sustainability data
              </p>

              {/* Neural Network Visualization */}
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-8 mb-4">
                  {/* Input Layer */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                      Input
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Data Sources</p>
                  </div>
                  
                  {/* Connection */}
                  <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
                  
                  {/* Hidden Layer 1 */}
                  <div className="text-center">
                    <div className="flex flex-col space-y-2">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Layer 1</p>
                  </div>
                  
                  {/* Connection */}
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  {/* Hidden Layer 2 */}
                  <div className="text-center">
                    <div className="flex flex-col space-y-2">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Layer 2</p>
                  </div>
                  
                  {/* Connection */}
                  <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-orange-500"></div>
                  
                  {/* Output Layer */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                      Output
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Insights</p>
                  </div>
                </div>
              </div>

              {/* ESG Factor Processing Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {esgFactors.environmental.processed.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Environmental</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${esgFactors.environmental.processed}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {esgFactors.social.processed.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Social</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${esgFactors.social.processed}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    {esgFactors.governance.processed.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Governance</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${esgFactors.governance.processed}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Overall ESG Score */}
              <div className="mt-6 text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {overallESGScore.toFixed(1)}/100
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overall ESG Score</p>
              </div>
            </div>

            {/* Analysis Queue */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Analysis Queue</h2>
              </div>
              
              <div className="space-y-4">
                {analysisQueue.map((task) => (
                  <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority} Priority
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Created {task.createdAt.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {task.status === 'queued' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'start')}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                          >
                            Start
                          </button>
                        )}
                        {task.status === 'processing' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'pause')}
                            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 transition-colors"
                          >
                            Pause
                          </button>
                        )}
                        {task.status === 'queued' && (
                          <button
                            onClick={() => handleTaskAction(task.id, 'cancel')}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {task.status === 'processing' && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Processing...</span>
                          <span>{task.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Task Results */}
                    {task.status === 'completed' && task.result && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Results</span>
                          {task.cryptoCreditsEarned && (
                            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                              +{task.cryptoCreditsEarned} credits earned
                            </span>
                          )}
                        </div>
                        
                        {task.result.carbonReduction && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Carbon Reduction Potential: {task.result.carbonReduction}%
                          </div>
                        )}
                        
                        {task.result.riskScore && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Risk Score: {task.result.riskScore}/100
                          </div>
                        )}
                        
                        {task.result.complianceScore && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Compliance Score: {task.result.complianceScore}/100
                          </div>
                        )}
                      </div>
                    )}

                    {/* Completion Time */}
                    {task.completedAt && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Completed at {task.completedAt.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Insights</h2>
              </div>
              
              <div className="space-y-4">
                {keyInsights.map((insight) => (
                  <div key={insight.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.category)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(insight.impact)}`}>
                            {insight.impact} Impact
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {insight.timestamp.toLocaleTimeString()}
                          </span>
                          {insight.actionable && insight.actionUrl && (
                            <a
                              href={insight.actionUrl}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Take Action →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Processing Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Processing Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</span>
                  <span className="font-medium text-gray-900 dark:text-white">{processingStats.totalTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{processingStats.completedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Failed</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{processingStats.failedTasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Avg Processing Time</span>
                  <span className="font-medium text-gray-900 dark:text-white">{processingStats.averageProcessingTime.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Models</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">{processingStats.activeModels}</span>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Data Pipeline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Blockchain</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Rate Limit</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-400">New ESG data uploaded</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">AI analysis completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-400">Sustainability score improved</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-400">New task queued</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
