import React from 'react';

const GeminiIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.929 11.53L10.5 7.071l-2.429 4.459 4.858-2.43zm-1.283 8.94L7.5 13.5l4.146-7.182L15 13.5l-3.354 6.97zM12 2a10 10 0 100 20 10 10 0 000-20z"/>
    </svg>
);

export default GeminiIcon;
