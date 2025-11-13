
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import GeminiIcon from './icons/GeminiIcon';
import CodeIcon from './icons/CodeIcon';
import PackageIcon from './icons/PackageIcon';
import TerminalIcon from './icons/TerminalIcon';

interface WelcomeModalProps {
  onClose: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex items-start space-x-3">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <h4 className="font-semibold text-gray-800 dark:text-white">{title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-300">{children}</p>
    </div>
  </div>
);

const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-cyan-500">Welcome to Keyan Python IDE!</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
            <CloseIcon />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <p className="text-gray-700 dark:text-gray-300">
            This is a web-based Python IDE simulator packed with features to help you write, run, and understand code. It's powered by Google's Gemini AI to provide intelligent assistance.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Feature icon={<CodeIcon className="w-6 h-6 text-cyan-500" />} title="Full-Featured Editor">
              Enjoy a multi-file editor with syntax highlighting, file management (add, rename, upload/download), and persistent sessions.
            </Feature>
            <Feature icon={<GeminiIcon className="w-6 h-6 text-purple-500" />} title="AI-Powered Assistance">
              Use the "Explain Code" button to get a detailed breakdown of your script from Gemini. More AI features are coming soon!
            </Feature>
             <Feature icon={<PackageIcon className="w-6 h-6 text-green-500" />} title="Package Management">
              Simulate installing and uninstalling Python packages with the built-in PIP manager.
            </Feature>
            <Feature icon={<TerminalIcon className="w-6 h-6 text-yellow-500" />} title="Realistic Console & Preview">
              Run your code and see the output in a realistic console. Toggle the floating preview for web framework simulations.
            </Feature>
          </div>
        </div>
        <div className="p-4 bg-gray-200 dark:bg-gray-900 text-right rounded-b-lg">
          <button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-6 py-2 font-semibold transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
