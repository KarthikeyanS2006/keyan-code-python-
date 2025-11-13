
import React from 'react';
import PackageIcon from './icons/PackageIcon';
import GeminiIcon from './icons/GeminiIcon';
import ThemeToggle from './ThemeToggle';
import UploadIcon from './icons/UploadIcon';
import DownloadIcon from './icons/DownloadIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface MenuBarProps {
  onRun: () => void;
  onPipManage: () => void;
  onTogglePreview: () => void;
  onExplainCode: () => void;
  onUpload: () => void;
  onDownload: () => void;
  isAIThinking: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onRun, onPipManage, onTogglePreview, onExplainCode, onUpload, onDownload, isAIThinking, theme, onToggleTheme }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-between shadow-md z-30 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 md:space-x-4">
        <span className="text-xl font-bold text-cyan-500">Keyan Python</span>
        <button onClick={onPipManage} className="flex items-center space-x-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors">
          <PackageIcon className="w-4 h-4" />
          <span className="hidden md:inline">PIP</span>
        </button>
        <button 
          onClick={onUpload}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          <UploadIcon className="w-4 h-4" />
          <span className="hidden md:inline">Upload</span>
        </button>
        <button 
          onClick={onDownload}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors"
        >
          <DownloadIcon className="w-4 h-4" />
          <span className="hidden md:inline">Download</span>
        </button>
        <button 
          onClick={onExplainCode} 
          disabled={isAIThinking}
          className="flex items-center space-x-2 px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAIThinking ? <SpinnerIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" /> : <GeminiIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />}
          <span className="hidden md:inline">{isAIThinking ? 'Thinking...' : 'Explain Code'}</span>
        </button>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button onClick={onTogglePreview} className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-md text-sm transition-colors">
          <span className="hidden md:inline">Toggle </span>Preview
        </button>
        <button onClick={onRun} className="flex items-center space-x-2 px-4 py-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:green-500 text-white rounded-md font-bold text-sm transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Run</span>
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
