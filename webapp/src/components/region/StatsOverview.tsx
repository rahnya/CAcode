import React from 'react';
import { FolderOpen, Euro, Heart, Users, LucideIcon } from 'lucide-react';
import './StatsOverview.scss';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface StatsOverviewProps {
  projectCount: number;
  totalFunding: number;
  followedCount: number;
  citizenCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  projectCount,
  totalFunding,
  followedCount,
  citizenCount,
}) => {
  const stats: Stat[] = [
    {
      label: 'Projets lancés',
      value: String(projectCount),
      icon: FolderOpen,
      color: '#0a94a8',
    },
    {
      label: 'Financement total',
      value: `${(totalFunding / 1000).toFixed(0)}k €`,
      icon: Euro,
      color: '#6ea371',
    },
    {
      label: 'Projets suivis',
      value: String(followedCount),
      icon: Heart,
      color: '#e62f44',
    },
    {
      label: 'Citoyens engagés',
      value: String(citizenCount),
      icon: Users,
      color: '#7c5bc4',
    },
  ];

  return (
    <div className="statsOverview">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="statsOverviewCard">
            <div className="statsOverviewIcon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <Icon size={20} />
            </div>
            <div className="statsOverviewValue">{stat.value}</div>
            <div className="statsOverviewLabel">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
};
