import React, { useState, useMemo } from 'react';
import { BottomNav, TabId } from './components/layout/BottomNav';
import { ProjectsTab } from './components/projects/ProjectsTab';
import { RegionDashboard } from './components/region/RegionDashboard';
import { ForumTab } from './components/forum/ForumTab';
import { useFollowedProjects } from './hooks/useFollowedProjects';
import { RegionCode } from './types/project';
import './App.scss';

const TAB_COMPONENTS: Record<TabId, React.FC<any>> = {
  forum: ForumTab,
  projets: ProjectsTab,
  region: RegionDashboard,
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('projets');
  const [selectedRegion, setSelectedRegion] = useState<RegionCode | null>(null);
  const { followedIds, isFollowed, toggleFollow } = useFollowedProjects();

  const tabProps: Record<TabId, Record<string, any>> = useMemo(() => ({
    forum: {},
    projets: { followedIds, isFollowed, toggleFollow, selectedRegion, onRegionChange: setSelectedRegion },
    region: { followedIds, selectedRegion, onRegionChange: setSelectedRegion },
  }), [followedIds, isFollowed, toggleFollow, selectedRegion]);

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="app">
      <main className="appContent">
        <ActiveComponent {...tabProps[activeTab]} />
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};
