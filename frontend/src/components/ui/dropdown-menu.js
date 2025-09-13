import React, { useState, useRef, useEffect } from 'react';

// Wrapper for the dropdown
const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
    >
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

// Trigger button
const DropdownMenuTrigger = ({ children, asChild, isOpen, setIsOpen }) => {
  return (
    <div
      className={asChild ? undefined : 'cursor-pointer'}
      onClick={() => setIsOpen(!isOpen)}  // only toggle on click
    >
      {children}
    </div>
  );
};

// Dropdown content
const DropdownMenuContent = ({ children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute mt-2 right-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
      {children}
    </div>
  );
};

// Dropdown item
const DropdownMenuItem = ({ children, asChild, onClick }) => {
  return (
    <div 
      className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 first:rounded-t-md last:rounded-b-md"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };
