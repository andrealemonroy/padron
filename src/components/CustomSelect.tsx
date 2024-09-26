import React from 'react';
import Select from 'react-select';
import { Controller, useFormContext } from 'react-hook-form';

interface CustomSelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  validation?: Record<string, any>;
  isMulti?: boolean;
  defaultValue?: { value: string | number; label: string } | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ name, label, options, validation, isMulti = false, defaultValue }) => {
  const { control } = useFormContext(); // Access the form context

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue || null}
        rules={validation}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti={isMulti}
            onChange={(selectedOption) => field.onChange(isMulti ? selectedOption.map((opt: any) => opt.value) : selectedOption?.value)}
            defaultValue={defaultValue}
            placeholder="Selecciona una opción..."
          />
        )}
      />
    </div>
  );
};

export default CustomSelect;