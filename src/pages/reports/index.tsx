import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { FormProvider, useForm } from 'react-hook-form';
import Select from 'react-select';
// Asegúrate de que la ruta sea correcta a tu JSON
import regimenLaboral from '../../data/regimenLaboral.json';
import { toast, ToastContainer } from 'react-toastify';
import { fetchRporte } from '../../api/contractApi';

export const ReportsPage = () => {
  const [reports, setReports] = useState<any[]>([]);

  // Guardamos las opciones seleccionadas (ahora es un arreglo porque será múltiple)
  const [selectedTableOptions, setSelectedTableOptions] = useState<any[]>([]);
  const [selectedFields, setSelectedFields] = useState<any[]>([]);
  const [filters, setFilters] = useState<any[]>([]);
  const [fieldOptions, setFieldOptions] = useState<any[]>([]);

  const [format, setFormat] = useState({ value: 'pdf', label: 'PDF' });
  const form = useForm();

  // Cargar todas las tablas al montar el componente
  useEffect(() => {
    setReports(regimenLaboral);
  }, []);

  // Preparamos las opciones de tablas
  const tableOptions = reports.map((report) => ({
    value: report.seccion,
    label: report.seccion
  }));

  // NUEVA FUNCIÓN: Maneja la selección de MÚLTIPLES TABLAS
  const onChangeSearch = (selectedOptions: any) => {
    setSelectedTableOptions(selectedOptions || []);

    // Si el usuario vacía el selector de tablas, reiniciamos todo
    if (!selectedOptions || selectedOptions.length === 0) {
      setFieldOptions([]);
      setSelectedFields([]);
      return;
    }

    // Obtenemos un arreglo con los nombres de las secciones seleccionadas
    const selectedSecciones = selectedOptions.map((opt: any) => opt.value);

    // Agrupamos los campos por cada tabla seleccionada (react-select soporta grupos nativamente)
    const newFieldOptions = regimenLaboral
      .filter((report) => selectedSecciones.includes(report.seccion))
      .map((report) => ({
        label: report.seccion, // Título del grupo (Ej: TRABAJADOR)
        options: report.campos // Los campos de esa tabla
      }));

    setFieldOptions(newFieldOptions);

    // Limpieza de seguridad: Si el usuario deselecciona una tabla, quitamos los campos de esa tabla
    // que ya hubieran estado marcados en "selectedFields"
    const validValues = newFieldOptions.flatMap(group => group.options.map((opt: any) => opt.value));
    setSelectedFields(prev => prev.filter(field => validValues.includes(field.value)));
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
  ];

  const operatorOptions = [
    { value: '=', label: 'Igual a' },
    { value: '!=', label: 'Diferente de' },
    { value: '>', label: 'Mayor que' },
    { value: '<', label: 'Menor que' },
  ];

  const addFilter = () => {
    const field = form.getValues('filterField');
    const operator = form.getValues('filterOperator');
    const value = form.getValues('filterValue');
    if (field && operator && value) {
      setFilters([...filters, { field, operator, value }]);
      form.reset({ filterField: null, filterOperator: null, filterValue: '' });
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    console.log('Generating report with data:', {
      selectedFields,
      format,
      filters
    });

    try {
      // Tu backend está listo para recibir el arreglo de todos los selectedFields
      const response = {
        selectedFields,
        format,
        filters
      };

      const blob = await fetchRporte(response);

      let fileExtension = 'pdf';
      if (format.value === 'csv') {
        fileExtension = 'csv';
      } else if (format.value === 'excel') {
        fileExtension = 'xlsx';
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte.${fileExtension}`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Se descargó el archivo');
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Error al descargar el archivo');
    }
  };

  return (
    <Layout>
      <ToastContainer />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Generar Reporte</h1>

        {/* SELECTOR DE TABLAS (AHORA ES isMulti) */}
        <div className="mb-6">
          <p className="mb-2">¿Qué tablas quieres consultar?</p>
          <Select
            isMulti // <--- ¡Esto permite elegir varias tablas!
            value={selectedTableOptions}
            onChange={onChangeSearch}
            options={tableOptions}
            className="basic-multi-select w-full text-black"
            classNamePrefix="select"
            placeholder="Selecciona una o más tablas..."
            isClearable
          />
        </div>

        {/* Form Section */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* SELECTOR DE CAMPOS (Muestra los campos de todas las tablas elegidas) */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Selecciona los campos a exportar
              </label>
              <Select
                isMulti
                options={fieldOptions} // React select agrupará estos por tabla automáticamente
                onChange={(selectedOptions: any) =>
                  setSelectedFields(selectedOptions)
                }
                value={selectedFields}
                className="basic-multi-select text-black"
                classNamePrefix="select"
                placeholder="Seleccione campos..."
                isDisabled={selectedTableOptions.length === 0}
              />
            </div>

            {/* Report Format Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Formato del reporte
              </label>
              <Select
                value={format}
                onChange={(option: any) => setFormat(option)}
                options={formatOptions}
                className="basic-single text-black"
                classNamePrefix="select"
                placeholder="Seleccione formato..."
              />
            </div>

            {/* Filters Section */}
            <div className="mb-6">
              <p className="font-semibold mb-2">Filtros</p>
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-1/3">
                  <label className="block mb-1">Campo</label>
                  <Select
                    {...form.register('filterField')}
                    options={fieldOptions}
                    onChange={(option) => form.setValue('filterField', option)}
                    placeholder="Seleccione campo"
                    isClearable
                    isDisabled={selectedTableOptions.length === 0}
                    className="text-black"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block mb-1">Operador</label>
                  <Select
                    {...form.register('filterOperator')}
                    options={operatorOptions}
                    onChange={(option) =>
                      form.setValue('filterOperator', option)
                    }
                    placeholder="Seleccione operador"
                    isClearable
                    className="text-black"
                  />
                </div>
                <div className="w-1/3">
                  <label className="block mb-1">Valor</label>
                  <input
                    type="text"
                    {...form.register('filterValue')}
                    className="border border-gray-300 p-[9px] rounded w-full text-black bg-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={addFilter}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-auto w-40 font-medium transition-colors"
                >
                  Añadir filtro
                </button>
              </div>
              {filters.length > 0 && (
                <div className="mt-4 bg-gray-800 p-4 rounded-md">
                  <p className="font-semibold mb-2">Filtros aplicados:</p>
                  <ul className="space-y-2">
                    {filters.map((filter, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <span className="bg-gray-700 px-2 py-1 rounded mr-2">
                          {filter.field.label}
                        </span>
                        <span className="font-bold text-blue-400 mr-2">
                          {filter.operator.label}
                        </span>
                        <span className="bg-gray-700 px-2 py-1 rounded mr-2">
                          {filter.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFilter(index)}
                          className="ml-auto text-red-400 hover:text-red-300 font-medium"
                        >
                          Eliminar
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedFields.length === 0} // Previene enviar si no hay campos
              >
                Generar reporte
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};