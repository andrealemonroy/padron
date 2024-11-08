import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { FormProvider, useForm } from 'react-hook-form';
import Select from 'react-select';
import regimenLaboral from '../../data/regimenLaboral.json';
import { toast, ToastContainer } from 'react-toastify';
import { fetchRporte } from '../../api/contractApi';

export const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [selectedFields, setSelectedFields] = useState<{ value: string; label: string; }[]>([]);
  const [filters, setFilters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [format, setFormat] = useState({ value: 'pdf', label: 'PDF' });
  const form = useForm();
  const [fieldOptions, setFieldOptions] = useState([]);
  
  const fetchReports = async () => {
    try {
      const response = regimenLaboral.filter(f => 
        f.seccion.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setReports(response);
      setFieldOptions(response[0]?.campos)
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  

  const onChangeSearch = (e) => {
    setSearchQuery(e.target.value);
    // Optionally debounce fetchReports for performance
  
    fetchReports();
  };

  const formatOptions = [
    { value: 'pdf', label: 'PDF' },
    { value: 'csv', label: 'CSV' },
    { value: 'excel', label: 'Excel' },
    // Add more formats if needed
  ];

  const operatorOptions = [
    { value: '=', label: 'Igual a' },
    { value: '!=', label: 'Diferente de' },
    { value: '>', label: 'Mayor que' },
    { value: '<', label: 'Menor que' },
    // Add more operators as needed
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

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    // Handle form submission to generate the report
    console.log('Generating report with data:', {
      selectedFields,
      format,
      filters
    });

    console.log(data);

    try {
      const response = {
        selectedFields,
        format,
        filters
      };

      // Realiza la solicitud para obtener el archivo
      const blob = await fetchRporte(response); // Obtiene el Blob del archivo

      // Determinar la extensión del archivo basada en el formato seleccionado
      let fileExtension = 'pdf'; // Por defecto PDF
      if (format.value === 'csv') {
        fileExtension = 'csv';
      } else if (format.value === 'excel') {
        fileExtension = 'xlsx';
      }

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Asigna un nombre al archivo que se descargará
      link.download = `reporte.${fileExtension}`; // Usa la extensión determinada

      // Simula un clic para iniciar la descarga
      document.body.appendChild(link);
      link.click();

      // Limpia el URL creado y elimina el enlace
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

        {/* Search Section */}
        <div className="mb-6">
          <p className="mb-2">¿Qué tabla quieres exportar?</p>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Buscar..."
              onChange={onChangeSearch}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          {reports.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold mb-2">Resultados</p>
              <ul className="list-disc list-inside">
                {reports.map((report) => (
                  <li key={report.id}>{report.seccion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Form Section */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Field Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Selecciona los campos a exportar
              </label>
              <Select
                isMulti
                options={fieldOptions}
                onChange={(selectedOptions: any) =>
                  setSelectedFields(selectedOptions)
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Seleccione campos..."
              />
            </div>

            {/* Report Format Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Formato del reporte
              </label>
              <Select
                value={format}
                onChange={(option) => setFormat(option)}
                options={formatOptions}
                className="basic-single"
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
                  />
                </div>
                <div className="w-1/3">
                  <label className="block mb-1">Valor</label>
                  <input
                    type="text"
                    {...form.register('filterValue')}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={addFilter}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-auto w-40 "
                >
                  Añadir filtro
                </button>
              </div>
              {filters.length > 0 && (
                <div className="mt-2">
                  <p className="font-semibold">Filtros aplicados:</p>
                  <ul className="list-disc list-inside">
                    {filters.map((filter, index) => (
                      <li key={index} className="flex items-center">
                        {filter.field.label} {filter.operator.label}{' '}
                        {filter.value}
                        <button
                          type="button"
                          onClick={() => removeFilter(index)}
                          className="ml-2 text-red-500"
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
              {/* <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Guardar como plantilla
              </button> */}
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
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