import React, { useMemo, useState, useEffect } from 'react';
import { RegionCode, Project } from '../../types/project';
import { projectService } from '../../services/projectService';
import { regionService } from '../../services/regionService';
import { RegionFilter } from '../projects/RegionFilter';
import { StatsOverview } from './StatsOverview';
import { Leaderboard } from './Leaderboard';
import { CategoryBreakdown, getCategoryBreakdown } from './CategoryBreakdown';
import './RegionDashboard.scss';

interface RegionDashboardProps {
  followedIds: string[];
  selectedRegion: RegionCode | null;
  onRegionChange: (region: RegionCode | null) => void;
}

export const RegionDashboard: React.FC<RegionDashboardProps> = ({ followedIds, selectedRegion, onRegionChange }) => {
  const [regionProjects, setRegionProjects] = useState<Project[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<{ project: Project; followCount: number }[]>([]);

  useEffect(() => {
    projectService.getByRegion(selectedRegion).then(setRegionProjects);
    projectService.getLeaderboard(selectedRegion).then(setLeaderboardData);
  }, [selectedRegion]);

  const totalFunding = useMemo(
    () => regionProjects.reduce((sum, p) => sum + p.fundingCurrent, 0),
    [regionProjects]
  );

  const followedInRegion = useMemo(
    () => regionProjects.filter((p) => followedIds.includes(p.id)).length,
    [regionProjects, followedIds]
  );

  const categoryData = useMemo(
    () => getCategoryBreakdown(regionProjects),
    [regionProjects]
  );

  const citizenCount = regionService.getCitizenCount(selectedRegion);

  return (
    <div className="regionDashboard">
      <RegionFilter selected={selectedRegion} onChange={onRegionChange} />
      <div className="regionDashboardContent">
        <StatsOverview
          projectCount={regionProjects.length}
          totalFunding={totalFunding}
          followedCount={followedInRegion}
          citizenCount={citizenCount}
        />
        <Leaderboard projects={leaderboardData} />
        <CategoryBreakdown data={categoryData} />
      </div>
    </div>
  );
};
