
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { PythonPackage, EditorFile, Toast as ToastType } from './types';
import MenuBar from './components/MenuBar';
import Editor from './components/Editor';
import Console from './components/Console';
import PipManagerModal from './components/PipManagerModal';
import FloatingPreview from './components/FloatingPreview';
import CodeIcon from './components/icons/CodeIcon';
import TerminalIcon from './components/icons/TerminalIcon';
import FileTabs from './components/FileTabs';
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from './system-instruction';
import { ToastContainer } from './components/Toast';
import WelcomeModal from './components/WelcomeModal';

const initialCode = `import numpy as np

def main():
    """
    A simple python script example.
    This function creates a numpy array and prints it.
    """
    my_array = np.array([1, 2, 3, 4, 5])
    print("Hello from Keyan Python IDE!")
    print("Your numpy array is created.")
    # Try running a web framework! (Install 'flask' first)
    # from flask import Flask
    # app = Flask(__name__)
    # @app.route('/')
    # def hello_world():
    #   return 'Hello, World!'

if __name__ == "__main__":
    main()
`;

const App: React.FC = () => {
    const [files, setFiles] = useState<EditorFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [output, setOutput] = useState<string[]>([]);
    const [packages, setPackages] = useState<PythonPackage[]>([
      { id: '1', name: 'numpy', version: '1.21.0', description: 'The fundamental package for scientific computing with Python.' },
    ]);
    const [isPipManagerOpen, setIsPipManagerOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isAIThinking, setIsAIThinking] = useState(false);
    const saveTimeoutRef = useRef<number | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    
    // Production-ready state
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const activeFile = files.find(f => f.id === activeFileId);
    const code = activeFile ? activeFile.content : '';

    const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
        setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
    }, []);

    const dismissToast = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    const setCode = (newContent: string) => {
        if (!activeFileId) return;
        setFiles(files.map(file => 
            file.id === activeFileId ? { ...file, content: newContent } : file
        ));
    };

    // Load session from localStorage on initial render
    useEffect(() => {
        const savedFiles = localStorage.getItem('keyan-python-files');
        const savedActiveId = localStorage.getItem('keyan-python-activeFileId');
        const savedTheme = localStorage.getItem('keyan-python-theme') as 'light' | 'dark';

        if (savedFiles) {
            const parsedFiles = JSON.parse(savedFiles);
            setFiles(parsedFiles);
            setActiveFileId(savedActiveId || (parsedFiles[0] ? parsedFiles[0].id : null));
        } else {
            // First time user
            setShowWelcomeModal(true);
            const defaultFile: EditorFile = { id: Date.now().toString(), name: 'main.py', content: initialCode };
            setFiles([defaultFile]);
            setActiveFileId(defaultFile.id);
        }
        
        setTheme(savedTheme || 'dark');
        setOutput(["Console ready. Press 'Run' to execute or 'Explain Code' for an AI analysis."]);
    }, []);

    // Save session to localStorage with debounce
    useEffect(() => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = window.setTimeout(() => {
        if (files.length > 0) {
            localStorage.setItem('keyan-python-files', JSON.stringify(files));
            if(activeFileId) localStorage.setItem('keyan-python-activeFileId', activeFileId);
        }
      }, 500);
    }, [files, activeFileId]);
    
    // Handle theme changes
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        localStorage.setItem('keyan-python-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const handleAddFile = () => {
        let newFileName = 'untitled.py';
        let counter = 1;
        while (files.some(f => f.name === newFileName)) {
            newFileName = `untitled-${counter}.py`;
            counter++;
        }
        const newFile: EditorFile = {
            id: Date.now().toString(),
            name: newFileName,
            content: `# ${newFileName}\n\nprint("Hello from ${newFileName}!")`
        };
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
        addToast(`Created file: ${newFile.name}`, 'success');
    };

    const handleCloseFile = (fileIdToClose: string) => {
        const fileIndex = files.findIndex(f => f.id === fileIdToClose);
        if (fileIndex === -1) return;

        if (activeFileId === fileIdToClose) {
            if (files.length > 1) {
                const nextActiveIndex = fileIndex === 0 ? 0 : fileIndex - 1;
                setActiveFileId(files[nextActiveIndex].id);
            } else {
                setActiveFileId(null);
            }
        }
        
        const newFiles = files.filter(f => f.id !== fileIdToClose);
        setFiles(newFiles);

        if (newFiles.length === 0) {
            const defaultFile: EditorFile = { id: Date.now().toString(), name: 'main.py', content: initialCode };
            setFiles([defaultFile]);
            setActiveFileId(defaultFile.id);
        }
    };

    const handleRenameFile = (fileId: string, newName: string): boolean => {
        const finalName = newName.endsWith('.py') ? newName : `${newName}.py`;
        
        const originalFile = files.find(f => f.id === fileId);

        // If name is unchanged, do nothing, return success.
        if (originalFile && originalFile.name === finalName) {
            return true;
        }

        const isDuplicate = files.some(file => file.id !== fileId && file.name === finalName);
        if (isDuplicate) {
            addToast(`A file named "${finalName}" already exists.`, 'error');
            return false;
        }

        setFiles(files.map(file =>
            file.id === fileId ? { ...file, name: finalName } : file
        ));
        addToast(`File renamed to "${finalName}"`, 'success');
        return true;
    };

    const handleDownloadFile = () => {
        if (!activeFile) return;
        const blob = new Blob([activeFile.content], { type: 'text/python;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', activeFile.name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        addToast(`Downloaded ${activeFile.name}`, 'success');
    };

    const handleUploadClick = () => {
        uploadInputRef.current?.click();
    };

    const handleFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            const existingFile = files.find(f => f.name === file.name);
            if (existingFile) {
                setFiles(files.map(f => f.id === existingFile.id ? {...f, content} : f));
                setActiveFileId(existingFile.id);
            } else {
                const newFile: EditorFile = { id: Date.now().toString(), name: file.name, content };
                setFiles(prev => [...prev, newFile]);
                setActiveFileId(newFile.id);
            }
            addToast(`Uploaded ${file.name}`, 'success');
        };
        reader.readAsText(file);
        event.target.value = '';
    };
    
    const handleExplainCode = async () => {
        if (!code.trim()) {
            setOutput(prev => [...prev, 'Error: Cannot explain empty code.']);
            addToast('Cannot explain empty code.', 'error');
            return;
        }

        setIsAIThinking(true);
        setOutput(prev => [...prev, '> AI is thinking...']);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Here is the Python code from file '${activeFile?.name || 'current file'}' I need explained:\n\n\`\`\`python\n${code}\n\`\`\``,
                config: {
                    systemInstruction: SYSTEM_INSTRUCTION,
                }
            });
            
            setOutput(prev => {
                const newOutput = prev.filter(line => line !== '> AI is thinking...');
                return [...newOutput, `AI: ${response.text}`];
            });
            
        } catch(error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addToast(`AI Error: ${errorMessage}`, 'error');
            setOutput(prev => {
                const newOutput = prev.filter(line => line !== '> AI is thinking...');
                return [...newOutput, 'Error: Could not get explanation from AI. Please check the console for details.'];
            });
        } finally {
            setIsAIThinking(false);
        }
    };

    const checkSyntax = (codeToCheck: string): string | null => {
        const brackets: { [key: string]: string } = { '(': ')', '[': ']', '{': '}' };
        const stack: string[] = [];
        for (const char of codeToCheck) {
            if (brackets[char]) {
                stack.push(char);
            } else if (Object.values(brackets).includes(char)) {
                if (brackets[stack[stack.length - 1]] === char) {
                    stack.pop();
                } else {
                    return `SyntaxError: Mismatched closing bracket '${char}'`;
                }
            }
        }
        if (stack.length > 0) {
            return `SyntaxError: Unclosed bracket '${stack[stack.length - 1]}'`;
        }
        return null;
    };

    const handleRun = useCallback(() => {
        if (!activeFile) return;
        const newOutput = [`> python ${activeFile.name}`];

        const syntaxError = checkSyntax(code);
        if (syntaxError) {
            newOutput.push(`Error: ${syntaxError}`);
            setOutput(prev => [...prev, ...newOutput]);
            addToast(syntaxError, 'error');
            return;
        }
        
        const importRegex = /from ([\w.]+) import|import ([\w.]+)/g;
        let match;
        const requiredPackages = new Set<string>();
        while ((match = importRegex.exec(code)) !== null) {
            const pkg = match[1] || match[2];
            if (pkg) requiredPackages.add(pkg.split('.')[0]);
        }

        const installedPackageNames = new Set(packages.map(p => p.name));
        let hasError = false;
        for (const pkg of requiredPackages) {
            if (!installedPackageNames.has(pkg)) {
                 const errorMsg = `ModuleNotFoundError: No module named '${pkg}'`;
                 newOutput.push(`Error: ${errorMsg}`);
                 addToast(errorMsg, 'error');
                 hasError = true;
            }
        }

        if (hasError) {
            setOutput(prev => [...prev, ...newOutput]);
            return;
        }

        const printRegex = /print\((['"])(.*?)\1\)/g;
        let hasPrintOutput = false;
        while ((match = printRegex.exec(code)) !== null) {
            newOutput.push(match[2]);
            hasPrintOutput = true;
        }
        
        if (code.includes('np.array')) {
             newOutput.push('...numpy code executed successfully...');
        }

        if (requiredPackages.has('flask') && code.includes('Flask(__name__)')) {
            newOutput.push('Flask server running. Open the preview window to see output.');
            setIsPreviewOpen(true);
        }
        
        if (!hasPrintOutput && !hasError) {
            newOutput.push('Script executed with no output.');
        }

        setOutput(prev => [...prev, ...newOutput]);
    }, [code, packages, activeFile, addToast]);

    const handleInstallPackage = async (packageName: string) => {
        setIsPipManagerOpen(false);
        setOutput(prev => [...prev, `> pip install ${packageName}`, `Collecting ${packageName}...`]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
             const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Provide a realistic, one-sentence description and a fictional version number for a Python package named "${packageName}".`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            version: { type: Type.STRING },
                            description: { type: Type.STRING },
                        },
                        required: ['version', 'description'],
                    },
                },
            });
            
            const packageInfo = JSON.parse(response.text);

            const newPackage: PythonPackage = {
                id: new Date().toISOString(),
                name: packageName,
                version: packageInfo.version,
                description: packageInfo.description,
            };
            setPackages(prev => [...prev, newPackage]);
            setOutput(prev => [...prev, `Successfully installed ${packageName}-${newPackage.version}`]);
            addToast(`Installed ${packageName}`, 'success');

        } catch(error) {
             console.error("Error fetching package info from Gemini API:", error);
             addToast(`Could not find package info for ${packageName}.`, 'error');
             setOutput(prev => [...prev, `Error: Could not find a version for ${packageName}. Using fallback.`]);
             const newPackage: PythonPackage = {
                id: new Date().toISOString(),
                name: packageName,
                version: `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
                description: `A simulated package for ${packageName}.`,
            };
            setPackages(prev => [...prev, newPackage]);
            setOutput(prev => [...prev, `Successfully installed ${packageName}-${newPackage.version}`]);
        }
    };

    const handleUninstallPackage = (packageId: string) => {
        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return;
        
        setOutput(prev => [...prev, `> pip uninstall ${pkg.name}`]);
        setTimeout(() => {
            setPackages(prev => prev.filter(p => p.id !== packageId));
            setOutput(prev => [...prev, `Successfully uninstalled ${pkg.name}`]);
            addToast(`Uninstalled ${pkg.name}`, 'info');
        }, 1000);
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-sans transition-colors duration-300">
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
            {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
            
            <MenuBar 
                onRun={handleRun}
                onPipManage={() => setIsPipManagerOpen(true)}
                onTogglePreview={() => setIsPreviewOpen(p => !p)}
                onExplainCode={handleExplainCode}
                onUpload={handleUploadClick}
                onDownload={handleDownloadFile}
                isAIThinking={isAIThinking}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
             <input
                type="file"
                ref={uploadInputRef}
                onChange={handleFileUploaded}
                className="hidden"
                accept=".py,.txt,.md"
            />
            <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                <div className="flex-1 flex flex-col gap-2 min-h-[300px] md:min-h-0">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <CodeIcon className="w-5 h-5" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider">Code Editor</h2>
                    </div>
                    <div className="flex-1 flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <FileTabs
                            files={files}
                            activeFileId={activeFileId}
                            onSelectFile={setActiveFileId}
                            onCloseFile={handleCloseFile}
                            onAddFile={handleAddFile}
                            onRenameFile={handleRenameFile}
                        />
                        <Editor code={code} setCode={setCode} />
                    </div>
                </div>
                <div className="flex-1 flex flex-col gap-2 min-h-[200px] md:min-h-0">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <TerminalIcon className="w-5 h-5" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider">Console</h2>
                    </div>
                    <Console output={output} />
                </div>
            </main>
            <PipManagerModal
                isOpen={isPipManagerOpen}
                onClose={() => setIsPipManagerOpen(false)}
                packages={packages}
                onInstall={handleInstallPackage}
                onUninstall={handleUninstallPackage}
            />
            {isPreviewOpen && <FloatingPreview onClose={() => setIsPreviewOpen(false)} />}
        </div>
    );
};

export default App;