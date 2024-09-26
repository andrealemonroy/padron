import React from 'react';
import { BarLoader } from 'react-spinners';

interface SpinnerProps {
  loading: boolean;
  size?: number;
  color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  loading,
  color = '#3498db',
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 h-full">
      <BarLoader loading={loading} color={color} />
      <p className="ml-2 text-gray-700 dark:text-gray-200">Cargando...</p>
    </div>
  );
};

export default Spinner;
