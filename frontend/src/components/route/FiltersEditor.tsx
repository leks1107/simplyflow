import React from 'react';
import { Button } from '@/components/ui/Button';
import { InputField } from '@/components/ui/InputField';
import { SelectField } from '@/components/ui/SelectField';
import { Filter } from '@/utils/api-simple';
import { FILTER_OPERATORS } from '@/utils/helpers';

interface FilterRowProps {
  filter: Filter;
  index: number;
  onUpdate: (index: number, filter: Filter) => void;
  onRemove: (index: number) => void;
}

const FilterRow: React.FC<FilterRowProps> = ({ filter, index, onUpdate, onRemove }) => {
  const handleFieldChange = (field: keyof Filter, value: any) => {
    onUpdate(index, { ...filter, [field]: value });
  };

  const requiresValue = !['is_empty', 'is_not_empty'].includes(filter.op);

  return (
    <div className="flex items-end gap-3 p-4 bg-gray-50 rounded-lg">
      {/* Field Name */}
      <div className="flex-1">
        <InputField
          label="Field Name"
          value={filter.field}
          onChange={(e) => handleFieldChange('field', e.target.value)}
          placeholder="e.g., email, name, interest"
        />
      </div>

      {/* Operator */}
      <div className="flex-1">
        <SelectField
          label="Operator"
          value={filter.op}
          onChange={(e) => handleFieldChange('op', e.target.value)}
          options={FILTER_OPERATORS}
          placeholder="Select operator"
        />
      </div>

      {/* Value */}
      <div className="flex-1">
        <InputField
          label="Value"
          value={filter.value || ''}
          onChange={(e) => handleFieldChange('value', e.target.value)}
          placeholder={requiresValue ? "Filter value" : "Not required"}
          disabled={!requiresValue}
        />
      </div>

      {/* Remove Button */}
      <div className="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemove(index)}
          className="text-error-600 hover:text-error-700 hover:bg-error-50"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

interface FiltersEditorProps {
  filters: Filter[];
  onChange: (filters: Filter[]) => void;
}

const FiltersEditor: React.FC<FiltersEditorProps> = ({ filters, onChange }) => {
  const handleAddFilter = () => {
    onChange([...filters, { field: '', op: 'equals', value: '' }]);
  };

  const handleUpdateFilter = (index: number, filter: Filter) => {
    const newFilters = [...filters];
    newFilters[index] = filter;
    onChange(newFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onChange(newFilters);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <p className="text-sm text-gray-500">
            Add filters to process only matching webhook data
          </p>
        </div>
        <Button variant="outline" onClick={handleAddFilter}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Filter
        </Button>
      </div>

      {filters.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <p>No filters configured</p>
          <p className="text-sm mt-1">All webhook data will be processed</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filters.map((filter, index) => (
            <FilterRow
              key={index}
              filter={filter}
              index={index}
              onUpdate={handleUpdateFilter}
              onRemove={handleRemoveFilter}
            />
          ))}
        </div>
      )}

      {filters.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            📋 Filter Logic
          </h4>
          <div className="text-sm text-blue-800">
            <p>• All filters must pass for data to be processed (AND logic)</p>
            <p>• If any filter fails, the webhook will be marked as "filtered"</p>
            <p>• Empty field names or operators will be ignored</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersEditor;
