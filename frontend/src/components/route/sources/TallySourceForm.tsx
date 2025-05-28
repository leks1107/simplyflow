'use client'

import React from 'react';
import { InputField } from '@/components/ui/InputField';

interface TallySourceFormProps {
  config: any;
  onChange: (config: any) => void;
  webhookUrl: string;
}

const TallySourceForm: React.FC<TallySourceFormProps> = ({ 
  config, 
  onChange, 
  webhookUrl 
}) => {
  const handleConfigChange = (field: string, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Webhook URL Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-blue-900 mb-2">
          🔗 Webhook URL
        </h4>
        <div className="flex items-center space-x-2">
          <code className="flex-1 text-sm bg-white border rounded px-3 py-2 text-gray-800">
            {webhookUrl}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(webhookUrl)}
            className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">        <InputField
          label="API Key (Optional)"
          value={config.apiKey || ''}
          onChange={(e) => handleConfigChange('apiKey', e.target.value)}
          placeholder="Enter Tally API key for additional security"
          helperText="API key for request authentication. Optional."
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          📋 Tally Setup Instructions
        </h4>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>1. Open Tally form settings</strong>
            <p>Go to "Integrations" → "Webhooks" section</p>
          </div>
          <div>
            <strong>2. Add a new webhook</strong>
            <p>Copy the URL above and paste it into the "Webhook URL" field</p>
          </div>
          <div>
            <strong>3. Configure events</strong>
            <p>Select "Form submitted" event to send data when form is completed</p>
          </div>
          <div>
            <strong>4. Save settings</strong>
            <p>Click "Save" to activate the webhook</p>
          </div>
        </div>
      </div>

      {/* Test Data Example */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-green-900 mb-3">
          🧪 Sample Data from Tally
        </h4>
        <pre className="text-xs text-green-800 bg-green-100 rounded p-3 overflow-x-auto">
{`{
  "eventId": "01234567-89ab-cdef-0123-456789abcdef",
  "eventType": "FORM_RESPONSE",
  "createdAt": "2025-05-28T09:00:00.000Z",
  "data": {
    "responseId": "r_1234567890",
    "submissionId": "s_0987654321",
    "respondentId": "u_5432109876",
    "formId": "f_abcdef123456",
    "formName": "Contact Form",
    "createdAt": "2025-05-28T09:00:00.000Z",
    "fields": [
      {
        "key": "question_123",
        "label": "Name",
        "type": "INPUT_TEXT",
        "value": "John Doe"
      },
      {
        "key": "question_124", 
        "label": "Email",
        "type": "INPUT_EMAIL",
        "value": "john@example.com"
      },
      {
        "key": "question_125",
        "label": "Message",
        "type": "TEXTAREA",
        "value": "Hello! I'm interested in your product."
      }
    ]
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default TallySourceForm;
