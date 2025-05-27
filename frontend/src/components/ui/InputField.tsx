import React from 'react';
import { cn } from '@/utils/helpers';

interface BaseInputFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

interface SingleLineInputProps extends BaseInputFieldProps, React.InputHTMLAttributes<HTMLInputElement> {
  multiline?: false;
}

interface MultiLineInputProps extends BaseInputFieldProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  multiline: true;
}

type InputFieldProps = SingleLineInputProps | MultiLineInputProps;

const InputField = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ className, label, error, helperText, startIcon, endIcon, multiline, rows = 3, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {startIcon && !multiline && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{startIcon}</div>
            </div>
          )}
          {multiline ? (
            <textarea
              id={inputId}
              rows={rows}
              className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
                error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
                className
              )}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              id={inputId}
              className={cn(
                'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
                startIcon && 'pl-10',
                endIcon && 'pr-10',
                error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
                className
              )}
              ref={ref as React.Ref<HTMLInputElement>}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {endIcon && !multiline && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="h-5 w-5 text-gray-400">{endIcon}</div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export { InputField };
