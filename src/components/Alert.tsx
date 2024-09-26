import React from 'react';

interface AlertProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-md p-6 w-96">
                <h2 className="text-lg font-semibold mb-4">{message}</h2>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={onCancel} 
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;
