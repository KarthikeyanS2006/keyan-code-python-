import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? 
        <SunIcon className="w-5 h-5 text-yellow-300" /> : 
        <MoonIcon className="w-5 h-5 text-gray-700" />
      }
    </button>
  );
};

export default ThemeToggle;
