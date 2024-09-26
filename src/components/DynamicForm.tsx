import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Button from './Button';
import CustomSelect from './CustomSelect'; // Import the reusable select component

interface FormProps {
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    validation?: Record<string, any>;
    options?: { value: string | number; label: string }[]; // For select options
    isMulti?: boolean;
  }[];
  onSubmit: (data: any) => Promise<void>;
  defaultValues?: Record<string, any>;
}

const DynamicForm: React.FC<FormProps> = ({ fields, onSubmit, defaultValues }) => {
  const methods = useForm();

  const { handleSubmit, reset } = methods;

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mx-auto bg-white p-6 rounded-md shadow-sm">
        {fields.map((field, index) => {
          if (field.type === 'select' && field.options) {
            return (
              <CustomSelect
                key={index}
                name={field.name}
                label={field.label}
                options={field.options}
                isMulti={field.isMulti || false}
                defaultValue={defaultValues?.[field.name]}
                validation={field.validation}
              />
            );
          } else {
            return (
              <div key={index} className="space-y-1">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  placeholder={field.placeholder}
                  {...methods.register(field.name, field.validation)}
                  defaultValue={defaultValues?.[field.name]}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
              </div>
            );
          }
        })}

        <div className="flex justify-end mt-4">
          <Button type="submit" variant="primary">
            Guardar
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;