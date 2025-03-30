import React from 'react';

interface CardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
            <h2 className="text-xl font-bold mb-2">{title}</h2>
            {children}
        </div>
    );
};

export default Card;
