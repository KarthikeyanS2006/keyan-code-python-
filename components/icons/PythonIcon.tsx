
import React from 'react';

const PythonIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M15 11.25H9V8.25C9 7.00736 10.0074 6 11.25 6H12.75C13.9926 6 15 7.00736 15 8.25V11.25Z" fill="#387EB8"/>
        <path d="M9 12.75H15V15.75C15 16.9926 13.9926 18 12.75 18H11.25C10.0074 18 9 16.9926 9 15.75V12.75Z" fill="#FFD43B"/>
        <path d="M11 9H10V10H11V9Z" fill="white"/>
        <path d="M14 14H13V15H14V14Z" fill="white"/>
    </svg>
);

export default PythonIcon;
