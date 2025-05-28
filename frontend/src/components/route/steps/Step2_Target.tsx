'use client'

import React from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { targetRegistry, getTargetOptions, getTargetConfig } from '../config/targetRegistry';

interface Step2TargetProps {
  formData: {
    target: {
      type: string;
      config: any;
    };
  };
  onChange: (updates: any) => void;
}

const Step2_Target: React.FC<Step2TargetProps> = ({ 
  formData, 
  onChange 
}) => {
  const targetOptions = getTargetOptions();
  const selectedTargetConfig = getTargetConfig(formData.target.type);

  const handleTargetTypeChange = (targetType: string) => {
    const targetConfig = getTargetConfig(targetType);
    
    onChange({
      target: {
        type: targetType,
        config: targetConfig?.defaultConfig || {}
      }
    });
  };

  const handleTargetConfigChange = (config: any) => {
    onChange({
      target: {
        ...formData.target,
        config
      }
    });
  };

  return (
    <div className="space-y-6">      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Target
        </h3>
        <p className="text-sm text-gray-600">
          Choose where processed data will be sent
        </p>
      </div>

      <div className="space-y-4">        <SelectField
          label="Target Type"
          value={formData.target.type}
          onChange={(e) => handleTargetTypeChange(e.target.value)}
          options={targetOptions}
          required
          helperText="Choose the service where data will be sent"
        />

        {selectedTargetConfig && (          <div>
            <h4 className="text-md font-medium text-gray-800 mb-3">
              {selectedTargetConfig.label} Settings
            </h4>
            <selectedTargetConfig.component
              config={formData.target.config}
              onChange={handleTargetConfigChange}
            />
          </div>
        )}

        {!formData.target.type && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </div>              <h4 className="text-sm font-medium text-gray-900 mb-1">
                Select target
              </h4>
              <p className="text-sm text-gray-500">
                Settings will appear after selecting the target type
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Available Targets Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">        <h4 className="text-sm font-medium text-gray-900 mb-3">
          🎯 Available targets
        </h4>
        <div className="space-y-2">
          {Object.entries(targetRegistry).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-3">
              <span className="text-lg">📈</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{config.label}</p>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Flow Visualization */}
      {formData.target.type && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">          <h4 className="text-sm font-medium text-blue-900 mb-3">
            🔄 Data Flow Diagram
          </h4>
          <div className="flex items-center justify-center space-x-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl">📝</span>
              </div>              <p className="text-xs text-blue-800 font-medium">Source</p>
            </div>
            
            <div className="flex-1 h-px bg-blue-300 relative">
              <div className="absolute right-0 top-0 w-2 h-2 bg-blue-300 transform rotate-45 translate-x-1 -translate-y-1"></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <span className="text-xl">📈</span>
              </div>
              <p className="text-xs text-blue-800 font-medium">Target</p>
            </div>
          </div>          <p className="text-center text-xs text-blue-700 mt-3">
            Data will be automatically transferred from source to target
          </p>
        </div>
      )}
    </div>
  );
};

export default Step2_Target;
