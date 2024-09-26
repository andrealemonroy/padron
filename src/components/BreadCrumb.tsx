import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex bg-white w-full p-4 rounded-md" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3 ">
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              {index !== 0 && (
                <svg
                  className="flex-shrink-0 h-5 w-5 text-gray-300 rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.707 5.293a1 1 0 011.414 1.414L7.414 10l2.707 2.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3z"
                  />
                </svg>
              )}
              <Link
                to={item.path}
                className={`text-sm font-medium ${
                  index === items.length - 1
                    ? 'text-gray-500'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
