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

// A more robust regex-based highlighter
const highlightCode = (code: string): React.ReactNode => {
  const pythonKeywords = [
    'def', 'class', 'if', 'else', 'elif', 'for', 'while', 'return', 'import', 'from',
    'as', 'in', 'and', 'or', 'not', 'is', 'True', 'False', 'None', 'try', 'except',
    'finally', 'with', 'lambda', 'yield', 'pass', 'continue', 'break'
  ];
  
  // Regexes for testing if a token matches a type. Note the ^ and $ anchors.
  const keywordTestRegex = new RegExp(`^(${pythonKeywords.join('|')})$`);
  const commentTestRegex = /^#.*/;
  const stringTestRegex = /^(?:"""[\s\S]*?"""|'''[\s\S]*?'''|".*?"|'.*?')$/;
  const numberTestRegex = /^\d+(\.\d*)?$/;
  const functionTestRegex = /^\w+\s*\($/;

  // A single, comprehensive tokenizer regex. Order is important.
  const tokenizer = new RegExp(
    '(' +
    // Triple-quoted strings
    `"""[\\s\\S]*?"""|'''[\\s\\S]*?'''|` +
    // Single-quoted strings
    `".*?"|'.*?'|` +
    // Comments
    `#.*|` +
    // Keywords
    `\\b(?:${pythonKeywords.join('|')})\\b|` +
    // Function calls
    `\\b\\w+\\s*(?=\\()|`+
    // Numbers
    `\\b\\d+(?:\\.\\d*)?\\b` +
    ')',
    'g'
  );

  const tokens = code.split(tokenizer).filter(Boolean);

  return tokens.map((token, i) => {
    if (stringTestRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.string}>{token}</span>;
    }
    if (commentTestRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.comment}>{token}</span>;
    }
    if (keywordTestRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.keyword}>{token}</span>;
    }
    // Check for function calls (name followed by an implicit open paren)
    if (/\b\w+\s*$/.test(token) && i + 1 < tokens.length && tokens[i+1].startsWith('(')) {
        return <span key={i} className={TOKEN_STYLES.function}>{token}</span>;
    }
    if (numberTestRegex.test(token)) {
      return <span key={i} className={TOKEN_STYLES.number}>{token}</span>;
    }

    return <span key={i} className={TOKEN_STYLES.default}>{token}</span>;
  });
};

const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({ code }) => {
  return (
    <pre className="p-3 font-mono text-sm whitespace-pre-wrap" aria-hidden="true">
      <code>
        {highlightCode(code)}
      </code>
    </pre>
  );
};

export default SyntaxHighlighter;
