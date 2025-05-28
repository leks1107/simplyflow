// Source Registry - Data sources registry
import { ComponentType } from 'react';

// Interface for source configuration
export interface SourceConfig {
  label: string;
  component: ComponentType<SourceFormProps>;
  defaultConfig: Record<string, any>;
  description?: string;
}

// Interface for source component props
export interface SourceFormProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
  webhookUrl?: string;
}

// Import source components
import TypeformSourceForm from '../sources/TypeformSourceForm';
import TallySourceForm from '../sources/TallySourceForm';

// Registry of all available sources
export const sourceRegistry: Record<string, SourceConfig> = {
  typeform: {
    label: "Typeform",
    component: TypeformSourceForm,
    defaultConfig: { secret: "" },
    description: "Receive data from Typeform forms"
  },
  tally: {
    label: "Tally",
    component: TallySourceForm,
    defaultConfig: { apiKey: "" },
    description: "Receive data from Tally forms"
  }
  // New sources can be easily added here
};

// Function to get all available sources for select
export const getSourceOptions = () => {
  return Object.entries(sourceRegistry).map(([key, config]) => ({
    value: key,
    label: config.label
  }));
};

// Function to get source configuration by type
export const getSourceConfig = (type: string): SourceConfig | null => {
  return sourceRegistry[type] || null;
};
