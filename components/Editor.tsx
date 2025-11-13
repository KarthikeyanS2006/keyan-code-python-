
import React, { useState, useRef, useEffect } from 'react';
import SyntaxHighlighter from './SyntaxHighlighter';

interface EditorProps {
  code: string;
  setCode: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({ code, setCode }) => {
  const [lineCount, setLineCount] = useState(code.split('\n').length);
  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLineCount(Math.max(1, code.split('\n').length));
  }, [code]);

  const syncScroll = () => {
    if (lineCounterRef.current && textAreaRef.current && highlighterRef.current) {
      lineCounterRef.current.scrollTop = textAreaRef.current.scrollTop;
      highlighterRef.current.scrollTop = textAreaRef.current.scrollTop;
      highlighterRef.current.scrollLeft = textAreaRef.current.scrollLeft;
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };
  
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

  return (
    <div className="flex-1 flex bg-gray-50 dark:bg-gray-800 overflow-hidden h-full relative">
      <div 
        ref={lineCounterRef}
        className="text-right p-3 bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500 font-mono text-sm select-none z-10"
      >
        <pre>{lineNumbers}</pre>
      </div>
      <div className="relative flex-1 h-full">
         <div 
            ref={highlighterRef}
            className="absolute inset-0 overflow-auto pointer-events-none"
            aria-hidden="true"
          >
            <SyntaxHighlighter code={code} />
        </div>
        <textarea
          ref={textAreaRef}
          value={code}
          onChange={handleCodeChange}
          onScroll={syncScroll}
          className="absolute inset-0 p-3 font-mono text-sm outline-none resize-none bg-transparent caret-gray-800 dark:caret-gray-200 text-transparent"
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
};

export default Editor;
