import React, { useEffect } from 'react';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange?: (value: any) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, label, options, validation, isMulti = false, defaultValue , onChange}) => {
  const { control, formState: { errors }, getValues } = useFormContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = isMulti
      ? Array.from(event.target.selectedOptions, option => option.value)
      : event.target.value;

    if (onChange) {
      onChange(value); // Llama a la función onChange si está definida
    }
  };
  
  useEffect(() => {
  }, [control, name, getValues]);

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
              value={isMulti 
                ? options.filter(option => field.value.includes(option.value)) 
                : options.find(option => option.value === field.value) || null}
                onChange={(selectedOption) => {
                  const value = isMulti
                    ? (selectedOption as { value: string | number; label: string }[]).map(option => option.value)
                    : selectedOption
                    ? (selectedOption as { value: string | number; label: string }).value
                    : null;
              
                  field.onChange(value); 
                  if (onChange) {
                    onChange(selectedOption); // Llama a la función onChange si está definida
                  }
                }}
              placeholder="Selecciona una opción..."
              classNamePrefix="react-select"
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderColor: errors[name] ? 'red' : provided.borderColor,
                  boxShadow: errors[name] ? '0 0 0 1px red' : provided.boxShadow,
                  '&:hover': {
                    borderColor: errors[name] ? 'red' : provided.borderColor,
                  },
                }),
              }}
            />
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
