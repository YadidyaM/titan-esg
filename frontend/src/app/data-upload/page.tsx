'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Upload, FileText, Brain, Coins, CheckCircle, Clock, AlertCircle, Download, Eye, Trash2, Info } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { aiAnalysisService } from '@/lib/services/ai-analysis';
import { blockchainService } from '@/lib/services/blockchain';
import { mongodbService } from '@/lib/services/mongodb';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'analyzed' | 'failed';
  progress: number;
  aiAnalysis?: any;
  cryptoCreditsEarned?: number;
  error?: string;
}

const DataUploadCenter = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [processingQueue, setProcessingQueue] = useState<any[]>([]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [userCredits, setUserCredits] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock user ID for demo purposes
  const userId = 'user_1';

  useEffect(() => {
    loadSystemStats();
    loadUserCredits();
    loadProcessingQueue();
  }, []);

  const loadSystemStats = async () => {
    try {
      const stats = await mongodbService.getSystemStats();
      setSystemStats(stats);
    } catch (error) {
      console.error('Failed to load system stats:', error);
    }
  };

  const loadUserCredits = async () => {
    try {
      const credits = await mongodbService.getUserTotalCredits(userId);
      setUserCredits(credits);
    } catch (error) {
      console.error('Failed to load user credits:', error);
    }
  };

  const loadProcessingQueue = async () => {
    try {
      const userFiles = await mongodbService.getUserFiles(userId);
      const queue = userFiles.map(file => ({
        id: file.id,
        fileName: file.fileName,
        fileSize: file.fileSize,
        category: file.metadata.category || 'Unknown',
        status: file.status,
        cryptoCreditsEarned: file.cryptoCreditsEarned,
        uploadDate: file.uploadDate
      }));
      setProcessingQueue(queue);
    } catch (error) {
      console.error('Failed to load processing queue:', error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process each file
    for (const fileData of newFiles) {
      await processFile(fileData);
    }
  }, []);

  const processFile = async (fileData: UploadedFile) => {
    try {
      // Update status to processing
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'processing', progress: 50 } : f)
      );

      // Simulate file upload progress
      for (let i = 50; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, progress: i } : f)
        );
      }

      // Save file to MongoDB
      const savedFile = await mongodbService.uploadFile({
        userId,
        fileName: fileData.file.name,
        fileType: fileData.file.type || 'unknown',
        fileSize: fileData.file.size,
        status: 'processing',
        metadata: {
          category: getFileCategory(fileData.file.name),
          tags: extractTags(fileData.file.name),
          description: `Uploaded ${fileData.file.name}`
        }
      });

      // Update file status
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'processing', progress: 100 } : f)
      );

      // Perform AI analysis
      await performAIAnalysis(fileData, savedFile);

    } catch (error) {
      console.error('File processing failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'failed', error: 'Processing failed' } : f)
      );
    }
  };

  const performAIAnalysis = async (fileData: UploadedFile, savedFile: any) => {
    try {
      setIsAnalyzing(true);
      
      // Read file content for AI analysis
      const content = await readFileContent(fileData.file);
      
      // Analyze with AI
      const analysis = await aiAnalysisService.analyzeESGFile(
        content,
        fileData.file.name,
        fileData.file.type || 'unknown'
      );

      // Calculate crypto credits
      const creditsEarned = aiAnalysisService.calculateCryptoCredits(analysis);

      // Save analysis to MongoDB
      const savedAnalysis = await mongodbService.saveAnalysis({
        fileId: savedFile.id,
        userId,
        analysis: analysis.analysis,
        sustainabilityScore: analysis.sustainabilityScore,
        carbonReductionPotential: analysis.carbonReductionPotential,
        recommendations: analysis.recommendations,
        riskAssessment: analysis.riskAssessment,
        complianceStatus: analysis.complianceStatus,
        aiModel: analysis.aiModel,
        cryptoCredits: creditsEarned
      });

      // Update file status to analyzed
      await mongodbService.updateFileStatus(savedFile.id, 'analyzed');

      // Save crypto credit record
      await mongodbService.saveCryptoCredit({
        userId,
        amount: creditsEarned,
        source: 'file_upload',
        sourceId: savedFile.id,
        status: 'confirmed',
        metadata: {
          fileName: fileData.file.name,
          carbonReduction: analysis.carbonReductionPotential
        }
      });

      // Update blockchain (if connected)
      try {
        // Check if wallet is connected
        const walletConnection = blockchainService.getWalletConnection();
        if (walletConnection && walletConnection.isConnected) {
          // In a real app, you would mint credits here
          // For now, we'll just log the action
          console.log(`Would mint ${creditsEarned} credits for user ${userId} for file ${fileData.file.name}`);
          
          // Update analysis with blockchain hash
          // In a real app, you'd update the MongoDB record here
        }
      } catch (blockchainError) {
        console.warn('Blockchain transaction failed, but credits were awarded:', blockchainError);
      }

      // Update local state
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { 
          ...f, 
          status: 'analyzed', 
          aiAnalysis: analysis,
          cryptoCreditsEarned: creditsEarned
        } : f)
      );

      // Update user credits
      setUserCredits(prev => prev + creditsEarned);

      // Refresh processing queue
      loadProcessingQueue();

    } catch (error) {
      console.error('AI analysis failed:', error);
      setUploadedFiles(prev => 
        prev.map(f => f.id === fileData.id ? { ...f, status: 'failed', error: 'AI analysis failed' } : f)
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getFileCategory = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('carbon') || lowerName.includes('emission') || lowerName.includes('energy')) {
      return 'Environmental';
    } else if (lowerName.includes('diversity') || lowerName.includes('employee') || lowerName.includes('social')) {
      return 'Social';
    } else if (lowerName.includes('governance') || lowerName.includes('compliance') || lowerName.includes('risk')) {
      return 'Governance';
    }
    return 'General';
  };

  const extractTags = (fileName: string): string[] => {
    const tags: string[] = [];
    const lowerName = fileName.toLowerCase();
    
    if (lowerName.includes('csv')) tags.push('csv');
    if (lowerName.includes('xlsx') || lowerName.includes('excel')) tags.push('excel');
    if (lowerName.includes('pdf')) tags.push('pdf');
    if (lowerName.includes('json')) tags.push('json');
    if (lowerName.includes('quarterly') || lowerName.includes('q1') || lowerName.includes('q2') || lowerName.includes('q3') || lowerName.includes('q4')) {
      tags.push('quarterly');
    }
    if (lowerName.includes('annual') || lowerName.includes('yearly')) tags.push('annual');
    
    return tags;
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/pdf': ['.pdf'],
      'application/json': ['.json']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: true
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Brain className="w-4 h-4 text-purple-500 animate-pulse" />;
      case 'analyzed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'processing':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'analyzed':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20';
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
            Data Upload Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and process your ESG datasets with AI-powered analysis and earn crypto credits
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upload Files</h2>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop your files'}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  or click to browse your computer
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Files
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Supported formats: CSV, Excel, PDF, JSON • Max size: 50MB
                </p>
              </div>
            </div>

            {/* Upload Guidelines */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Guidelines</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Data Format</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Use standardized ESG templates for best results
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">File Organization</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Include date ranges and categories in filename
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Data Quality</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ensure complete data with minimal missing values
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Uploads</h3>
                <div className="space-y-4">
                  {uploadedFiles.map((fileData) => (
                    <div key={fileData.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{fileData.file.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {formatFileSize(fileData.file.size)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(fileData.status)}`}>
                            {fileData.status}
                          </span>
                          <button
                            onClick={() => removeFile(fileData.id)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      {fileData.status === 'uploading' || fileData.status === 'processing' ? (
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>{fileData.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${fileData.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : null}

                      {/* AI Analysis Results */}
                      {fileData.aiAnalysis && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Analysis</span>
                            <div className="flex items-center gap-2">
                              <Coins className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                +{fileData.cryptoCreditsEarned} credits
                              </span>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Score:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {fileData.aiAnalysis.sustainabilityScore}/100
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Carbon Reduction:</span>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {fileData.aiAnalysis.carbonReductionPotential}%
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Status:</span>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">
                                {fileData.aiAnalysis.complianceStatus}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Error Display */}
                      {fileData.error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <p className="text-sm text-red-700 dark:text-red-300">{fileData.error}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Processing Queue */}
          <div className="space-y-6">
            {/* Processing Queue */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processing Queue</h3>
                <button className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-lg flex items-center gap-1">
                  {processingQueue.length} Files in Queue
                  <Upload className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {processingQueue.map((file) => (
                  <div key={file.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(file.status)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.fileName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatFileSize(file.fileSize)} • {file.category}</span>
                      {file.cryptoCreditsEarned && (
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                          +{file.cryptoCreditsEarned} credits
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  View upload history →
                </a>
              </div>
            </div>

            {/* Crypto Credits Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Coins className="w-6 h-6 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Crypto Credits</h3>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {userCredits.toFixed(1)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Total Credits Earned</p>
                <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>File Uploads:</span>
                    <span>+1.0 per carbon file</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sustainability Quiz:</span>
                    <span>+0.5 per correct answer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">12°C</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mostly cloudy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Files Processed Today</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats?.totalFiles || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats ? Math.round((systemStats.totalFiles / Math.max(systemStats.totalFiles, 1)) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Processing Time</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {isAnalyzing ? '2.3s' : '1.8s'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Upload className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Data Uploaded</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {systemStats ? `${(systemStats.totalFiles * 2.5).toFixed(1)}GB` : '0GB'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUploadCenter;
