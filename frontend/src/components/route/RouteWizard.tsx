'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateRoutePayload, createRoute, Filter } from '@/utils/api-simple'
import { Button } from '@/components/ui/Button'
import { InputField } from '@/components/ui/InputField'
import { SelectField } from '@/components/ui/SelectField'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import FiltersEditor from '@/components/route/FiltersEditor'
import { SOURCE_TYPES, TARGET_TYPES } from '@/utils/helpers'
import { cn } from '@/utils/helpers'

const STEPS = [
  { id: 'basic', title: 'Basic Information', description: 'Route name and description' },
  { id: 'source', title: 'Source Configuration', description: 'Configure webhook source' },
  { id: 'target', title: 'Target Configuration', description: 'Configure destination' },
  { id: 'filters', title: 'Data Filtering', description: 'Optional data filters' },
  { id: 'review', title: 'Review & Create', description: 'Review your configuration' },
]

interface RouteFormData {
  name: string;
  description?: string;
  source: {
    type: string;
    config: any;
  };
  target: {
    type: string;
    config: any;
  };
  filters: Array<{
    field: string;
    operator: string;
    value: string;
  }>;
  enabled: boolean;
}

export function RouteWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RouteFormData>({
    name: '',
    description: '',
    source: {
      type: 'webhook',
      config: {}
    },
    target: {
      type: 'http',
      config: {
        url: '',
        method: 'POST',
        headers: {}
      }
    },
    filters: [],
    enabled: true
  })

  const updateFormData = (updates: Partial<RouteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const updateSourceConfig = (config: any) => {
    setFormData(prev => ({
      ...prev,
      source: { ...prev.source, config: { ...prev.source.config, ...config } }
    }))
  }

  const updateTargetConfig = (config: any) => {
    setFormData(prev => ({
      ...prev,
      target: { ...prev.target, config: { ...prev.target.config, ...config } }
    }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Basic Info
        return formData.name.trim().length > 0
      case 1: // Source
        return formData.source.type && Object.keys(formData.source.config).length > 0
      case 2: // Target
        return formData.target.type && formData.target.config.url?.trim().length > 0
      case 3: // Filters
        return true // Optional step
      case 4: // Review
        return true
      default:
        return false
    }
  }
  const handleSubmit = async () => {
    try {
      setLoading(true)
      
      // Convert form data to API format
      const payload: CreateRoutePayload = {
        name: formData.name,
        source: JSON.stringify({
          type: formData.source.type,
          config: formData.source.config
        }),
        target: JSON.stringify({
          type: formData.target.type,
          config: formData.target.config
        }),
        filters: formData.filters.map(f => ({
          field: f.field,
          op: f.operator,
          value: f.value
        })),        credentials: {}, // Add default empty credentials
        duplicateCheckField: undefined,
        requiredFields: undefined
      }

      const route = await createRoute(payload)
      router.push(`/route/${route.id}`)
    } catch (error) {
      console.error('Failed to create route:', error)
      alert('Failed to create route. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <InputField
              label="Route Name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              placeholder="My Webhook Route"
              required
            />
            <InputField
              label="Description"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe what this route does..."
              multiline
              rows={3}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <SelectField
              label="Source Type"
              value={formData.source.type}
              onChange={(value) => updateFormData({ 
                source: { type: value as any, config: {} } 
              })}
              options={SOURCE_TYPES}
              required
            />
            
            {formData.source.type === 'webhook' && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Webhook URL</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your webhook URL will be automatically generated after creating the route.
                  </p>
                </div>
                <InputField
                  label="Secret Token (Optional)"
                  value={formData.source.config.secret || ''}
                  onChange={(e) => updateSourceConfig({ secret: e.target.value })}
                  placeholder="Optional secret for webhook validation"
                />
              </div>
            )}

            {formData.source.type === 'github' && (
              <InputField
                label="GitHub Secret"
                value={formData.source.config.secret || ''}
                onChange={(e) => updateSourceConfig({ secret: e.target.value })}
                placeholder="Your GitHub webhook secret"
                required
              />
            )}

            {formData.source.type === 'stripe' && (
              <InputField
                label="Stripe Endpoint Secret"
                value={formData.source.config.endpointSecret || ''}
                onChange={(e) => updateSourceConfig({ endpointSecret: e.target.value })}
                placeholder="whsec_..."
                required
              />
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <SelectField
              label="Target Type"
              value={formData.target.type}
              onChange={(value) => updateFormData({ 
                target: { type: value as any, config: { url: '', method: 'POST', headers: {} } } 
              })}
              options={TARGET_TYPES}
              required
            />

            {(formData.target.type === 'http' || formData.target.type === 'slack' || formData.target.type === 'discord') && (
              <InputField
                label="Webhook URL"
                value={formData.target.config.url || ''}
                onChange={(e) => updateTargetConfig({ url: e.target.value })}
                placeholder="https://example.com/webhook"
                required
              />
            )}

            {formData.target.type === 'http' && (
              <>
                <SelectField
                  label="HTTP Method"
                  value={formData.target.config.method || 'POST'}
                  onChange={(value) => updateTargetConfig({ method: value })}
                  options={[
                    { value: 'POST', label: 'POST' },
                    { value: 'PUT', label: 'PUT' },
                    { value: 'PATCH', label: 'PATCH' },
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Headers (Optional)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.target.config.headers || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const headers = JSON.parse(e.target.value)
                        updateTargetConfig({ headers })
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>
              </>
            )}

            {formData.target.type === 'email' && (
              <>
                <InputField
                  label="To Email"
                  value={formData.target.config.to || ''}
                  onChange={(e) => updateTargetConfig({ to: e.target.value })}
                  placeholder="admin@example.com"
                  type="email"
                  required
                />
                <InputField
                  label="Subject Template"
                  value={formData.target.config.subject || ''}
                  onChange={(e) => updateTargetConfig({ subject: e.target.value })}
                  placeholder="Webhook Alert: {{event_type}}"
                />
              </>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Data Filters</h3>
              <p className="text-sm text-gray-600 mb-6">
                Add filters to process only specific webhook events. Leave empty to process all events.
              </p>
            </div>            <FiltersEditor
              filters={formData.filters.map(f => ({ field: f.field, op: f.operator, value: f.value }))}
              onChange={(filters) => updateFormData({ 
                filters: filters.map(f => ({ field: f.field, operator: f.op, value: f.value }))
              })}
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review Configuration</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{formData.name}</dd>
                  </div>
                  {formData.description && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Description</dt>
                      <dd className="text-sm text-gray-900">{formData.description}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Source Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{formData.source.type}</dd>
                  </div>
                  {Object.entries(formData.source.config).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                      <dd className="text-sm text-gray-900">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Target Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="text-sm text-gray-900 capitalize">{formData.target.type}</dd>
                  </div>
                  {Object.entries(formData.target.config).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                      <dd className="text-sm text-gray-900">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            {formData.filters.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {formData.filters.map((filter, index) => (
                      <div key={index} className="text-sm text-gray-900">
                        {filter.field} {filter.operator} {filter.value}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Route</h1>
          <p className="mt-2 text-lg text-gray-600">
            Set up a new webhook route in a few easy steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
              {STEPS.map((step, index) => (
                <li key={step.id} className="md:flex-1">
                  <div
                    className={cn(
                      'group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4',
                      index <= currentStep
                        ? 'border-blue-600'
                        : 'border-gray-200'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm font-medium',
                        index <= currentStep
                          ? 'text-blue-600'
                          : 'text-gray-500'
                      )}
                    >
                      Step {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {step.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{STEPS[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
            
            {currentStep === STEPS.length - 1 ? (              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                isLoading={loading}
              >
                Create Route
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
