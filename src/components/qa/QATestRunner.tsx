import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, AlertTriangle, Download } from 'lucide-react';
import { qaFramework } from '../../lib/qa-testing';

export function QATestRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState('');
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);
    
    try {
      const results = await qaFramework.runAllTests();
      setTestResults(results);
      setProgress(100);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['Test Name', 'Category', 'Status', 'Message', 'Timestamp'],
      ...testResults.map(result => [
        result.testName,
        result.category,
        result.status,
        result.message,
        result.timestamp.toISOString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-test-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'fail':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const groupedResults = testResults.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {});

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.status === 'pass').length;
  const failedTests = testResults.filter(r => r.status === 'fail').length;
  const warningTests = testResults.filter(r => r.status === 'warning').length;
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QA Testing Dashboard</h1>
              <p className="text-gray-600">Comprehensive testing suite for CareerNest</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isRunning ? 'Running...' : 'Run Tests'}</span>
              </button>
              
              {testResults.length > 0 && (
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  <span>Export Results</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Running Tests...</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Test Results Summary */}
        {testResults.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
                <div className="text-sm text-blue-800">Total Tests</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-green-800">Passed</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-red-800">Failed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-600">{warningTests}</div>
                <div className="text-sm text-yellow-800">Warnings</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-600">{successRate}%</div>
                <div className="text-sm text-purple-800">Success Rate</div>
              </div>
            </div>
          </div>
        )}

        {/* Test Results by Category */}
        <div className="px-6 py-4">
          {Object.keys(groupedResults).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedResults).map(([category, results]) => (
                <div key={category} className="border border-gray-200 rounded-lg">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
                    <p className="text-sm text-gray-600">
                      {results.filter(r => r.status === 'pass').length} / {results.length} tests passed
                    </p>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {results.map((result, index) => (
                      <div key={index} className="px-4 py-3 flex items-start space-x-3">
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{result.testName}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(result.status)}`}>
                              {result.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {result.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <CheckCircle className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Tests Run Yet</h3>
              <p className="text-gray-600">Click "Run Tests" to start the comprehensive testing suite</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}