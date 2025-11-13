
import React from 'react';

const TSIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#3178C6"/>
        <path d="M8 11.5L12 11.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 11.5V17.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M14 17.5V16.5C14 15.6716 14.6716 15 15.5 15H16.5C17.3284 15 18 14.3284 18 13.5V12.5C18 11.6716 17.3284 11 16.5 11H14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default TSIcon;
