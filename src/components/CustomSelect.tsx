import React from 'react';
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';

interface CustomSelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validation?: Record<string, any>;
  isMulti?: boolean;
  defaultValue?: { value: string | number; label: string } | { value: string | number; label: string }[] | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, label, options, validation, isMulti = false, defaultValue }) => {
  const { control, formState: { errors } } = useFormContext(); // Acceso al contexto de la forma

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || (isMulti ? [] : null)}
        rules={validation}
        render={({ field }) => (
          <div>
            <Select
              {...field}
              options={options}
              isMulti={isMulti}
              value={options.filter(option =>
                isMulti
                  ? field.value?.includes(option.value)
                  : option.value === field.value
              )}
              onChange={(selectedOption) => {
                field.onChange(
                  isMulti
                    ? (selectedOption as { value: string | number; label: string }[]).map(option => option.value)
                    : (selectedOption as { value: string | number; label: string })?.value
                );
              }}
              placeholder="Selecciona una opción..."
              classNamePrefix="react-select" // Prefijo para aplicar estilos
              styles={{
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                control: (provided: any) => ({
                  ...provided,
                  borderColor: errors[name] ? 'red' : provided.borderColor,
                  boxShadow: errors[name] ? '0 0 0 1px red' : provided.boxShadow,
                  '&:hover': {
                    borderColor: errors[name] ? 'red' : provided.borderColor,
                  },
                }),
              }}
            />
            {/* Muestra el mensaje de error si el campo es requerido */}
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">
                {(errors[name]?.message as string) || 'Este campo es requerido'}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomSelect;
