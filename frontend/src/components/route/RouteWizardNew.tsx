'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateRoutePayload, createRoute } from '@/utils/api'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { cn } from '@/utils/helpers'

// Step component imports
import Step0_Name from './steps/Step0_Name'
import Step1_Source from './steps/Step1_Source'
import Step2_Target from './steps/Step2_Target'
import Step3_Review from './steps/Step3_Review'

const STEPS = [
  { id: 'name', title: 'Name', description: 'Name and basic settings' },
  { id: 'source', title: 'Source', description: 'Where data comes from' },
  { id: 'target', title: 'Target', description: 'Where data is sent to' },
  { id: 'review', title: 'Review', description: 'Review and create' },
]

interface RouteFormData {
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
}

export function RouteWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RouteFormData>({
    name: '',
    enabled: true,
    source: {
      type: 'typeform',
      config: { secret: '' }
    },
    target: {
      type: 'googleSheets',
      config: { 
        sheetId: '', 
        sheetName: '',
        publicAccess: false 
      }
    }
  });
  // Generate webhook URL for preview
  const webhookUrl = '/api/trigger/preview';

  const updateFormData = (updates: Partial<RouteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
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
      case 0: // Name
        return formData.name.trim().length > 0
      case 1: // Source
        return !!formData.source.type
      case 2: // Target
        if (formData.target.type === 'googleSheets') {
          return !!(formData.target.config.sheetId?.trim() && formData.target.config.sheetName?.trim())
        }
        return !!formData.target.type
      case 3: // Review
        return true
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    try {      setLoading(true);
      
      // Transform data to API expected format
      const payload: CreateRoutePayload = {
        name: formData.name,
        source: formData.source.type,
        target: formData.target.type === 'googleSheets' ? 'sheets' : formData.target.type,
        filters: [],
        credentials: {
          // Combine source and target configurations
          ...formData.source.config,
          ...formData.target.config
        },
        requiredFields: []
      };

      const route = await createRoute(payload);
      
      // Redirect to the created route page
      router.push(`/route/${route.id}`);
    } catch (error) {
      console.error('Failed to create route:', error);
      alert('Failed to create route. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleTestData = async () => {
    // Test data for validation
    const testData = {
      event_id: "test_" + Date.now(),
      event_type: "form_response",
      form_response: {
        form_id: "test_form",
        token: "test_token",
        submitted_at: new Date().toISOString(),
        answers: [
          {
            field: { id: "field1", type: "email" },
            type: "email",
            email: "test@example.com"
          },
          {
            field: { id: "field2", type: "short_text" },
            type: "text",
            text: "Test Name"
          }
        ]
      }
    };    try {
      // Send test data through webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        alert('Test data sent successfully!');
      } else {
        alert('Error sending test data');
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert('Error sending test data');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step0_Name
            formData={{
              name: formData.name,
              enabled: formData.enabled
            }}
            onChange={(updates) => updateFormData(updates)}
          />
        )

      case 1:
        return (
          <Step1_Source
            formData={formData}
            onChange={updateFormData}
            webhookUrl={webhookUrl}
          />
        )

      case 2:
        return (
          <Step2_Target
            formData={formData}
            onChange={updateFormData}
          />
        )

      case 3:
        return (
          <Step3_Review
            formData={formData}
            onCreateRoute={handleSubmit}
            onTestData={handleTestData}
            loading={loading}
            webhookUrl={webhookUrl}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">          <h1 className="text-3xl font-bold text-gray-900">Create New Route</h1>
          <p className="mt-2 text-lg text-gray-600">
            Set up "Typeform → Google Sheets" automation in a few steps
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
                      )}                    >
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
        {currentStep < STEPS.length - 1 && (
          <div className="flex justify-between">            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            
            <div className="flex space-x-4">              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {currentStep === STEPS.length - 1 && (
          <div className="flex justify-between">            <Button
              variant="outline"
              onClick={prevStep}
            >
              Back
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/')}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
