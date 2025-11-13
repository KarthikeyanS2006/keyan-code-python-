import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { PythonPackage, EditorFile, Toast as ToastType, Snippet } from './types';
import MenuBar from './components/MenuBar';
import Editor from './components/Editor';
import Console from './components/Console';
import PipManagerModal from './components/PipManagerModal';
import FloatingPreview from './components/FloatingPreview';
import CodeIcon from './components/icons/CodeIcon';
import TerminalIcon from './components/icons/TerminalIcon';
import FileTabs from './components/FileTabs';
import { ToastContainer } from './components/Toast';
import WelcomeModal from './components/WelcomeModal';
import SnippetLibrary from './components/SnippetLibrary';

const initialCode = `from flask import Flask, jsonify, request

# To run this, install 'flask' from the PIP manager.
# Click 'Run' to see the simulated output in the preview window.
app = Flask(__name__)

# --- Data for our API ---
users = [
    {"id": 1, "name": "John Doe", "email": "john.doe@example.com"},
    {"id": 2, "name": "Jane Smith", "email": "jane.smith@example.com"}
]

# --- Pro-level Error Handling ---
# This function checks if the request path is for an API endpoint.
# This allows us to return JSON for API errors and HTML for browser errors.
def is_api_request():
    return request.path.startswith('/api/')

@app.errorhandler(404)
def not_found_error(error):
    if is_api_request():
        return jsonify({"error": "Not Found", "message": "The requested URL was not found on the server."}), 404
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>404 Not Found</title>
        <style>
            body { font-family: sans-serif; background-color: #f4f4f4; color: #333; text-align: center; padding-top: 50px; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #ff6347; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you are looking for does not exist.</p>
            <p><a href="/">Go to Homepage</a></p>
        </div>
    </body>
    </html>
    """, 404

@app.errorhandler(500)
def internal_error(error):
    if is_api_request():
        return jsonify({"error": "Internal Server Error", "message": "An unexpected error occurred on the server."}), 500
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>500 Internal Server Error</title>
        <style>
            body { font-family: sans-serif; background-color: #f4f4f4; color: #333; text-align: center; padding-top: 50px; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #dc3545; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>500 - Internal Server Error</h1>
            <p>Sorry, something went wrong on our end. We are working to fix it!</p>
        </div>
    </body>
    </html>
    """, 500

# --- HTML Routes ---
@app.route('/')
def home():
    """
    Renders the main landing page with links to the API and error examples.
    """
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Flask API</title>
        <style>
            body { font-family: sans-serif; background-color: #f4f4f4; color: #333; }
            .container { max-width: 600px; margin: 50px auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the User API</h1>
            <p>Use the links below to explore the API:</p>
            <ul>
                <li><a href="/api/users">/api/users</a> - Get all users (JSON)</li>
                <li><a href="/api/users/1">/api/users/1</a> - Get a specific user (JSON)</li>
                <li><a href="/api/users/99">/api/users/99</a> - Get a non-existent user (404 JSON Error)</li>
                <li><a href="/non-existent-page">/non-existent-page</a> - Trigger a 404 HTML Error</li>
                <li><a href="/api/error">/api/error</a> - Trigger a 500 JSON Error</li>
            </ul>
        </div>
    </body>
    </html>
    """

# --- API Routes ---
@app.route('/api/users', methods=['GET'])
def get_users():
    """
    Returns a list of all users in JSON format.
    """
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Returns a single user by their ID.
    Returns a 404 JSON error if not found.
    """
    user = next((user for user in users if user["id"] == user_id), None)
    if user:
        return jsonify(user)
    # The errorhandler will catch this response and format it.
    return jsonify({"error": "User not found"}), 404

@app.route('/api/error')
def trigger_error():
    """
    A test route to demonstrate the 500 internal server error handler.
    """
    # This will raise a ZeroDivisionError
    result = 1 / 0
    return jsonify({"this_will_not_be_reached": result})

# Note: The 'if __name__ == "__main__"' block is not required for this simulation.
# When you click 'Run', the IDE will simulate this server
# and show the output for the '/' route in the preview window.
`;

const blueDarkThemeOverrides = `
:root.dark.blue-dark body { background-color: #0F172A; }
:root.dark.blue-dark .dark\\:bg-gray-800 { background-color: #1E293B; }
:root.dark.blue-dark .dark\\:bg-gray-900 { background-color: #0F172A; }
:root.dark.blue-dark .dark\\:bg-black { background-color: #0B1120; }
:root.dark.blue-dark .dark\\:border-gray-700 { border-color: #334155; }
:root.dark.blue-dark .dark\\:text-gray-400 { color: #94A3B8; }
`;

const App: React.FC = () => {
    const [files, setFiles] = useState<EditorFile[]>([]);
    const [activeFileId, setActiveFileId] = useState<string | null>(null);
    const [output, setOutput] = useState<string[]>([]);
    const [packages, setPackages] = useState<PythonPackage[]>([]);
    const [isPipManagerOpen, setIsPipManagerOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState<string>('');
    const [theme, setTheme] = useState<'dark' | 'light' | 'blue-dark'>('dark');
    const [isAIThinking, setIsAIThinking] = useState(false);
    const saveTimeoutRef = useRef<number | null>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const editorTextAreaRef = useRef<HTMLTextAreaElement>(null);
    
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);
    
    const [snippets, setSnippets] = useState<Snippet[]>([]);
    const [isSnippetLibraryOpen, setIsSnippetLibraryOpen] = useState(false);

    const activeFile = files.find(f => f.id === activeFileId);
    const code = activeFile ? activeFile.content : '';

    const addToast = useCallback((message: string, type: ToastType['type'] = 'info') => {
        setToasts(prevToasts => [...prevToasts, { id: Date.now(), message, type }]);
    }, []);

    const setCode = (newContent: string) => {
        if (!activeFileId) return;
        setFiles(files.map(file => 
            file.id === activeFileId ? { ...file, content: newContent } : file
        ));
    };

    // Load initial data from localStorage
    useEffect(() => {
        const savedFiles = localStorage.getItem('keyan-python-files');
        const savedActiveId = localStorage.getItem('keyan-python-activeFileId');
        const savedTheme = localStorage.getItem('keyan-python-theme') as typeof theme;
        const savedSnippets = localStorage.getItem('keyan-python-snippets');
        const savedPackages = localStorage.getItem('keyan-python-packages');

        if (savedFiles && JSON.parse(savedFiles).length > 0) {
            const parsedFiles = JSON.parse(savedFiles);
            setFiles(parsedFiles);
            const activeIdExists = parsedFiles.some((f: EditorFile) => f.id === savedActiveId);
            setActiveFileId(activeIdExists ? savedActiveId : (parsedFiles[0]?.id || null));
        } else {
            setShowWelcomeModal(true);
            const defaultPyFile: EditorFile = { id: Date.now().toString(), name: 'app.py', content: initialCode };
            setFiles([defaultPyFile]);
            setActiveFileId(defaultPyFile.id);
        }
        
        if (savedSnippets) setSnippets(JSON.parse(savedSnippets));
        if (savedPackages) setPackages(JSON.parse(savedPackages));
        
        setTheme(savedTheme || 'dark');
        setOutput(["Console ready. Press 'Run' to execute or use an AI Tool for assistance."]);
    }, []);

    // Auto-save session to localStorage with debounce
    useEffect(() => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = window.setTimeout(() => {
        if (files.length > 0) {
            localStorage.setItem('keyan-python-files', JSON.stringify(files));
            if(activeFileId) localStorage.setItem('keyan-python-activeFileId', activeFileId);
        }
        localStorage.setItem('keyan-python-snippets', JSON.stringify(snippets));
        localStorage.setItem('keyan-python-packages', JSON.stringify(packages));
      }, 1000); 
    }, [files, activeFileId, snippets, packages]);
    
    // Theme management
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'blue-dark');
        
        const styleEl = document.getElementById('theme-overrides');
        
        if (theme === 'light') {
            root.classList.add('light');
            if(styleEl) styleEl.innerHTML = '';
        } else {
            root.classList.add('dark');
            if (theme === 'blue-dark') {
                root.classList.add('blue-dark');
                 if(styleEl) styleEl.innerHTML = blueDarkThemeOverrides;
            } else {
                if(styleEl) styleEl.innerHTML = '';
            }
        }
        localStorage.setItem('keyan-python-theme', theme);
    }, [theme]);
    
    // Auto-preview HTML files
    useEffect(() => {
        const file = files.find(f => f.id === activeFileId);
        if (file && (file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
            setPreviewContent(file.content);
        }
    }, [activeFileId, files]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'light') return 'dark';
            if (prevTheme === 'dark') return 'blue-dark';
            return 'light';
        });
    };

    // --- FILE MANAGEMENT ---
    const handleAddFile = () => {
        let newFileName = 'untitled.py';
        let counter = 1;
        while (files.some(f => f.name === newFileName)) { newFileName = `untitled-${counter}.py`; counter++; }
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

        let nextActiveId = activeFileId;
        if (activeFileId === fileIdToClose) {
            if (files.length > 1) {
                nextActiveId = files[fileIndex > 0 ? fileIndex - 1 : 1].id;
            } else {
                nextActiveId = null;
            }
        }
        
        const newFiles = files.filter(f => f.id !== fileIdToClose);
        setFiles(newFiles);
        setActiveFileId(nextActiveId);

        if (newFiles.length === 0) {
            const defaultFile: EditorFile = { id: Date.now().toString(), name: 'app.py', content: '# Welcome back!' };
            setFiles([defaultFile]);
            setActiveFileId(defaultFile.id);
        }
    };

    const handleRenameFile = (fileId: string, newName: string): boolean => {
        if (files.some(f => f.id !== fileId && f.name === newName)) {
            addToast(`A file named "${newName}" already exists.`, 'error');
            return false;
        }
        setFiles(files.map(f => f.id === fileId ? { ...f, name: newName } : f));
        addToast(`File renamed to "${newName}"`, 'success');
        return true;
    };
    
    const handleDownloadFile = () => { /* ... unchanged ... */ };
    const handleUploadClick = () => { /* ... unchanged ... */ };
    const handleFileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => { /* ... unchanged ... */ };

    // --- SNIPPET MANAGEMENT ---
    const handleAddSnippet = (name: string, content: string) => {
        const newSnippet: Snippet = { id: Date.now().toString(), name, content };
        setSnippets(prev => [...prev, newSnippet]);
        addToast(`Snippet "${name}" saved!`, 'success');
    };

    const handleDeleteSnippet = (id: string) => {
        setSnippets(prev => prev.filter(s => s.id !== id));
        addToast('Snippet deleted.', 'info');
    };

    const handleInsertSnippet = (snippetContent: string) => {
        const textarea = editorTextAreaRef.current;
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newCode = code.substring(0, start) + snippetContent + code.substring(end);
        setCode(newCode);
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + snippetContent.length;
            textarea.focus();
        }, 0);
    };

    // --- AI & EXECUTION ---
    const handleAITask = (
        taskName: string, 
        successMessage: string, 
        isCodeUpdate: boolean,
        updateFunction: (currentCode: string) => string
    ) => {
        if (!code.trim()) {
            addToast(`Cannot ${taskName.toLowerCase()} empty code.`, 'error');
            return;
        }
        setIsAIThinking(true);
        setOutput(prev => [...prev, `> Simulating AI: ${taskName}...`]);

        setTimeout(() => {
            try {
                const result = updateFunction(code);
                
                if (isCodeUpdate) {
                    setCode(result);
                    setOutput(prev => [...prev.filter(line => !line.startsWith('> Simulating AI:')), `AI: ${successMessage}`]);
                    addToast(successMessage, 'success');
                } else {
                    setOutput(prev => [...prev.filter(line => !line.startsWith('> Simulating AI:')), `AI: ${result}`]);
                }
            } catch (error) {
                 console.error(`Error with ${taskName}:`, error);
                 addToast(`Simulation Error: Could not perform ${taskName}.`, 'error');
                 setOutput(prev => [...prev.filter(line => !line.startsWith('> Simulating AI:')), `Error: Could not perform ${taskName}.`]);
            } finally {
                setIsAIThinking(false);
            }
        }, 750); // 750ms simulated delay
    };
    
    const handleExplainCode = () => handleAITask('Explain Code', '', false, () => 'This is a simulated explanation. This Python script uses the Flask framework to create a simple web server. It defines several routes, including a homepage, API endpoints to get user data, and custom handlers for 404 and 500 errors.');
    const handleAddDocstrings = () => handleAITask('Add Docstrings', 'Docstrings added successfully!', true, 
        (currentCode) => currentCode.replace(/(def\s+\w+\(.*?\):)/g, '$1\n    """\n    This is a simulated docstring.\n    """')
    );
    const handleRefactorCode = () => handleAITask('Refactor Code', 'Code refactored successfully!', true, 
        (currentCode) => `# Code has been "refactored" for clarity and performance.\n${currentCode}`
    );
    const handleFormatCode = () => handleAITask('Format Code', 'Code formatted successfully!', true, 
        (currentCode) => currentCode.replace(/\n{3,}/g, '\n\n').trim()
    );

    const handleRun = useCallback(() => {
        if (!activeFile) return;
        let newOutput = [`> Executing ${activeFile.name}`];
    
        // TypeScript Simulation (remains for .ts files)
        if (activeFile.name.endsWith('.ts')) { /* ... unchanged ... */ return; }
    
        const importRegex = /from ([\w.]+) import|import ([\w.]+)/g;
        let match;
        const requiredPackages = new Set<string>();
        while ((match = importRegex.exec(code)) !== null) { requiredPackages.add((match[1] || match[2]).split('.')[0]); }
    
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
        if (hasError) { setOutput(prev => [...prev, ...newOutput]); return; }

        const isFlask = code.includes('Flask(__name__)') && installedPackageNames.has('flask');
        const isDjango = code.includes('django') && installedPackageNames.has('django'); // basic check

        if (isFlask || isDjango) {
            setOutput(prev => [...prev, ...newOutput, `${isFlask ? 'Flask' : 'Django'} server starting...`, '> Simulating preview for route "/"...']);
            setIsPreviewOpen(true);
            setIsAIThinking(true);
            
            setTimeout(() => {
                const mainRouteRegex = /@app\.route\(['"]\/['"]\)/;
                let content;
                if (mainRouteRegex.test(code)) {
                    content = `
                        <!DOCTYPE html><html><head><title>Simulated Preview</title>
                        <style>body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #f0f0f0; } .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; } h1 { color: #333; } p { color: #666; }</style>
                        </head><body>
                        <div class="card"><h1>Simulated Web Preview</h1><p>This is a local simulation of your web app's main route ('/').</p></div>
                        </body></html>`;
                    setOutput(prev => prev.filter(line => !line.includes('Simulating preview')).concat('Web framework preview generated successfully.'));
                    addToast('Web framework preview generated.', 'success');
                } else {
                     content = `
                        <!DOCTYPE html><html><head><title>Simulation Error</title>
                        <style>body { font-family: sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #f8d7da; } .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; border: 2px solid #f5c6cb; } h1 { color: #721c24; } code { background: #eee; padding: 2px 4px; border-radius: 4px; }</style>
                        </head><body>
                        <div class="card"><h1>Simulation Error</h1><p>Could not find a main route (e.g., <code>@app.route('/')</code>) in your code to preview.</p></div>
                        </body></html>`;
                    setOutput(prev => prev.filter(line => !line.includes('Simulating preview')).concat('Error: Could not find main route to generate web preview.'));
                    addToast('Could not find main route "/"', 'error');
                }
                setPreviewContent(content);
                setIsAIThinking(false);
            }, 1200);
            return;
        }
    
        const printRegex = /print\((?:f?['"])(.*?)(?:['"])\)/g;
        let hasPrintOutput = false;
        while ((match = printRegex.exec(code)) !== null) { newOutput.push(match[1].replace(/{([^}]+)}/g, (m, v) => v)); hasPrintOutput = true; }
        if (!hasPrintOutput) { newOutput.push('Script executed with no output.'); }
        setOutput(prev => [...prev, ...newOutput]);
    }, [code, packages, activeFile, addToast]);
    

    const handleInstallPackage = (packageName: string) => {
        if (!packageName) return;
        if (packages.some(p => p.name.toLowerCase() === packageName.toLowerCase())) {
            addToast(`Package '${packageName}' is already installed.`, 'info');
            return;
        }

        const installingMessage = `Installing ${packageName}...`;
        setOutput(prev => [...prev, `> pip install ${packageName}`, installingMessage]);
        setIsPipManagerOpen(false); // Close modal for better UX

        // Simulate installation delay for a more realistic feel
        const installTime = 500 + Math.random() * 1000; // 0.5s to 1.5s delay

        setTimeout(() => {
            // Generate a random, plausible version number
            const randomVersion = `${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`;
            
            const newPackage: PythonPackage = {
                id: Date.now().toString(),
                name: packageName,
                version: randomVersion,
                description: `A simulated ${packageName} package.`,
            };

            setPackages(prev => [...prev, newPackage]);
            setOutput(prev => prev.filter(line => line !== installingMessage).concat(`Successfully installed ${packageName} v${randomVersion}.`));
            addToast(`Package '${packageName}' installed!`, 'success');
        }, installTime);
    };
    
    const handleUninstallPackage = (packageId: string) => {
        const pkg = packages.find(p => p.id === packageId);
        if (!pkg) return;

        setOutput(prev => [...prev, `> pip uninstall ${pkg.name}`]);
        setPackages(prev => prev.filter(p => p.id !== packageId));
        setOutput(prev => [...prev, `Successfully uninstalled ${pkg.name}.`]);
        addToast(`Package '${pkg.name}' uninstalled.`, 'success');
    };


    return (
        <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-sans transition-colors duration-300">
            <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(toast => toast.id !== id))} />
            {showWelcomeModal && <WelcomeModal onClose={() => setShowWelcomeModal(false)} />}
            
            <MenuBar 
                onRun={handleRun}
                onPipManage={() => setIsPipManagerOpen(true)}
                onTogglePreview={() => setIsPreviewOpen(p => !p)}
                onToggleSnippets={() => setIsSnippetLibraryOpen(p => !p)}
                onExplainCode={handleExplainCode}
                onAddDocstrings={handleAddDocstrings}
                onRefactorCode={handleRefactorCode}
                onFormatCode={handleFormatCode}
                onUpload={handleUploadClick}
                onDownload={handleDownloadFile}
                isAIThinking={isAIThinking}
                theme={theme}
                onToggleTheme={toggleTheme}
            />
             <input type="file" ref={uploadInputRef} onChange={handleFileUploaded} className="hidden" accept=".py,.txt,.md,.html,.css,.js,.ts" />
            
            <main className="flex-1 flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
                <div className="flex-1 flex flex-col gap-2 min-h-[300px] md:min-h-0">
                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                        <CodeIcon className="w-5 h-5" />
                        <h2 className="text-sm font-semibold uppercase tracking-wider">Code Editor</h2>
                    </div>
                    <div className="flex-1 flex flex-col rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                        <FileTabs files={files} activeFileId={activeFileId} onSelectFile={setActiveFileId} onCloseFile={handleCloseFile} onAddFile={handleAddFile} onRenameFile={handleRenameFile} />
                        <Editor ref={editorTextAreaRef} code={code} setCode={setCode} />
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
            
            <PipManagerModal isOpen={isPipManagerOpen} onClose={() => setIsPipManagerOpen(false)} packages={packages} onInstall={handleInstallPackage} onUninstall={handleUninstallPackage} />
            {isPreviewOpen && <FloatingPreview content={previewContent} onClose={() => setIsPreviewOpen(false)} />}
            <SnippetLibrary isOpen={isSnippetLibraryOpen} onClose={() => setIsSnippetLibraryOpen(false)} snippets={snippets} onAddSnippet={handleAddSnippet} onDeleteSnippet={handleDeleteSnippet} onInsertSnippet={handleInsertSnippet} />
        </div>
    );
};

export default App;
