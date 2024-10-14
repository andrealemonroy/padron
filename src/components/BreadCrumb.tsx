import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';
import { HiPlusCircle } from 'react-icons/hi';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface IButtonItem {
  text: string;
  action: () => void;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  children?: React.ReactNode;
  buttons?: IButtonItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  children,
  buttons,
}) => {
  return (
    <nav
      className="flex justify-between bg-white w-full px-4 py-2 rounded-md h-14 mb-4"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
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
      {children}
      {buttons && (
        <div className="flex space-x-4">
          {buttons.map((button) => (
            <Button
              key={button.text}
              type="button"
              className="w-fit h-10 btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white rounded-md flex gap-1 items-center"
              onClick={button.action}
            >
              {button.icon ?? <HiPlusCircle size={20} />}
              <span className="max-xs:sr-only">{button.text}</span>
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Breadcrumb;
