import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'success' | 'danger' | 'warning';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary' }) => {
    return (
        <span>
            {children}
        </span>
    );
};

export default Badge;