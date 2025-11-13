
import React, { useState, useRef, useEffect, useCallback } from 'react';
import CloseIcon from './icons/CloseIcon';
import DesktopIcon from './icons/DesktopIcon';
import TabletIcon from './icons/TabletIcon';
import MobileIcon from './icons/MobileIcon';

interface FloatingPreviewProps {
  content: string;
  onClose: () => void;
}

type Viewport = 'desktop' | 'tablet' | 'mobile' | 'custom';

const FloatingPreview: React.FC<FloatingPreviewProps> = ({ content, onClose }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [size, setSize] = useState({ w: 450, h: 350 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [viewport, setViewport] = useState<Viewport>('custom');

  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Update history when new content arrives
  useEffect(() => {
    // Only add to history if the new content is different from the current one
    if (content !== history[currentIndex]) {
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push(content);
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);
      setViewport('desktop'); // Default to desktop view on new content
    }
  }, [content]);
  
  useEffect(() => {
    if (viewport === 'custom') return;

    const PRESETS = {
        mobile: { w: 375, h: 667 },
        tablet: { w: 768, h: 600 },
        desktop: { w: 1024, h: 768 },
    };
    const newSize = PRESETS[viewport];

    const constrainedW = Math.min(newSize.w, window.innerWidth - 40);
    const constrainedH = Math.min(newSize.h, window.innerHeight - 40);

    setSize({w: constrainedW, h: constrainedH});

    setPosition(prevPos => ({
        x: Math.max(20, Math.min(prevPos.x, window.innerWidth - constrainedW - 20)),
        y: Math.max(20, Math.min(prevPos.y, window.innerHeight - constrainedH - 20)),
    }));
  }, [viewport]);


  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  const handleBack = () => {
    if (canGoBack) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleForward = () => {
    if (canGoForward) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setIsDragging(true);
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
    if (isResizing) {
        setViewport('custom');
        setSize(prevSize => ({
            w: Math.max(300, e.clientX - position.x), // Min width
            h: Math.max(200, e.clientY - position.y), // Min height
        }));
    }
  }, [isDragging, isResizing, position.x, position.y]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);


  return (
    <div
      ref={panelRef}
      className="fixed bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl flex flex-col z-40"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.w}px`,
        height: `${size.h}px`,
      }}
    >
      <div
        className="bg-gray-200 dark:bg-gray-900 p-2 flex items-center justify-between cursor-move rounded-t-lg"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center space-x-1.5">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
        </div>
        
        <div className="flex items-center space-x-1 p-0.5 bg-gray-300 dark:bg-gray-700 rounded-md">
            <button title="Mobile View (375px)" onClick={() => setViewport('mobile')} className={`p-1 rounded transition-colors ${viewport === 'mobile' ? 'bg-white dark:bg-gray-900' : 'hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
                <MobileIcon className="w-4 h-4" />
            </button>
            <button title="Tablet View (768px)" onClick={() => setViewport('tablet')} className={`p-1 rounded transition-colors ${viewport === 'tablet' ? 'bg-white dark:bg-gray-900' : 'hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
                <TabletIcon className="w-4 h-4" />
            </button>
            <button title="Desktop View (1024px)" onClick={() => setViewport('desktop')} className={`p-1 rounded transition-colors ${viewport === 'desktop' ? 'bg-white dark:bg-gray-900' : 'hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
                <DesktopIcon className="w-4 h-4" />
            </button>
        </div>
        
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      {/* URL and Nav Bar */}
      <div className="p-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <button onClick={handleBack} disabled={!canGoBack} className="disabled:opacity-40 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={handleForward} disabled={!canGoForward} className="disabled:opacity-40 disabled:cursor-not-allowed">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
        <div className="flex-grow bg-white dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400 px-3 py-1 text-center">
          {`http://127.0.0.1:5000 (${size.w} x ${size.h})`}
        </div>
      </div>
      <div className="flex-grow bg-white overflow-auto">
        <iframe
          srcDoc={history[currentIndex] || ''}
          title="Live Preview"
          sandbox="allow-scripts allow-same-origin"
          className="w-full h-full border-0"
        />
      </div>
       <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 10 L 10 0 M 5 10 L 10 5 M 8 10 L 10 8' stroke='%236b7280' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat'
        }}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
};

export default FloatingPreview;
