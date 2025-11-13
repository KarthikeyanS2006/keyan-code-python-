
export interface PythonPackage {
  id: string;
  name: string;
  version: string;
  description: string;
}

export interface EditorFile {
  id: string;
  name: string;
  content: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
