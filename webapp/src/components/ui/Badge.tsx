import React from 'react';
import './Badge.scss';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => {
  return (
    <span
      className={`badge ${className}`}
      style={color ? { background: color, color: 'white' } : undefined}
    >
      {children}
    </span>
  );
};
