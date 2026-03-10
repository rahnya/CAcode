import React from 'react';
import { Heart, MapPin, ChevronUp, ChevronRight } from 'lucide-react';
import { Project } from '../../types/project';
import { regionService } from '../../services/regionService';
import { Badge } from '../ui/Badge';
import './ProjectCard.scss';

const CATEGORY_COLORS = regionService.getCategoryColors();

interface ProjectCardProps {
  project: Project;
  isFollowed: boolean;
  onFollow: () => void;
  onDoubleTap: () => void;
  onDetails: () => void;
  index: number;
  total: number;
  showSwipeHint?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isFollowed,
  onFollow,
  onDoubleTap,
  onDetails,
  index,
  total,
  showSwipeHint,
}) => {
  const progress = Math.min((project.fundingCurrent / project.fundingGoal) * 100, 100);
  const lastTapRef = React.useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  return (
    <div className="projectCard" onClick={handleTap}>
      <div
        className="projectCardImage"
        style={{ backgroundImage: `url(${project.imageUrl})` }}
      />
      <div className="projectCardOverlay" />

      <div className="projectCardTopRow">
        <div className="projectCardBadges">
          <Badge color={CATEGORY_COLORS[project.category]}>{project.category}</Badge>
          <Badge>
            <MapPin size={12} />
            {project.region}
          </Badge>
        </div>
        {total > 1 && (
          <div className="projectCardCounter">
            {index + 1}/{total}
          </div>
        )}
      </div>

      {showSwipeHint && (
        <div className="projectCardSwipeHint">
          <ChevronUp size={16} />
          <span>Swipe</span>
        </div>
      )}

      <div className="projectCardInfo">
        <button
          className={`projectCardHeart ${isFollowed ? 'projectCardHeartActive' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onFollow();
          }}
        >
          <Heart size={26} fill={isFollowed ? '#e62f44' : 'none'} stroke={isFollowed ? '#e62f44' : 'currentColor'} />
        </button>
        <h2 className="projectCardTitle">{project.title}</h2>
        <p className="projectCardDescription">{project.description}</p>
        <div className="projectCardFunding">
          <div className="projectCardProgressBar">
            <div
              className="projectCardProgressFill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="projectCardFundingText">
            <span className="projectCardAmount">
              {project.fundingCurrent.toLocaleString('fr-FR')} &euro;
            </span>
            <span className="projectCardGoal">
              / {project.fundingGoal.toLocaleString('fr-FR')} &euro;
            </span>
          </div>
        </div>
        <p className="projectCardAuthor">par {project.author}</p>

        <button
          className="projectCardDetails"
          onClick={(e) => {
            e.stopPropagation();
            onDetails();
          }}
        >
          <span>Voir les détails du projet</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
