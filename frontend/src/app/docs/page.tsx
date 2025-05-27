import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function DocsPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-2 text-lg text-gray-600">
            Learn how to use SimpFlow to manage your webhook routes
          </p>
        </div>

        <div className="space-y-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                SimpFlow is a no-code platform for managing webhook routes and data transformations. 
                It allows you to easily receive webhooks from various sources and forward them to different targets.
              </p>
              
              <h3>Creating Your First Route</h3>
              <ol>
                <li>Click "Create Route" from the dashboard</li>
                <li>Enter a name and description for your route</li>
                <li>Configure your webhook source (GitHub, Stripe, or generic webhook)</li>
                <li>Set up your target destination (HTTP endpoint, Slack, Discord, or email)</li>
                <li>Optionally add filters to process only specific events</li>
                <li>Review and create your route</li>
              </ol>
            </CardContent>
          </Card>

          {/* Source Types */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Source Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Generic Webhook</h4>
                  <p className="text-sm text-gray-600">
                    Accept webhooks from any source. Optionally configure a secret token for validation.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">GitHub</h4>
                  <p className="text-sm text-gray-600">
                    Receive GitHub webhooks with automatic signature validation using your webhook secret.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                  <p className="text-sm text-gray-600">
                    Handle Stripe webhooks with endpoint secret validation for secure payment event processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Target Types */}
          <Card>
            <CardHeader>
              <CardTitle>Supported Target Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">HTTP Endpoint</h4>
                  <p className="text-sm text-gray-600">
                    Forward webhook data to any HTTP endpoint with custom headers and HTTP methods.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Slack</h4>
                  <p className="text-sm text-gray-600">
                    Send notifications to Slack channels using incoming webhook URLs.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Discord</h4>
                  <p className="text-sm text-gray-600">
                    Post messages to Discord channels via webhook URLs.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-sm text-gray-600">
                    Send email notifications with customizable subject templates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Data Filtering</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Filters allow you to process only specific webhook events based on their data. 
                You can add multiple filters that work together to match your criteria.
              </p>
              
              <h4>Filter Operators</h4>
              <ul>
                <li><strong>equals:</strong> Exact match</li>
                <li><strong>contains:</strong> Contains substring</li>
                <li><strong>starts_with:</strong> Starts with value</li>
                <li><strong>ends_with:</strong> Ends with value</li>
                <li><strong>regex:</strong> Regular expression match</li>
              </ul>
              
              <h4>Example Filters</h4>
              <ul>
                <li><code>action equals opened</code> - Only process "opened" events</li>
                <li><code>repository.name contains "my-repo"</code> - Only repos containing "my-repo"</li>
                <li><code>sender.login starts_with "bot-"</code> - Only bot users</li>
              </ul>
            </CardContent>
          </Card>

          {/* API */}
          <Card>
            <CardHeader>
              <CardTitle>Testing Your Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p>
                Once you create a route, you'll get a unique webhook URL. You can test it using cURL:
              </p>
              
              <pre className="bg-gray-50 p-4 rounded-md">
{`curl -X POST https://api.simpflow.com/webhook/your-route-id \\
  -H "Content-Type: application/json" \\
  -d '{"test": "data", "event": "test_event"}'`}
              </pre>
              
              <p>
                Or using PowerShell:
              </p>
              
              <pre className="bg-gray-50 p-4 rounded-md">
{`Invoke-RestMethod -Uri "https://api.simpflow.com/webhook/your-route-id" \\
  -Method POST \\
  -ContentType "application/json" \\
  -Body '{"test": "data", "event": "test_event"}'`}
              </pre>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>Common Issues</h4>
              
              <h5>Webhook Not Triggering</h5>
              <ul>
                <li>Check that your route is enabled</li>
                <li>Verify the webhook URL is correct</li>
                <li>Check the logs tab for any error messages</li>
                <li>Ensure your filters aren't too restrictive</li>
              </ul>
              
              <h5>Target Not Receiving Data</h5>
              <ul>
                <li>Verify the target URL is accessible</li>
                <li>Check that required authentication headers are configured</li>
                <li>Review the route logs for delivery errors</li>
              </ul>
              
              <h5>Authentication Errors</h5>
              <ul>
                <li>For GitHub: Ensure your webhook secret matches</li>
                <li>For Stripe: Verify your endpoint secret is correct</li>
                <li>For HTTP targets: Check authentication headers</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
