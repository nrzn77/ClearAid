import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div
      className="relative w-16 h-8 flex items-center dark:bg-gray-700 bg-gray-300 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
      onClick={toggleTheme}
    >
      <div
        className={`absolute w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
          ${theme === 'dark' ? 'translate-x-8' : 'translate-x-0'}`}
      >
        {theme === 'dark' ? (
          <Moon className="h-full w-full p-1 text-gray-700" />
        ) : (
          <Sun className="h-full w-full p-1 text-yellow-500" />
        )}
      </div>
    </div>
  );
}