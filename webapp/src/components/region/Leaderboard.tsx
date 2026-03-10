import React from 'react';
import { Heart, Trophy } from 'lucide-react';
import { Project } from '../../types/project';
import { CATEGORY_COLORS } from '../../data/categories';
import { Badge } from '../ui/Badge';
import './Leaderboard.scss';

interface LeaderboardProps {
  projects: { project: Project; followCount: number }[];
}

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

export const Leaderboard: React.FC<LeaderboardProps> = ({ projects }) => {
  if (projects.length === 0) return null;

  return (
    <div className="leaderboard">
      <div className="leaderboardHeader">
        <Trophy size={18} />
        <h3>Projets les plus suivis</h3>
      </div>
      <div className="leaderboardList">
        {projects.map((item, index) => (
          <div
            key={item.project.id}
            className={`leaderboardRow ${index < 3 ? 'leaderboardRowTop' : ''}`}
          >
            <div
              className="leaderboardRank"
              style={index < 3 ? { color: RANK_COLORS[index] } : undefined}
            >
              {index + 1}
            </div>
            <div className="leaderboardInfo">
              <span className="leaderboardTitle">{item.project.title}</span>
              <Badge color={CATEGORY_COLORS[item.project.category]}>
                {item.project.category}
              </Badge>
            </div>
            <div className="leaderboardFollows">
              <Heart size={14} fill="#e62f44" stroke="#e62f44" />
              <span>{item.followCount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
