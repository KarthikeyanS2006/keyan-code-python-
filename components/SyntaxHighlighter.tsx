import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
}

const TOKEN_STYLES = {
  keyword: 'text-blue-600 dark:text-cyan-400 font-semibold',
  string: 'text-emerald-600 dark:text-emerald-400',
  comment: 'text-gray-500 dark:text-gray-400 italic',
  number: 'text-amber-600 dark:text-amber-400',
  function: 'text-purple-600 dark:text-purple-400',
  default: 'text-gray-800 dark:text-gray-200',
};

// Simple regex-based highlighter
const highlightCode = (code: string): React.ReactNode => {
  const pythonKeywords = [
    'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from',
    'as', 'in', 'and', 'or', 'not', 'is', 'True', 'False', 'None', 'try', 'except',
    'finally', 'with', 'lambda', 'yield', 'pass', 'continue', 'break'
  ];
  
  const keywordRegex = new RegExp(`\\b(${pythonKeywords.join('|')})\\b`, 'g');
  const functionRegex = /(\w+)\s*\(/g;
  const commentRegex = /(#.*)/g;
  const stringRegex = /(".*?"|'.*?')/g;
  const numberRegex = /\b(\d+(\.\d*)?)\b/g;

  const tokens = code
    .split(new RegExp(`(${keywordRegex.source}|${commentRegex.source}|${stringRegex.source}|${numberRegex.source})`, 'g'))
    .filter(Boolean);

  return tokens.map((token, i) => {
    if (keywordRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.keyword}>{token}</span>;
    }
    if (commentRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.comment}>{token}</span>;
    }
    if (stringRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.string}>{token}</span>;
    }
    if (numberRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.number}>{token}</span>;
    }
    // Basic function name detection
    if (token.match(functionRegex)) {
        const parts = token.split(/(\w+\s*\()/g).filter(Boolean);
        return parts.map((part, j) => {
            if (part.match(functionRegex)) {
                 const funcName = part.substring(0, part.indexOf('('));
                 const rest = part.substring(part.indexOf('('));
                 return <span key={`${i}-${j}`}><span className={TOKEN_STYLES.function}>{funcName}</span>{rest}</span>
            }
            return part;
        })
    }
    return <span key={i} className={TOKEN_STYLES.default}>{token}</span>;
  });
};

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code }) => {
  return (
    <pre className="p-3 font-mono text-sm whitespace-pre-wrap">
      <code>
        {highlightCode(code)}
      </code>
    </pre>
  );
};

export default SyntaxHighlighter;
