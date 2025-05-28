// Target Registry - Targets (destinations) registry
import { ComponentType } from 'react';

// Interface for target configuration
export interface TargetConfig {
  label: string;
  component: ComponentType<TargetFormProps>;
  defaultConfig: Record<string, any>;
  description?: string;
}

// Interface for target component props
export interface TargetFormProps {
  config: Record<string, any>;
  onChange: (config: Record<string, any>) => void;
}

// Import target components
import GoogleSheetsTargetForm from '../targets/GoogleSheetsTargetForm';
import NotionTargetForm from '../targets/NotionTargetForm';

// Registry of all available targets
export const targetRegistry: Record<string, TargetConfig> = {
  googleSheets: {
    label: "Google Sheets",
    component: GoogleSheetsTargetForm,
    defaultConfig: { 
      sheetId: "", 
      sheetName: "",
      publicAccess: false 
    },
    description: "Send data to Google Sheets"
  },
  notion: {
    label: "Notion",
    component: NotionTargetForm,
    defaultConfig: { 
      integrationToken: "", 
      databaseId: "" 
    },
    description: "Send data to Notion database"
  }
  // New targets can be easily added here
};

// Function to get all available targets for select
export const getTargetOptions = () => {
  return Object.entries(targetRegistry).map(([key, config]) => ({
    value: key,
    label: config.label
  }));
};

// Function to get target configuration by type
export const getTargetConfig = (type: string): TargetConfig | null => {
  return targetRegistry[type] || null;
};
