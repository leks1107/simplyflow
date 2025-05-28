'use client'

import React from 'react';
import { InputField } from '@/components/ui/InputField';

interface NotionTargetFormProps {
  config: any;
  onChange: (config: any) => void;
}

const NotionTargetForm: React.FC<NotionTargetFormProps> = ({ 
  config, 
  onChange 
}) => {
  const handleConfigChange = (field: string, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="space-y-4">
        <InputField
          label="Integration Token"
          value={config.integrationToken || ''}
          onChange={(e) => handleConfigChange('integrationToken', e.target.value)}
          placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          required          helperText="Notion integration token for database access"
        />

        <InputField
          label="Database ID"
          value={config.databaseId || ''}
          onChange={(e) => handleConfigChange('databaseId', e.target.value)}
          placeholder="1234567890abcdef1234567890abcdef"
          required
          helperText="Notion database ID where records will be added"
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          📋 Notion Setup Instructions
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>1. Create integration</strong>
            <p>Go to <a href="https://www.notion.so/my-integrations" target="_blank" className="text-blue-600 hover:text-blue-800">notion.so/my-integrations</a> and create a new integration</p>
          </div>
          <div>
            <strong>2. Copy token</strong>
            <p>Copy the "Internal Integration Token" and paste it above</p>
          </div>
          <div>
            <strong>3. Share database</strong>
            <p>In your Notion database click "Share" → "Add people" → find your integration</p>
          </div>
          <div>
            <strong>4. Get Database ID</strong>
            <p>Copy the ID from database URL: <code>notion.so/[workspace]/[database_id]?v=...</code></p>
          </div>
        </div>
      </div>

      {/* Data Mapping Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-blue-900 mb-3">
          🔄 Data Mapping
        </h4>
        <div className="text-sm text-blue-800">
          <p className="mb-2">Data will be automatically mapped to Notion database fields:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Title:</strong> "Name" field or first text field</li>
            <li><strong>Email:</strong> "Email" type field in database</li>
            <li><strong>Date:</strong> "Created" field with "Date" type</li>
            <li><strong>Other fields:</strong> Automatically to corresponding properties</li>
          </ul>
        </div>
      </div>

      {/* Test Data Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-green-900 mb-3">
          🧪 Sample Notion Record Creation
        </h4>
        <pre className="text-xs text-green-800 bg-green-100 rounded p-3 overflow-x-auto">
{`{
  "parent": { "database_id": "your-database-id" },
  "properties": {
    "Name": {
      "title": [
        {
          "text": { "content": "John Doe" }
        }
      ]
    },
    "Email": {
      "email": "john@example.com"
    },
    "Message": {
      "rich_text": [
        {
          "text": { "content": "Hello! I'm interested in your product." }
        }
      ]
    },
    "Created": {
      "date": { "start": "2025-05-28" }
    },
    "Source": {
      "select": { "name": "Typeform" }
    }
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default NotionTargetForm;
