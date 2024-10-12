import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const Dashboard: React.FC = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-md">
                    <div className="text-center">
                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Bienvenido
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Descubre un mundo de posibilidades con nuestra plataforma innovadora.
                    </p>
                    </div>
                    <div className="mt-8">
                    <button
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Comenzar
                    </button>
                  </div>
              </div>
            </div>  
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;