import { HiEye, HiMail, HiPencil, HiTrash } from 'react-icons/hi';

interface Action {
  icon: JSX.Element;
  label: string;
  onClick: (data: any) => void;
}

const actions: Action[] = [
  {
    icon: <HiPencil size={20} />,
    label: 'Editar',
    onClick: () => {},
  },
  {
    icon: <HiTrash size={20} />,
    label: 'Eliminar',
    onClick: () => {},
  },
];

const getActions = ({ handleEdit, handleDelete, sendEmail, sendUrl }: any) => {
  const dynamicActions = [...actions]; // Copiar las acciones base

  // Asignar las funciones a las acciones
  dynamicActions[0].onClick = handleEdit;
  dynamicActions[1].onClick = handleDelete;

  // Agregar la acción de enviar correo solo si sendEmail está definido
  if (sendEmail) {
    dynamicActions.splice(1, 0, { // Insertar la acción de enviar correo en la posición deseada
      icon: <HiMail size={20} />,
      label: 'Enviar correo',
      onClick: sendEmail,
    });
  }

  if (sendUrl) {
    dynamicActions.splice(1, 0, { // Insertar la acción de enviar correo en la posición deseada
      icon: <HiEye size={20} />,
      label: 'Respuestas',
      onClick: sendUrl,
    });
  }

  

  return dynamicActions;
}

export { getActions };
