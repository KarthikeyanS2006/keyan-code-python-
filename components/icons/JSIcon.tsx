
import React from 'react';

const JSIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
        <path d="M8 17.5V16.5C8 15.6716 8.67157 15 9.5 15H10.5C11.3284 15 12 14.3284 12 13.5V12.5C12 11.6716 11.3284 11 10.5 11H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 11.5L17.5 11.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16.25 11.5V17.5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

export default JSIcon;
