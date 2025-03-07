import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { FormProvider, useForm } from 'react-hook-form';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import { fetchUsers } from '../../api/userApi';
import { reportsPadron } from '../../api/contractApi';

export const HistoricoPage = () => {
  const [selectedFields, setSelectedFields] = useState<{ value: string; label: string; }[]>([]);
  const form = useForm();
  const [fieldOptions, setFieldOptions] = useState([]);
  
  useEffect(() => {
      const load = async () => {
        try {
          const data = await fetchUsers();
          setFieldOptions(data.map((user) => ({ value: String(user.id), label: user.name })));
        } catch (error) {
          console.error('Error fetching Formulario:', error);
          toast.error('Error al cargar los Formulario');
        }
      };
      
      load();
    }, []);

  const onSubmit = async (data) => {

    try {
      const response = {
        selectedFields,
      };

      // Realiza la solicitud para obtener el archivo
      const blob = await reportsPadron(response); // Obtiene el Blob del archivo

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Asigna un nombre al archivo que se descargará
      link.download = `reporte.xlsx`; // Usa la extensión determinada

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
        <h1 className="text-2xl font-bold mb-4">Padrón General de Trabajadores - Histórico</h1>
        {/* Form Section */}
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Field Selection */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">
                Selecciona Trabajadores a exportar
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