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
                <li>Click &quot;Create Route&quot; from the dashboard</li>
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
                    Post messages to Discord channels via Discord webhooks.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email</h4>
                  <p className="text-sm text-gray-600">
                    Send email notifications when webhooks are received.
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
                Use filters to process only specific webhook events that match your criteria:
              </p>
              
              <h4>Filter Operations</h4>
              <ul>
                <li><strong>equals</strong> - Exact match</li>
                <li><strong>contains</strong> - Partial match</li>
                <li><strong>starts_with</strong> - Prefix match</li>
                <li><strong>ends_with</strong> - Suffix match</li>
                <li><strong>greater_than / less_than</strong> - Numeric comparisons</li>
                <li><strong>is_empty / is_not_empty</strong> - Check for null/empty values</li>
              </ul>
              
              <h4>Example Filters</h4>
              <ul>
                <li>Only process GitHub push events: <code>event_type equals &quot;push&quot;</code></li>
                <li>Filter by repository: <code>repository.name equals &quot;my-repo&quot;</code></li>
                <li>Skip draft pull requests: <code>pull_request.draft equals false</code></li>
              </ul>
            </CardContent>
          </Card>

          {/* API Reference */}
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <h4>Webhook Endpoint</h4>
              <p>
                Each route gets a unique webhook URL that you can use to receive webhooks:
              </p>
              <code className="block bg-gray-100 p-2 rounded">
                POST https://your-domain.com/api/trigger/{'{route-id}'}
              </code>
              
              <h4>Response Format</h4>
              <p>Successful webhook processing returns:</p>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`{
  "success": true,
  "message": "Webhook processed successfully",
  "route_id": "route-123",
  "timestamp": "2024-01-01T12:00:00Z",
  "processing_time_ms": 45
}`}
              </pre>
              
              <h4>Error Handling</h4>
              <p>When webhooks fail, you&apos;ll receive:</p>
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
{`{
  "success": false,
  "error": "Target endpoint unreachable",
  "route_id": "route-123",
  "timestamp": "2024-01-01T12:00:00Z"
}`}
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
              
              <h5>Webhook not triggering</h5>
              <ul>
                <li>Check that the webhook URL is correct</li>
                <li>Verify the route is enabled</li>
                <li>Ensure the source service is sending webhooks</li>
                <li>Check webhook signatures for GitHub/Stripe sources</li>
              </ul>
              
              <h5>Filters not working</h5>
              <ul>
                <li>Verify filter field paths are correct</li>
                <li>Check data types match your filter values</li>
                <li>Use the webhook preview to test your filters</li>
              </ul>
              
              <h5>Target not receiving data</h5>
              <ul>
                <li>Verify target endpoint is accessible</li>
                <li>Check target endpoint accepts the HTTP method</li>
                <li>Validate authentication headers if required</li>
                <li>Review webhook logs for error details</li>
              </ul>
              
              <h4>Getting Help</h4>
              <p>
                If you need assistance, check the webhook logs in your route details page 
                for detailed error information and processing history.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
