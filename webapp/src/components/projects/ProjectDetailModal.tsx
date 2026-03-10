import React from 'react';
import { X, MapPin, Calendar, User, Tag, Globe, ExternalLink } from 'lucide-react';
import { Project } from '../../types/project';
import { regionService } from '../../services/regionService';
import { Badge } from '../ui/Badge';
import './ProjectDetailModal.scss';

const CATEGORY_COLORS = regionService.getCategoryColors();

const LINK_ICONS: Record<string, string> = {
  facebook: 'f',
  instagram: 'ig',
  twitter: 'X',
};

interface ProjectDetailModalProps {
  project: Project;
  isFollowed: boolean;
  onFollow: () => void;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isFollowed,
  onFollow,
  onClose,
}) => {
  const progress = Math.min((project.fundingCurrent / project.fundingGoal) * 100, 100);
  const formattedDate = new Date(project.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="detailOverlay" onClick={onClose}>
      <div className="detailModal" onClick={(e) => e.stopPropagation()}>
        <div className="detailHandle" />

        <div className="detailHeader">
          <h2 className="detailTitle">{project.title}</h2>
          <button className="detailClose" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detailContent">
          <div className="detailMeta">
            <Badge color={CATEGORY_COLORS[project.category]}>{project.category}</Badge>
            <span className="detailMetaItem">
              <MapPin size={14} />
              {project.region}
            </span>
            <span className="detailMetaItem">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="detailMetaItem">
              <User size={14} />
              {project.author}
            </span>
          </div>

          <p className="detailDescription">{project.description}</p>

          <div className="detailSection">
            <h3 className="detailSectionTitle">Financement</h3>
            <div className="detailFunding">
              <div className="detailProgressBar">
                <div className="detailProgressFill" style={{ width: `${progress}%` }} />
              </div>
              <div className="detailFundingRow">
                <span className="detailFundingCurrent">
                  {project.fundingCurrent.toLocaleString('fr-FR')} &euro;
                </span>
                <span className="detailFundingGoal">
                  objectif {project.fundingGoal.toLocaleString('fr-FR')} &euro;
                </span>
              </div>
              <span className="detailFundingPercent">{Math.round(progress)}% financé</span>
            </div>
          </div>

          {project.tags.length > 0 && (
            <div className="detailSection">
              <h3 className="detailSectionTitle">
                <Tag size={14} />
                Tags
              </h3>
              <div className="detailTags">
                {project.tags.map((tag) => (
                  <span key={tag} className="detailTag">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {project.links && project.links.length > 0 && (
            <div className="detailSection">
              <h3 className="detailSectionTitle">
                <Globe size={14} />
                Liens &amp; réseaux
              </h3>
              <div className="detailLinks">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    className="detailLink"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.type !== 'website' && link.type !== 'other' ? (
                      <span className="detailLinkIcon">{LINK_ICONS[link.type]}</span>
                    ) : (
                      <ExternalLink size={14} />
                    )}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <button
            className={`detailFollowBtn ${isFollowed ? 'detailFollowBtnActive' : ''}`}
            onClick={onFollow}
          >
            {isFollowed ? 'Suivi' : 'Suivre ce projet'}
          </button>
        </div>
      </div>
    </div>
  );
};
