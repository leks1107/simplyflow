'use client'

import React from 'react';
import { TargetFormProps } from '../config/targetRegistry';
import { InputField } from '@/components/ui/InputField';

const GoogleSheetsTargetForm: React.FC<TargetFormProps> = ({ 
  config, 
  onChange 
}) => {
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...config,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Configuration */}
      <div className="space-y-4">        <InputField
          label="Google Sheet ID"
          value={config.sheetId || ''}
          onChange={(e) => handleConfigChange('sheetId', e.target.value)}
          placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
          required          helperText="Google Sheets table ID (can be found in the table URL)"
        />

        <InputField
          label="Sheet Name"
          value={config.sheetName || ''}
          onChange={(e) => handleConfigChange('sheetName', e.target.value)}
          placeholder="Sheet1"
          required
          helperText="Name of the specific sheet in the table where data will be added"
        />

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="publicAccess"
            checked={config.publicAccess || false}
            onChange={(e) => handleConfigChange('publicAccess', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />          <label htmlFor="publicAccess" className="text-sm font-medium text-gray-700">
            Table is publicly accessible for editing
          </label>
        </div>
        
        {!config.publicAccess && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ If the table is not publicly accessible, make sure SimpFlow has access to the table
            </p>
          </div>
        )}
      </div>

      {/* How to get Sheet ID */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-blue-900 mb-3">
          📋 How to find Google Sheets ID
        </h4>
        <div className="text-sm text-blue-800 space-y-2">
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">1</span>
            <p>Open your Google Sheet in the browser</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">2</span>
            <p>Copy the ID from URL: <code className="bg-white px-1 rounded text-xs">docs.google.com/spreadsheets/d/[ID]/edit</code></p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">3</span>
            <p>ID is located between <code className="bg-white px-1 rounded text-xs">/d/</code> and <code className="bg-white px-1 rounded text-xs">/edit</code></p>
          </div>
        </div>
      </div>

      {/* Access Setup */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          🔐 Access Setup
        </h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Option 1 (Recommended):</strong> Open access via link</p>
          <div className="ml-4 space-y-1">
            <p>• Click "Share" in Google Sheets</p>
            <p>• Select "Anyone with the link" → "Editor"</p>
            <p>• Check the "Public access" checkbox above</p>
          </div>
          
          <p className="mt-3"><strong>Option 2:</strong> Add SimpFlow email</p>
          <div className="ml-4 space-y-1">
            <p>• Add <code className="bg-white px-1 rounded text-xs">service@simplyflow.com</code> as editor</p>
            <p>• Uncheck the "Public access" checkbox above</p>
          </div>
        </div>
      </div>

      {/* Expected Data Format */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          📊 Data Format in Sheet
        </h4>
        <div className="text-sm text-gray-700">
          <p className="mb-2">Data will be added as new rows with columns:</p>
          <div className="bg-white border rounded p-3 font-mono text-xs">
            <div className="grid grid-cols-4 gap-2">
              <div className="font-semibold">Timestamp</div>
              <div className="font-semibold">Field1</div>
              <div className="font-semibold">Field2</div>
              <div className="font-semibold">...</div>
              <div>2025-05-28 10:30</div>
              <div>user@example.com</div>
              <div>John Doe</div>
              <div>...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsTargetForm;
