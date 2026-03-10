import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Heart } from 'lucide-react';
import { RegionCode } from '../../types/project';
import { REGIONS } from '../../data/regions';
import './RegionFilter.scss';

interface RegionFilterProps {
  selected: RegionCode | null;
  onChange: (region: RegionCode | null) => void;
  showSuivis?: boolean;
  onToggleSuivis?: () => void;
  followedCount?: number;
}

export const RegionFilter: React.FC<RegionFilterProps> = ({
  selected,
  onChange,
  showSuivis,
  onToggleSuivis,
  followedCount,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectedRegion = REGIONS.find((r) => r.code === selected);
  const label = selectedRegion
    ? `${selectedRegion.name} (${selectedRegion.code})`
    : 'Toutes les régions';

  const handleSelect = (code: RegionCode | null) => {
    onChange(code);
    setOpen(false);
    if (showSuivis && onToggleSuivis) onToggleSuivis();
  };

  return (
    <div className="regionFilter" ref={ref}>
      <div className="regionFilterDropdown">
        <button
          className={`regionFilterTrigger ${open ? 'regionFilterTriggerOpen' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span>{label}</span>
          <ChevronDown size={16} />
        </button>
        {open && (
          <div className="regionFilterMenu">
            <button
              className={`regionFilterOption ${selected === null && !showSuivis ? 'regionFilterOptionActive' : ''}`}
              onClick={() => handleSelect(null)}
            >
              Toutes les régions
            </button>
            {REGIONS.map((r) => (
              <button
                key={r.code}
                className={`regionFilterOption ${selected === r.code && !showSuivis ? 'regionFilterOptionActive' : ''}`}
                onClick={() => handleSelect(r.code)}
              >
                {r.name} ({r.code})
              </button>
            ))}
          </div>
        )}
      </div>
      {onToggleSuivis && (
        <button
          className={`regionFilterSuivis ${showSuivis ? 'regionFilterSuivisActive' : ''}`}
          onClick={onToggleSuivis}
        >
          <Heart size={16} fill={showSuivis ? '#e62f44' : 'none'} stroke={showSuivis ? '#e62f44' : 'currentColor'} />
          <span>Suivis{followedCount && followedCount > 0 ? ` (${followedCount})` : ''}</span>
        </button>
      )}
    </div>
  );
};
