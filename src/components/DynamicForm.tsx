import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Button from './Button';
import CustomSelect from './CustomSelect';
import SpinnerButton from './SpinnerButton';

interface FormProps {
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    validation?: Record<string, any>;
    options?: { value: string | number; label: string }[]; // Opciones para el select
    isMulti?: boolean;
  }[];
  onSubmit: SubmitHandler<any>;
  defaultValues?: Record<string, any>;
}

const DynamicForm: React.FC<FormProps> = ({ fields, onSubmit, defaultValues }) => {
  const methods = useForm();
  const { handleSubmit, reset, formState: { errors } } = methods;
  const [isLoading, setIsLoading] = useState(false);

  // Reiniciar formulario cuando cambian los valores por defecto
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
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitWithLoading)} className="space-y-6 mx-auto bg-white p-6 rounded-md shadow-sm">
        {fields.map((field, index) => {
          if (field.type === 'select' && field.options) {
            return (
              <CustomSelect
                key={index}
                name={field.name}
                label={field.label}
                options={field.options}
                isMulti={field.isMulti || false}
                defaultValue={defaultValues?.[field.name] || (field.isMulti ? [] : null)}
                validation={field.validation}
              />
            );
          } else if (field.type === 'checkbox') {
            return (
              <div key={index} className="space-y-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    id={field.name}
                    {...methods.register(field.name, field.validation)}
                    defaultChecked={defaultValues?.[field.name]}
                    className={`mr-2`}
                  />
                  <span className="text-sm font-medium text-gray-700">{field.label}</span>
                </label>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors[field.name]?.message as string) || 'Este campo es requerido'}
                  </p>
                )}
              </div>
            );
          } else if (field.type === 'radio' && field.options) {
            return (
              <div key={index} className="space-y-1">
                <span className="block text-sm font-medium text-gray-700">{field.label}</span>
                {field.options.map((option) => (
                  <label key={option.value} className="inline-flex items-center mr-4">
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
                    {(errors[field.name]?.message as string) || 'Este campo es requerido'}
                  </p>
                )}
              </div>
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
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none ${
                    errors[field.name] ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors[field.name]?.message as string) || 'Este campo es requerido'}
                  </p>
                )}
              </div>
            );
          }
        })}

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
