import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Button from './Button';
import CustomSelect from './CustomSelect';
import SpinnerButton from './SpinnerButton';

interface FieldProps {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  validation?: Record<string, any>;
  options?: { value: string | number; label: string }[];
  isMulti?: boolean;
  colSpan?: number; // New property to specify column span
  onChange?: (value: any) => void;
}

interface FormProps {
  fields: FieldProps[];
  onSubmit: SubmitHandler<any>;
  defaultValues?: Record<string, any>;
  columns?: number; // New prop to specify number of columns
  
}

const DynamicForm: React.FC<FormProps> = ({
  fields,
  onSubmit,
  defaultValues,
  columns = 1, // Default to 1 column if not specified
}) => {

  
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmitWithLoading = async (data: any) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate grid column classes based on the number of columns
  const getGridColsClass = () => {
    switch (columns) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 md:grid-cols-2';
      case 3:
        return 'grid-cols-1 md:grid-cols-3';
      case 4:
        return 'grid-cols-1 md:grid-cols-4';
      default:
        return 'grid-cols-1';
    }
  };

  // Generate column span classes for each field
  const getColSpanClass = (colSpan?: number) => {
    if (!colSpan || colSpan === 1) {
      return '';
    }
    return `md:col-span-${colSpan}`;
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmitWithLoading)}
        className="bg-white p-6 rounded-md shadow-sm"
      >
        <div className={`grid ${getGridColsClass()} gap-6`}>
          {fields.map((field, index) => (
            <div
              key={index}
              className={`${
                field.type !== 'checkbox' && field.type !== 'radio' ? 'space-y-1' : ''
              } ${getColSpanClass(field.colSpan)}`}
            >
              {field.type === 'select' && field.options ? (
                <CustomSelect
                  name={field.name}
                  label={field.label}
                  options={field.options}
                  isMulti={field.isMulti || false}
                  onChange={field.onChange} 
                  defaultValue={
                    defaultValues?.[field.name] || (field.isMulti ? [] : null)
                  }
                  validation={field.validation}
                  
                />
              ) : field.type === 'checkbox' ? (
                <div className="space-y-1">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      id={field.name}
                      {...methods.register(field.name, field.validation)}
                      defaultChecked={defaultValues?.[field.name]}
                      className={`mr-2`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {field.label}
                    </span>
                  </label>
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]?.message?.toString() ||
                        'Este campo es requerido'}
                    </p>
                  )}
                </div>
              ) : field.type === 'radio' && field.options ? (
                <div className="space-y-1">
                  <span className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </span>
                  {field.options.map((option) => (
                    <label
                      key={option.value}
                      className="inline-flex items-center mr-4"
                    >
                      <input
                        type="radio"
                        id={String(option.value)}
                        value={option.value}
                        {...methods.register(field.name, field.validation)}
                        defaultChecked={defaultValues?.[field.name] === option.value}
                        className={`mr-2`}
                      />
                      <span className="text-sm font-medium">{option.label}</span>
                    </label>
                  ))}
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]?.message?.toString() ||
                        'Este campo es requerido'}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-1">
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.name}
                    placeholder={field.placeholder}
                    min={field.type === 'number' ? 1 : undefined}
                    {...methods.register(field.name, field.validation)}
                    defaultValue={defaultValues?.[field.name]}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                      errors[field.name]
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : ''
                    }`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors[field.name]?.message?.toString() ||
                        'Este campo es requerido'}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading && <SpinnerButton size={16} />}
            {isLoading ? ' Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;