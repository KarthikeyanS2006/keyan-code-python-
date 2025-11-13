import React, { useState } from 'react';
import type { PythonPackage } from '../types';
import CloseIcon from './icons/CloseIcon';
import PackageIcon from './icons/PackageIcon';

interface PipManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: PythonPackage[];
  onInstall: (packageName: string) => void;
  onUninstall: (packageId: string) => void;
}

const PipManagerModal: React.FC<PipManagerModalProps> = ({ isOpen, onClose, packages, onInstall, onUninstall }) => {
  const [newPackageName, setNewPackageName] = useState('');

  if (!isOpen) return null;

  const handleInstall = () => {
    if (newPackageName.trim()) {
      onInstall(newPackageName.trim());
      setNewPackageName('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInstall();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <PackageIcon className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl font-bold">PIP Package Manager</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <CloseIcon />
          </button>
        </div>

        <div className="p-4 flex-grow overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Install New Package</h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newPackageName}
                onChange={(e) => setNewPackageName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., requests"
                className="flex-grow bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button onClick={handleInstall} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-4 py-2 font-semibold transition-colors">
                Install
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Installed Packages</h3>
            <div className="space-y-2">
              {packages.length > 0 ? packages.map(pkg => (
                <div key={pkg.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md flex items-center justify-between">
                  <div>
                    <p className="font-bold">{pkg.name} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">v{pkg.version}</span></p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{pkg.description}</p>
                  </div>
                  <button onClick={() => onUninstall(pkg.id)} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white rounded-md px-3 py-1 text-sm font-semibold transition-colors">
                    Uninstall
                  </button>
                </div>
              )) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No packages installed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipManagerModal;
