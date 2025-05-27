import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { copyToClipboard } from '@/utils/helpers';

interface WebhookPreviewProps {
  webhookUrl: string;
  routeId: string;
  source: string;
}

const WebhookPreview: React.FC<WebhookPreviewProps> = ({ webhookUrl, routeId, source }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(webhookUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Generate example JSON based on source type
  const getExamplePayload = () => {
    switch (source.toLowerCase()) {
      case 'typeform':
        return {
          event_id: "01234567-89ab-cdef-0123-456789abcdef",
          event_type: "form_response",
          form_response: {
            form_id: "form123",
            token: "response123",
            submitted_at: "2025-05-27T10:30:00Z",
            answers: [
              {
                field: { id: "field1", type: "email" },
                type: "email",
                email: "user@example.com"
              },
              {
                field: { id: "field2", type: "short_text", ref: "name" },
                type: "text",
                text: "John Doe"
              },
              {
                field: { id: "field3", type: "multiple_choice", ref: "interest" },
                type: "choice",
                choice: { label: "Web Development" }
              }
            ]
          }
        };
      
      case 'tally':
        return {
          eventId: "evt_abc123",
          eventType: "FORM_RESPONSE",
          createdAt: "2025-05-27T10:30:00.000Z",
          data: {
            responseId: "resp_xyz789",
            submissionId: "sub_def456",
            respondentId: "user_ghi789",
            formId: "form_jkl012",
            formName: "Contact Form",
            createdAt: "2025-05-27T10:30:00.000Z",
            fields: [
              {
                key: "question_mno345",
                label: "Email Address",
                type: "INPUT_EMAIL",
                value: "user@example.com"
              },
              {
                key: "question_pqr678",
                label: "Full Name",
                type: "INPUT_TEXT",
                value: "John Doe"
              }
            ]
          }
        };
      
      case 'paperform':
        return {
          event: "submission_completed",
          submission_id: "sub_abc123def456",
          form_id: "form_789xyz012",
          created_at: "2025-05-27T10:30:00Z",
          data: {
            email: "user@example.com",
            name: "John Doe",
            message: "Hello, I'm interested in your services!",
            phone: "+1234567890"
          }
        };
      
      default:
        return {
          message: "Example webhook payload",
          timestamp: "2025-05-27T10:30:00Z",
          data: {
            field1: "value1",
            field2: "value2"
          }
        };
    }
  };

  const examplePayload = JSON.stringify(getExamplePayload(), null, 2);

  const curlCommand = `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(getExamplePayload())}' \\
  ${webhookUrl}`;

  const powershellCommand = `$body = @'
${examplePayload}
'@

Invoke-RestMethod -Uri "${webhookUrl}" -Method POST -Body $body -ContentType "application/json"`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Webhook Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Webhook URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Webhook URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={webhookUrl}
              readOnly
              className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50 text-sm font-mono"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
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

        {/* Example JSON Payload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Example {source} Payload
          </label>
          <pre className="bg-gray-50 border border-gray-200 rounded-md p-4 text-sm font-mono overflow-x-auto">
            {examplePayload}
          </pre>
        </div>

        {/* Test Commands */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* cURL Command */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test with cURL
            </label>
            <pre className="bg-gray-900 text-gray-100 rounded-md p-4 text-sm font-mono overflow-x-auto">
              {curlCommand}
            </pre>
          </div>

          {/* PowerShell Command */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test with PowerShell
            </label>
            <pre className="bg-blue-900 text-blue-100 rounded-md p-4 text-sm font-mono overflow-x-auto">
              {powershellCommand}
            </pre>
          </div>
        </div>

        {/* Integration Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            🔗 Integration Instructions
          </h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>1. Copy the webhook URL above</p>
            <p>2. Go to your {source} form settings</p>
            <p>3. Add the webhook URL to your form's webhook/integration settings</p>
            <p>4. Test the integration by submitting your form</p>
            <p>5. Check the logs below to verify data is being received</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebhookPreview;
