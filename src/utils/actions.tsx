import { HiPencil, HiTrash } from 'react-icons/hi';

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

const getActions = ({ handleEdit, handleDelete }: any) => {
  actions[0].onClick = handleEdit;
  actions[1].onClick = handleDelete;

  return actions;
}

export { getActions };
