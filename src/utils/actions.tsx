import { HiDownload, HiEye, HiMail, HiPencil, HiTrash } from 'react-icons/hi';

interface Action {
  icon: JSX.Element;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick: (data: any) => void;
}

const actions: Action[] = [
  {
    icon: <HiPencil size={20} />,
    label: '',
    onClick: () => {},
  },
  {
    icon: <HiTrash size={20} />,
    label: '',
    onClick: () => {},
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getActions = ({ handleEdit, handleDelete, sendEmail, sendUrl, btnContract, btnContract2, btnContract3 }: any) => {
  const dynamicActions = [...actions]; // Copiar las acciones base

  // Asignar las funciones a las acciones base
  dynamicActions[0].onClick = handleEdit;
  dynamicActions[1].onClick = handleDelete;

  // Lista de nuevas acciones a insertar
  const newActions = [
    sendEmail && { icon: <HiMail size={20} />, label: '', onClick: sendEmail },
    sendUrl && { icon: <HiEye size={20} />, label: '', onClick: sendUrl },
    btnContract && { icon: <HiDownload size={20} />, label: '', onClick: btnContract },
    btnContract2 && { icon: <HiDownload size={20} />, label: '', onClick: btnContract2 },
    btnContract3 && { icon: <HiDownload size={20} />, label: '', onClick: btnContract3 },
  ].filter(Boolean); // Filtrar para eliminar elementos nulos o undefined

  // Insertar nuevas acciones al principio, después de la acción de eliminación
  dynamicActions.splice(1, 0, ...newActions);

  return dynamicActions;
};

export { getActions };
