import React, { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import Button from './Button';
import CustomSelect from './CustomSelect'; // Importar el componente de selección personalizada
import SpinnerButton from './SpinnerButton'; // Asegúrate de tener un componente Spinner

interface FormProps {
  fields: {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validation?: Record<string, any>;
    options?: { value: string | number; label: string }[]; // Opciones para el select
    isMulti?: boolean;
  }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: SubmitHandler<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValues?: Record<string, any>;
}

const DynamicForm: React.FC<FormProps> = ({ fields, onSubmit, defaultValues }) => {
  const methods = useForm();
  const { handleSubmit, reset, formState: { errors } } = methods;
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  // Reiniciar formulario cuando cambian los valores por defecto
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitWithLoading = async (data: any) => {
    console.log(data);
    console.log('Valores del formulario:', methods.getValues());
    setIsLoading(true); // Mostrar spinner al enviar el formulario
    try {
      await onSubmit(data); // Llamar a la función de envío
    } catch (error) {
      // Aquí podrías mostrar un error si ocurre
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsLoading(false); // Ocultar el spinner después de enviar el formulario
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
          {isLoading && <SpinnerButton size={16} />} {/* Ahora el spinner tiene un tamaño de 16px */}
          {isLoading ? ' Guardando...' : 'Guardar'}
        </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DynamicForm;
