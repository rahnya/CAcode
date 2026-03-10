import React from 'react';
import { MessageSquare, Layers, BarChart3, LucideIcon } from 'lucide-react';
import './BottomNav.scss';

export type TabId = 'forum' | 'projets' | 'region';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'forum', label: 'Forum', icon: MessageSquare },
  { id: 'projets', label: 'Projets', icon: Layers },
  { id: 'region', label: 'Ma région', icon: BarChart3 },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottomNav">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`bottomNavTab ${activeTab === id ? 'bottomNavTabActive' : ''}`}
          onClick={() => onTabChange(id)}
        >
          <div className="bottomNavIndicator" />
          <Icon size={22} />
          <span className="bottomNavLabel">{label}</span>
        </button>
      ))}
    </nav>
  );
};
