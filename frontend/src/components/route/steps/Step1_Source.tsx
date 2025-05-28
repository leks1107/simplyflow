'use client'

import React from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { sourceRegistry, getSourceOptions, getSourceConfig } from '../config/sourceRegistry';

interface Step1SourceProps {
  formData: {
    source: {
      type: string;
      config: any;
    };
  };
  onChange: (updates: any) => void;
  webhookUrl?: string;
}

const Step1_Source: React.FC<Step1SourceProps> = ({ 
  formData, 
  onChange, 
  webhookUrl 
}) => {
  const sourceOptions = getSourceOptions();
  const selectedSourceConfig = getSourceConfig(formData.source.type);

  const handleSourceTypeChange = (sourceType: string) => {
    const sourceConfig = getSourceConfig(sourceType);
    
    onChange({
      source: {
        type: sourceType,
        config: sourceConfig?.defaultConfig || {}
      }
    });
  };

  const handleSourceConfigChange = (config: any) => {
    onChange({
      source: {
        ...formData.source,
        config
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Data Source
        </h3>        <p className="text-sm text-gray-600">
          Choose where data will come from for processing
        </p>
      </div>

      <div className="space-y-4">        <SelectField
          label="Source Type"
          value={formData.source.type}
          onChange={(e) => handleSourceTypeChange(e.target.value)}
          options={sourceOptions}
          required
          helperText="Choose the service that will send data"
        />

        {selectedSourceConfig && (
          <div>            <h4 className="text-md font-medium text-gray-800 mb-3">
              {selectedSourceConfig.label} Settings
            </h4>
            <selectedSourceConfig.component
              config={formData.source.config}
              onChange={handleSourceConfigChange}
              webhookUrl={webhookUrl}
            />
          </div>
        )}

        {!formData.source.type && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Select data source
              </h4>
              <p className="text-sm text-gray-500">
                Settings will appear after selecting the source type
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Sources Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          📊 Available data sources
        </h4>
        <div className="space-y-2">
          {Object.entries(sourceRegistry).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3">
              <span className="text-lg">📝</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{config.label}</p>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1_Source;
