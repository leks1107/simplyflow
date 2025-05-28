'use client'

import React, { useState } from 'react';
import { SourceFormProps } from '../config/sourceRegistry';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { copyToClipboard } from '@/utils/helpers';

const TypeformSourceForm: React.FC<SourceFormProps> = ({ 
  config, 
  onChange, 
  webhookUrl 
}) => {
  const [copied, setCopied] = useState(false);

  const handleSecretChange = (value: string) => {
    onChange({
      ...config,
      secret: value
    });
  };

  const handleCopyUrl = async () => {
    if (webhookUrl) {
      const success = await copyToClipboard(webhookUrl);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };
  // Generate preview URL if webhookUrl is not provided
  const displayUrl = webhookUrl || '/api/trigger/preview';

  return (
    <div className="space-y-6">
      {/* Webhook URL Section */}      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-3">
          📝 Webhook URL for Typeform
        </h4>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Webhook URL:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayUrl}
                readOnly
                className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50 text-sm font-mono px-3 py-2"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyUrl}
                className="flex-shrink-0"
              >                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4">        <InputField
          label="Secret Token (Optional)"
          value={config.secret || ''}
          onChange={(e) => handleSecretChange(e.target.value)}
          placeholder="Enter secret token for authentication"
          helperText="Secret token for additional security. Optional."
        />
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          🔗 Typeform Setup Instructions
        </h4>
        <div className="text-sm text-gray-700 space-y-2">
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">1</span>
            <p>Copy the Webhook URL above</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">2</span>
            <p>Go to your Typeform form settings</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">3</span>
            <p>Find the "Webhooks" or "Integrations" section</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">4</span>
            <p>Add the copied URL as a new webhook</p>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">5</span>
            <p>If using a secret token, add it to the webhook settings</p>
          </div>
        </div>
      </div>

      {/* Test Data Example */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          📊 Sample Data from Typeform
        </h4>
        <pre className="text-xs bg-white border rounded p-3 overflow-x-auto">
{`{
  "event_id": "01HF7Z8XQ...",
  "event_type": "form_response",
  "form_response": {
    "form_id": "your_form_id",
    "token": "response_token",
    "submitted_at": "2025-05-28T10:30:00Z",
    "answers": [
      {
        "field": { "id": "field1", "type": "email" },
        "type": "email",
        "email": "user@example.com"
      },
      {
        "field": { "id": "field2", "type": "short_text" },
        "type": "text",
        "text": "John Doe"
      }
    ]
  }
}`}
        </pre>
      </div>
    </div>
  );
};

export default TypeformSourceForm;
