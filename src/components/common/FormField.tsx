import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  required,
  children,
}) => {
  return (
    <div className="space-y-1.5 mb-3.5">
      <label className="block text-xs font-semibold text-stone-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {helperText && !error && <p className="text-[11px] text-stone-400">{helperText}</p>}
      {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }> = ({
  hasError,
  className = '',
  ...props
}) => {
  return (
    <input
      className={`w-full px-3.5 py-2.5 bg-stone-50 border ${
        hasError ? 'border-rose-300 focus:border-rose-500' : 'border-stone-200 focus:border-rose-400'
      } rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all ${className}`}
      {...props}
    />
  );
};

export const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }> = ({
  hasError,
  className = '',
  ...props
}) => {
  return (
    <textarea
      className={`w-full px-3.5 py-2.5 bg-stone-50 border ${
        hasError ? 'border-rose-300 focus:border-rose-500' : 'border-stone-200 focus:border-rose-400'
      } rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all resize-none ${className}`}
      {...props}
    />
  );
};

export const Select: React.FC<SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }> = ({
  hasError,
  className = '',
  children,
  ...props
}) => {
  return (
    <select
      className={`w-full px-3.5 py-2.5 bg-stone-50 border ${
        hasError ? 'border-rose-300 focus:border-rose-500' : 'border-stone-200 focus:border-rose-400'
      } rounded-xl text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all ${className}`}
      {...props}
    >
      {children}
    </select>
  );
};
