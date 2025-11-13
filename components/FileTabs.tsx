
import React, { useState, useRef, useEffect } from 'react';
import type { EditorFile } from '../types';
import CloseIcon from './icons/CloseIcon';
import CodeIcon from './icons/CodeIcon';

interface FileTabsProps {
  files: EditorFile[];
  activeFileId: string | null;
  onSelectFile: (id: string) => void;
  onCloseFile: (id: string) => void;
  onAddFile: () => void;
  onRenameFile: (id: string, newName: string) => boolean;
}

const FileTabs: React.FC<FileTabsProps> = ({ files, activeFileId, onSelectFile, onCloseFile, onAddFile, onRenameFile }) => {
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameInputValue, setRenameInputValue] = useState('');
  const [renameError, setRenameError] = useState(false);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renamingFileId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingFileId]);

  const handleRenameStart = (file: EditorFile) => {
    setRenamingFileId(file.id);
    setRenameInputValue(file.name.endsWith('.py') ? file.name.slice(0, -3) : file.name);
    setRenameError(false);
  };

  const handleRenameConfirm = () => {
    if (renamingFileId && renameInputValue.trim()) {
      const success = onRenameFile(renamingFileId, renameInputValue.trim());
      if (success) {
        setRenamingFileId(null);
        setRenameError(false);
      } else {
        setRenameError(true);
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }
    } else {
      handleRenameCancel();
    }
  };
  
  const handleRenameCancel = () => {
    setRenamingFileId(null);
    setRenameError(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRenameConfirm();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <div className="flex-grow flex items-center overflow-x-auto">
        {files.map(file => (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.id)}
            onDoubleClick={() => renamingFileId !== file.id && handleRenameStart(file)}
            className={`flex items-center justify-between space-x-3 px-4 py-2 text-sm cursor-pointer border-r border-gray-200 dark:border-gray-700 whitespace-nowrap transition-colors duration-150 ${
              activeFileId === file.id
                ? 'bg-white dark:bg-gray-900 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
                <CodeIcon className="w-4 h-4" />
                {renamingFileId === file.id ? (
                    <input
                        ref={renameInputRef}
                        type="text"
                        value={renameInputValue}
                        onChange={(e) => {
                            setRenameInputValue(e.target.value);
                            if(renameError) setRenameError(false);
                        }}
                        onBlur={handleRenameConfirm}
                        onKeyDown={handleKeyDown}
                        className={`bg-white dark:bg-gray-900 outline-none rounded-sm px-1 -ml-1 w-28 text-sm font-semibold ${
                          renameError 
                            ? 'text-red-600 dark:text-red-400 ring-2 ring-red-500' 
                            : 'text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span>{file.name}</span>
                )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseFile(file.id);
              }}
              className="p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
              aria-label={`Close ${file.name}`}
            >
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAddFile}
        className="px-3 py-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border-l border-gray-200 dark:border-gray-700"
        aria-label="Add new file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
};

export default FileTabs;
