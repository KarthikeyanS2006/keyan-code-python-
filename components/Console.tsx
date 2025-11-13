import React, { useRef, useEffect } from 'react';
import GeminiIcon from './icons/GeminiIcon';

// A simple markdown-to-html renderer
const renderMarkdown = (text: string) => {
    // Basic bold, italic, and code block support
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
    text = text.replace(/(\n)/g, '<br />'); // new lines
    return { __html: text };
};

interface ConsoleProps {
  output: string[];
}

const Console: React.FC<ConsoleProps> = ({ output }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  return (
    <div className="flex-1 bg-white dark:bg-black rounded-lg overflow-auto p-3 font-mono text-sm h-full border border-gray-200 dark:border-gray-700">
      {output.map((line, index) => {
        if (line.startsWith('>')) { // User command
            return (
                 <div key={index} className="flex items-center">
                    <span className="text-gray-500 mr-2">$</span>
                    <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{line.substring(1).trim()}</pre>
                 </div>
            );
        } else if (line.toLowerCase().startsWith('error:')) { // Error message
            return <pre key={index} className="whitespace-pre-wrap text-red-600 dark:text-red-400">{line}</pre>;
        } else if (line.startsWith('AI:')) { // AI Response
            return (
                <div key={index} className="flex items-start gap-3 my-2 text-gray-700 dark:text-gray-300 font-sans">
                   <GeminiIcon className="w-5 h-5 mt-1 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                   <div className="flex-1" dangerouslySetInnerHTML={renderMarkdown(line.substring(3).trim())} />
                </div>
            )
        }
        else { // Standard output
            return <pre key={index} className="whitespace-pre-wrap text-green-700 dark:text-green-400">{line}</pre>;
        }
      })}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default Console;
