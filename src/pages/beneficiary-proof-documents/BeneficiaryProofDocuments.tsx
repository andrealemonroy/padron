import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Table from '../../components/Table';
import Spinner from '../../components/Spinner';
import Breadcrumb from '../../components/BreadCrumb';
import Alert from '../../components/Alert';
import {
  deleteBeneficiaryProofDocument,
  fetchBeneficiaryProofDocuments,
} from '../../api/beneficiaryProofDocuments';
import { getActions } from '../../utils/actions';
import React from 'react';

const BeneficiaryProofDocuments = () => {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataValues, setDataValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchBeneficiaryProofDocuments();
        setDataValues(data);
      } catch (error) {
        console.error('Error fetching beneficiary-proof-documents:', error);
        toast.error('Error al cargar los documentos de acreditación');
      } finally {
        setLoading(false); // Ensure loading is set to false even if an error occurs
      }
    };

    load();
  }, []);

  const handleEdit = (data) => {
    navigate(`/edit-beneficiary-proof-documents/${data.id}`);
  };

  const handleDelete = async (id: number) => {
    setShowAlert(true);
    setIdToDelete(id);
  };

  const confirmDelete = async () => {
    if (idToDelete) {
      setLoading(true);
      try {
        await deleteBeneficiaryProofDocument(idToDelete);
        setDataValues((prev) => prev.filter((dev) => dev.id !== idToDelete));
        setShowAlert(false);
        toast.success('Documento de acreditación eliminado exitosamente');
        navigate('/beneficiary-proof-documents');
      } catch (error) {
        console.error('Error al eliminar el proyecto:', error);
        toast.error('Error al eliminar el proyecto');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setIdToDelete(null);
  };

  const breadcrumbItems = [
    {
      label: 'Documentos de acreditación',
      path: '/beneficiary-proof-documents',
    },
  ];

  const handleAdd = () => {
    navigate('/create-beneficiary-proof-documents');
  };

  // Wrap Table and Breadcrumb with React.memo to prevent unnecessary re-renders
  const MemoizedTable = React.memo(Table);
  const MemoizedBreadcrumb = React.memo(Breadcrumb);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <ToastContainer />
      {showAlert && (
        <Alert
          message="¿Estás seguro de que deseas eliminar este usuario?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center">
              {/* Add breadcrumb here */}
              <MemoizedBreadcrumb
                items={breadcrumbItems}
                buttons={[
                  {
                    text: 'Crear Documento de acreditación',
                    action: handleAdd,
                  },
                ]}
              />
            </div>

            {loading ? (
              <Spinner loading={loading} size={50} color="#3498db" /> // Show spinner while loading
            ) : (
              <MemoizedTable
                columns={[
                  {
                    header: 'Codigo',
                    accessorKey: 'code',
                    cell: (info) => info.getValue(),
                  },
                  {
                    header: 'Descripción',
                    accessorKey: 'description',
                    cell: (info) => info.getValue(),
                  },
                ]}
                data={dataValues}
                actions={getActions({ handleEdit, handleDelete })}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BeneficiaryProofDocuments;
