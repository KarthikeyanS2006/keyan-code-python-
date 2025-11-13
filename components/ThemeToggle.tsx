import React from 'react';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface ThemeToggleProps {
  theme: 'dark' | 'light' | 'blue-dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
    
  const renderIcon = () => {
    // Show sun icon to switch TO light mode
    if (theme === 'dark' || theme === 'blue-dark') {
      return <SunIcon className="w-5 h-5 text-yellow-300" />;
    }
    // Show moon icon to switch TO dark mode
    if (theme === 'light') {
       return <MoonIcon className="w-5 h-5 text-gray-700" />;
    }
    return null;
  };

  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label="Toggle theme"
    >
      {renderIcon()}
    </button>
  );
};

export default ThemeToggle;