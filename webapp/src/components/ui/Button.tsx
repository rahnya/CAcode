import React from 'react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  return (
    <button className={`btn btn${variant.charAt(0).toUpperCase() + variant.slice(1)} btn${size.charAt(0).toUpperCase() + size.slice(1)} ${className}`} {...props}>
      {children}
    </button>
  );
};
