import React from 'react';
import { Landmark } from 'lucide-react';
import './Header.scss';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="headerBrand">
        <Landmark size={22} />
        <span className="headerTitle">{title}</span>
      </div>
    </header>
  );
};
