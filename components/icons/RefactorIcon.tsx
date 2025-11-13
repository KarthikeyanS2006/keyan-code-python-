
import React from 'react';

const RefactorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414l-7.586 7.586a1 1 0 01-1.414 0l-2.293-2.293a1 1 0 010-1.414l7.586-7.586a1 1 0 011.414 0z" />
  </svg>
);

export default RefactorIcon;
