import React, { useState, useEffect } from 'react';
import { Key, Shield, AlertTriangle, Eye, EyeOff, Trash2, BarChart3 } from 'lucide-react';
import { Button } from './ui/Button';
import { apiKeyService } from '../services/apiKeyService';
import { usageMonitoringService } from '../services/usageMonitoringService';
import { rateLimitService } from '../services/rateLimitService';

interface APIKeyManagementProps {
  onKeyChanged?: () => void;
}

const APIKeyManagement: React.FC<APIKeyManagementProps> = ({ onKeyChanged }) => {
  const [userApiKey, setUserApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setHasUserKey(apiKeyService.hasUserProvidedKey());
  }, []);

  const saveApiKey = () => {
    try {
      setError(null);
      setSuccess(null);

      if (!userApiKey.trim()) {
        setError('Please enter an API key');
        return;
      }

      apiKeyService.setUserProvidedKey(userApiKey.trim());
      setHasUserKey(true);
      setUserApiKey('');
      setSuccess('API key saved successfully! AI features are now using your personal key.');
      onKeyChanged?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save API key');
    }
  };

  const removeApiKey = () => {
    apiKeyService.clearUserProvidedKey();
    setHasUserKey(false);
    setUserApiKey('');
    setSuccess('Personal API key removed. Using default environment key.');
    onKeyChanged?.();
  };

  const clearUsageData = () => {
    usageMonitoringService.clearUsageData();
    rateLimitService.reset();
    setSuccess('Usage data cleared successfully.');
  };

  const usageStats = usageMonitoringService.getUsageStats();
  const anomalies = usageMonitoringService.detectAnomalies();
  const rateLimitStatus = rateLimitService.getRateLimitStatus();
  const keyStats = apiKeyService.getUsageStats();

  return (
    <div className="space-y-6">
      {/* API Key Management */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="h-5 w-5 text-teal-600" />
          <h3 className="text-lg font-semibold text-gray-900">API Key Management</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your HuggingFace API Key (Optional but Recommended)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={userApiKey}
                  onChange={(e) => setUserApiKey(e.target.value)}
                  placeholder={hasUserKey ? 'Key already set - enter new key to replace' : 'hf_...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button onClick={saveApiKey} className="bg-teal-600 hover:bg-teal-700">
                {hasUserKey ? 'Update' : 'Save'}
              </Button>
            </div>
          </div>

          {hasUserKey && (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-green-700 text-sm">
                  Using your personal API key - more secure and private
                </span>
              </div>
              <Button 
                onClick={removeApiKey}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>• Get your free API key from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">HuggingFace Settings</a></p>
            <p>• Your key is stored securely in your browser and never sent to our servers</p>
            <p>• Using your own key ensures privacy and avoids rate limits</p>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-900">Usage Statistics</h3>
          </div>
          <Button 
            onClick={() => setShowStats(!showStats)}
            variant="outline"
            className="text-sm"
          >
            {showStats ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">{usageStats.totalCalls}</div>
            <div className="text-xs text-gray-500">Total API Calls</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{rateLimitStatus.remaining}</div>
            <div className="text-xs text-gray-500">Rate Limit Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{usageStats.averageResponseTime}ms</div>
            <div className="text-xs text-gray-500">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{keyStats.source || 'None'}</div>
            <div className="text-xs text-gray-500">Key Source</div>
          </div>
        </div>

        {showStats && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Weekly Usage</h4>
                <div className="text-sm text-gray-600">
                  <p>Last 7 days: {usageStats.lastWeekCalls} calls</p>
                  <p>Errors: {usageStats.errors}</p>
                  <p>Rate limit hits: {usageStats.rateLimitHits}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Key Information</h4>
                <div className="text-sm text-gray-600">
                  <p>Source: {keyStats.source}</p>
                  {keyStats.daysOld !== undefined && <p>Age: {keyStats.daysOld} days</p>}
                  {keyStats.lastUsed && <p>Last used: {new Date(keyStats.lastUsed).toLocaleDateString()}</p>}
                </div>
              </div>
            </div>

            {anomalies.warnings.length > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-700">Usage Alerts</span>
                </div>
                <ul className="text-sm text-orange-700 space-y-1">
                  {anomalies.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                onClick={clearUsageData}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 text-sm"
              >
                Clear Usage Data
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default APIKeyManagement;