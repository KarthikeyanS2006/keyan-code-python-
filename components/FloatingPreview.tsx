
import React, { useState, useRef, useEffect, useCallback } from 'react';
import CloseIcon from './icons/CloseIcon';

interface FloatingPreviewProps {
  onClose: () => void;
}

const FloatingPreview: React.FC<FloatingPreviewProps> = ({ onClose }) => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 200, y: 100 });
  const [size, setSize] = useState({ w: 450, h: 350 }); // Slightly larger default size
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

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
        <h3 className="font-bold text-sm text-gray-600 dark:text-gray-300">Preview</h3>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <CloseIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Fake URL Bar */}
      <div className="p-1.5 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="bg-white dark:bg-gray-700 rounded-full text-xs text-gray-500 dark:text-gray-400 px-3 py-1">
          http://127.0.0.1:5000
        </div>
      </div>
      <div className="flex-grow p-4 bg-white text-black overflow-auto">
        {/* Preview content goes here. For now, a placeholder. */}
        <div className="text-center text-gray-500">
          <h1 className="text-2xl font-bold">App Preview</h1>
          <p>This is where the output of a web framework like Flask would appear.</p>
          <img src="https://picsum.photos/300/150" alt="placeholder" className="mt-4 mx-auto rounded" />
        </div>
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
