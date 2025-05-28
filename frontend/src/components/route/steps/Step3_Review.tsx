'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Step3ReviewProps {
  formData: {
    name: string;
    enabled: boolean;
    source: {
      type: string;
      config: any;
    };
    target: {
      type: string;
      config: any;
    };
  };
  onCreateRoute: () => void;
  onTestData?: () => void;
  loading?: boolean;
  webhookUrl?: string;
}

const Step3_Review: React.FC<Step3ReviewProps> = ({ 
  formData, 
  onCreateRoute, 
  onTestData,
  loading = false,
  webhookUrl 
}) => {
  const [isTestLoading, setIsTestLoading] = useState(false);

  const handleTestData = async () => {
    if (onTestData) {
      setIsTestLoading(true);
      try {
        await onTestData();
      } finally {
        setIsTestLoading(false);
      }
    }
  };

  const getSourceLabel = (type: string) => {
    const labels: Record<string, string> = {
      'typeform': 'Typeform'
    };
    return labels[type] || type;
  };

  const getTargetLabel = (type: string) => {
    const labels: Record<string, string> = {
      'googleSheets': 'Google Sheets'
    };
    return labels[type] || type;
  };
  const renderConfigValue = (key: string, value: any): string => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (key.toLowerCase().includes('secret') && value) {
      return '••••••••';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value || 'Not specified');
  };

  return (
    <div className="space-y-6">      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Review and Create
        </h3>
        <p className="text-sm text-gray-600">
          Review settings before creating the route
        </p>
      </div>

      {/* Route Summary */}
      <Card>        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            <Badge variant={formData.enabled ? 'success' : 'default'}>
              {formData.enabled ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900 font-medium">{formData.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="text-sm text-gray-900">
                {formData.enabled ? 'Route will be active immediately after creation' : 'Route will be inactive'}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Data Flow */}      <Card>
        <CardHeader>
          <CardTitle>Data Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            {/* Source */}
            <div className="flex-1 text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📝</span>
              </div>              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {getSourceLabel(formData.source.type)}
              </h4>
              <p className="text-xs text-gray-500">Data Source</p>
            </div>

            {/* Arrow */}
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Target */}
            <div className="flex-1 text-center">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">
                {getTargetLabel(formData.target.type)}
              </h4>
              <p className="text-xs text-gray-500">Target</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Source Configuration */}      <Card>
        <CardHeader>
          <CardTitle>Source Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{getSourceLabel(formData.source.type)}</dd>
            </div>
            {Object.entries(formData.source.config).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key === 'secret' ? 'Secret Token' : key}
                </dt>
                <dd className="text-sm text-gray-900">
                  {renderConfigValue(key, value)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Target Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Target Settings</CardTitle>
        </CardHeader>
        <CardContent>          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Type</dt>
              <dd className="text-sm text-gray-900">{getTargetLabel(formData.target.type)}</dd>
            </div>
            {Object.entries(formData.target.config).map(([key, value]) => (
              <div key={key}>
                <dt className="text-sm font-medium text-gray-500 capitalize">
                  {key === 'sheetId' ? 'Sheet ID' : 
                   key === 'sheetName' ? 'Sheet Name' :
                   key === 'publicAccess' ? 'Public Access' : key}
                </dt>
                <dd className="text-sm text-gray-900">
                  {renderConfigValue(key, value)}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Test Section */}
      {onTestData && (        <Card>
          <CardHeader>
            <CardTitle>Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Before creating the route, you can send test data to verify the settings.
              </p>
              <Button
                variant="outline"
                onClick={handleTestData}
                disabled={isTestLoading}
                isLoading={isTestLoading}
              >
                Send Test Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Webhook URL Info */}
      {webhookUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Webhook URL</CardTitle>
          </CardHeader>
          <CardContent>            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                After creating the route, use this URL in your data source settings:
              </p>
              <div className="p-3 bg-gray-50 border rounded-md">
                <code className="text-sm font-mono text-gray-800 break-all">
                  {webhookUrl}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      <div className="flex justify-center pt-4">        <Button
          variant="primary"
          size="lg"
          onClick={onCreateRoute}
          disabled={loading}
          isLoading={loading}
          className="px-8"
        >
          {loading ? 'Creating Route...' : 'Create Route'}
        </Button>
      </div>

      {/* Next Steps Info */}      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-green-900 mb-2">
          ✅ What happens next?
        </h4>
        <div className="text-sm text-green-800 space-y-1">
          <p>1. Route will be created and available in the dashboard</p>
          <p>2. You'll receive a working Webhook URL for source configuration</p>
          <p>3. You can track statistics and processing logs</p>
          <p>4. Settings can be changed at any time</p>
        </div>
      </div>
    </div>
  );
};

export default Step3_Review;
