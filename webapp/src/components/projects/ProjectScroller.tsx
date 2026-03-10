import React, { useState, useCallback, useRef } from 'react';
import { Project } from '../../types/project';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import { HeartAnimation } from './HeartAnimation';
import './ProjectScroller.scss';

interface ProjectScrollerProps {
  projects: Project[];
  isFollowed: (id: string) => boolean;
  toggleFollow: (id: string) => Promise<boolean>;
}

export const ProjectScroller: React.FC<ProjectScrollerProps> = ({
  projects,
  isFollowed,
  toggleFollow,
}) => {
  const [heartTriggers, setHeartTriggers] = useState<Record<string, number>>({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!hasScrolled) setHasScrolled(true);
  }, [hasScrolled]);

  const handleDoubleTap = async (projectId: string) => {
    const nowFollowed = await toggleFollow(projectId);
    if (nowFollowed) {
      setHeartTriggers((prev) => ({
        ...prev,
        [projectId]: (prev[projectId] || 0) + 1,
      }));
    }
  };

  if (projects.length === 0) {
    return (
      <div className="projectScrollerEmpty">
        <p>Aucun projet trouvé pour cette région.</p>
      </div>
    );
  }

  return (
    <>
      <div className="projectScroller" ref={scrollerRef} onScroll={handleScroll}>
        {projects.map((project, i) => (
          <div key={project.id} className="projectScrollerItem">
            <ProjectCard
              project={project}
              isFollowed={isFollowed(project.id)}
              onFollow={() => toggleFollow(project.id)}
              onDoubleTap={() => handleDoubleTap(project.id)}
              onDetails={() => setDetailProject(project)}
              index={i}
              total={projects.length}
              showSwipeHint={projects.length > 1 && !hasScrolled && i === 0}
            />
            <HeartAnimation trigger={heartTriggers[project.id] || 0} />
          </div>
        ))}
      </div>

      {detailProject && (
        <ProjectDetailModal
          project={detailProject}
          isFollowed={isFollowed(detailProject.id)}
          onFollow={() => toggleFollow(detailProject.id)}
          onClose={() => setDetailProject(null)}
        />
      )}
    </>
  );
};
