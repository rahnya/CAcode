import React, { useState, useEffect } from 'react';
import { Heart, HeartOff } from 'lucide-react';
import { Project } from '../../types/project';
import { projectService } from '../../services/projectService';
import { regionService } from '../../services/regionService';
import { Badge } from '../ui/Badge';
import { ProjectDetailModal } from '../projects/ProjectDetailModal';
import './SuivisTab.scss';

interface SuivisTabProps {
  followedIds: string[];
  toggleFollow: (id: string) => Promise<boolean>;
}

const CATEGORY_COLORS = regionService.getCategoryColors();

export const SuivisTab: React.FC<SuivisTabProps> = ({ followedIds, toggleFollow }) => {
  const [followedProjects, setFollowedProjects] = useState<Project[]>([]);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  useEffect(() => {
    projectService.getByIds(followedIds).then(setFollowedProjects);
  }, [followedIds]);

  if (followedProjects.length === 0) {
    return (
      <div className="suivisTabEmpty">
        <HeartOff size={48} strokeWidth={1.5} />
        <h3>Aucun projet suivi</h3>
        <p>
          Double-tapez sur un projet ou appuyez sur le coeur pour commencer à suivre des projets.
        </p>
      </div>
    );
  }

  return (
    <>
    <div className="suivisTab">
      <div className="suivisTabCount">
        {followedProjects.length} projet{followedProjects.length > 1 ? 's' : ''} suivi{followedProjects.length > 1 ? 's' : ''}
      </div>
      <div className="suivisTabList">
        {followedProjects.map((project) => {
          const progress = Math.min(
            (project.fundingCurrent / project.fundingGoal) * 100,
            100
          );
          return (
            <div key={project.id} className="suivisCard" onClick={() => setDetailProject(project)}>
              <div
                className="suivisCardImage"
                style={{ backgroundImage: `url(${project.imageUrl})` }}
              />
              <div className="suivisCardContent">
                <div className="suivisCardHeader">
                  <Badge color={CATEGORY_COLORS[project.category]}>
                    {project.category}
                  </Badge>
                  <span className="suivisCardRegion">{project.region}</span>
                </div>
                <h3 className="suivisCardTitle">{project.title}</h3>
                <div className="suivisCardProgressBar">
                  <div
                    className="suivisCardProgressFill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="suivisCardFooter">
                  <span className="suivisCardAmount">
                    {project.fundingCurrent.toLocaleString('fr-FR')} &euro;
                    <span className="suivisCardGoal">
                      {' '}/ {project.fundingGoal.toLocaleString('fr-FR')} &euro;
                    </span>
                  </span>
                  <button
                    className="suivisCardUnfollow"
                    onClick={(e) => { e.stopPropagation(); toggleFollow(project.id); }}
                  >
                    <Heart size={18} fill="#e62f44" stroke="#e62f44" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {detailProject && (
      <ProjectDetailModal
        project={detailProject}
        isFollowed={followedIds.includes(detailProject.id)}
        onFollow={() => toggleFollow(detailProject.id)}
        onClose={() => setDetailProject(null)}
      />
    )}
    </>
  );
};
