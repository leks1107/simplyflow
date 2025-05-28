'use client'

import React from 'react';
import { InputField } from '@/components/ui/InputField';

interface Step0NameProps {
  formData: {
    name: string;
    enabled: boolean;
  };
  onChange: (updates: Partial<{ name: string; enabled: boolean }>) => void;
}

const Step0_Name: React.FC<Step0NameProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-6">
      <div>        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Basic Information
        </h3>
        <p className="text-sm text-gray-600">
          Let's start with the name of your automation route
        </p>
      </div>

      <div className="space-y-4">        <InputField
          label="Route Name"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="For example: Typeform → Google Sheets"
          required
          helperText="A clear name will help you easily find this route in the list"
        />

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => onChange({ enabled: e.target.checked })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />          <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
            Enable route immediately after creation
          </label>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>              <h4 className="text-sm font-medium text-blue-900">
                💡 What is a route?
              </h4>
              <p className="text-sm text-blue-800 mt-1">
                A route is an automatic connection between a data source (e.g., Typeform) 
                and a destination (e.g., Google Sheets). When someone fills out your form, 
                data automatically goes into the spreadsheet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step0_Name;
