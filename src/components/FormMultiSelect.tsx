import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import Select from 'react-select';

interface FormMultiSelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[]; // Opciones del multiselect
  placeholder?: string;
  defaultValue?: { value: string | number; label: string }[]; // Valor por defecto
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validation?: Record<string, any>;
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  options,
  placeholder,
  defaultValue = [], // Valor por defecto vacío si no se proporciona
  validation,
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue} // Asignar valor por defecto
        rules={validation}
        render={({ field }) => (
          <Select
            {...field}
            isMulti
            options={options}
            placeholder={placeholder}
            defaultValue={defaultValue} // Mostrar valor por defecto
            onChange={(selected) => field.onChange(selected)}
          />
        )}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export default FormMultiSelect;
