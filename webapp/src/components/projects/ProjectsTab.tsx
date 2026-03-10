import React, { useState, useMemo, useEffect } from 'react';
import { RegionCode, Project } from '../../types/project';
import { projectService } from '../../services/projectService';
import { RegionFilter } from './RegionFilter';
import { ProjectScroller } from './ProjectScroller';
import { SuivisTab } from '../suivis/SuivisTab';
import './ProjectsTab.scss';

interface ProjectsTabProps {
  followedIds: string[];
  isFollowed: (id: string) => boolean;
  toggleFollow: (id: string) => Promise<boolean>;
  selectedRegion: RegionCode | null;
  onRegionChange: (region: RegionCode | null) => void;
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  followedIds,
  isFollowed,
  toggleFollow,
  selectedRegion,
  onRegionChange,
}) => {
  const [showSuivis, setShowSuivis] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getByRegion(selectedRegion).then(setProjects);
  }, [selectedRegion]);

  return (
    <div className="projectsTab">
      <RegionFilter
        selected={selectedRegion}
        onChange={onRegionChange}
        showSuivis={showSuivis}
        onToggleSuivis={() => setShowSuivis(!showSuivis)}
        followedCount={followedIds.length}
      />
      <div className="projectsTabScroller">
        {showSuivis ? (
          <SuivisTab followedIds={followedIds} toggleFollow={toggleFollow} />
        ) : (
          <ProjectScroller
            projects={projects}
            isFollowed={isFollowed}
            toggleFollow={toggleFollow}
          />
        )}
      </div>
    </div>
  );
};
