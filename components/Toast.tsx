
import React, { useEffect, useState } from 'react';
import type { Toast as ToastType } from '../types';
import CloseIcon from './icons/CloseIcon';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);
  
  const baseClasses = "flex items-center justify-between w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800 ring-1 ring-black ring-opacity-5";
  const typeClasses = {
    success: 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200',
    error: 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200',
    info: 'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200',
  };

  const Icon = ({ type }: { type: ToastType['type'] }) => {
    switch (type) {
      case 'success':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>;
      case 'error':
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>;
      default:
        return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>;
    }
  };

  return (
    <div className={baseClasses} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${typeClasses[toast.type]} rounded-lg`}>
        <Icon type={toast.type} />
      </div>
      <div className="ml-3 text-sm font-normal">{toast.message}</div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" 
        aria-label="Close"
        onClick={() => onDismiss(toast.id)}
      >
        <CloseIcon className="w-5 h-5"/>
      </button>
    </div>
  );
};


interface ToastContainerProps {
  toasts: ToastType[];
  onDismiss: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};
