import React, { useState } from 'react';
import type { Snippet } from '../types';
import CloseIcon from './icons/CloseIcon';
import SnippetIcon from './icons/SnippetIcon';

interface SnippetLibraryProps {
    isOpen: boolean;
    onClose: () => void;
    snippets: Snippet[];
    onAddSnippet: (name: string, content: string) => void;
    onDeleteSnippet: (id: string) => void;
    onInsertSnippet: (content: string) => void;
}

const SnippetLibrary: React.FC<SnippetLibraryProps> = ({ isOpen, onClose, snippets, onAddSnippet, onDeleteSnippet, onInsertSnippet }) => {
    const [newSnippetName, setNewSnippetName] = useState('');
    const [newSnippetContent, setNewSnippetContent] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen) return null;

    const handleAdd = () => {
        if (newSnippetName.trim() && newSnippetContent.trim()) {
            onAddSnippet(newSnippetName.trim(), newSnippetContent.trim());
            setNewSnippetName('');
            setNewSnippetContent('');
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-y-0 right-0 bg-gray-100 dark:bg-gray-800 shadow-xl w-full max-w-sm flex flex-col border-l border-gray-300 dark:border-gray-700 z-40 transform transition-transform duration-300 ease-in-out" style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-900">
                <div className="flex items-center space-x-2">
                    <SnippetIcon className="w-6 h-6 text-cyan-500" />
                    <h2 className="text-xl font-bold">Code Snippets</h2>
                </div>
                <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon />
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {isAdding ? (
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md space-y-2">
                        <input
                            type="text"
                            value={newSnippetName}
                            onChange={(e) => setNewSnippetName(e.target.value)}
                            placeholder="Snippet Name (e.g., 'flask_route')"
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <textarea
                            value={newSnippetContent}
                            onChange={(e) => setNewSnippetContent(e.target.value)}
                            placeholder="Snippet Code..."
                            rows={4}
                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-500 resize-y"
                        />
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsAdding(false)} className="bg-gray-400 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500 text-white rounded-md px-3 py-1 text-sm font-semibold transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-3 py-1 text-sm font-semibold transition-colors">
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsAdding(true)} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-md px-4 py-2 font-semibold transition-colors text-sm">
                        Add New Snippet
                    </button>
                )}

                <div className="space-y-2">
                    {snippets.length > 0 ? snippets.map(snippet => (
                        <div key={snippet.id} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md">
                            <div className="flex items-center justify-between mb-2">
                                <p className="font-bold font-mono text-sm text-cyan-700 dark:text-cyan-400">{snippet.name}</p>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => onInsertSnippet(snippet.content)} className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white rounded-md px-3 py-1 text-xs font-semibold transition-colors">
                                        Insert
                                    </button>
                                     <button onClick={() => onDeleteSnippet(snippet.id)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                            <pre className="bg-white dark:bg-gray-800 p-2 rounded text-xs font-mono whitespace-pre-wrap overflow-x-auto"><code>{snippet.content}</code></pre>
                        </div>
                    )) : (
                        !isAdding && <p className="text-gray-500 dark:text-gray-400 text-center text-sm py-4">No snippets saved.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SnippetLibrary;