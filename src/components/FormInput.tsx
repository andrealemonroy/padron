import React from 'react';
import { useFormContext } from 'react-hook-form';

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validation?: Record<string, any>;
}

const FormInput: React.FC<FormInputProps> = ({ name, label, type = 'text', placeholder, defaultValue, validation }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();  // This allows you to use the react-hook-form context

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        
        {...register(name, validation)}
        className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
          errors[name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export default FormInput;