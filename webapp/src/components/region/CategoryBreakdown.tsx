import React from 'react';
import { CATEGORY_COLORS } from '../../data/categories';
import './CategoryBreakdown.scss';

interface CategoryData {
  category: string;
  count: number;
  color: string;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
}

export function getCategoryBreakdown(
  projects: { category: string }[]
): CategoryData[] {
  const counts: Record<string, number> = {};
  projects.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([category, count]) => ({
      category,
      count,
      color: CATEGORY_COLORS[category] || '#999',
    }))
    .sort((a, b) => b.count - a.count);
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
  const max = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="categoryBreakdown">
      <h3 className="categoryBreakdownTitle">Répartition par catégorie</h3>
      <div className="categoryBreakdownBars">
        {data.map((item) => (
          <div key={item.category} className="categoryBreakdownRow">
            <span className="categoryBreakdownLabel">{item.category}</span>
            <div className="categoryBreakdownBarTrack">
              <div
                className="categoryBreakdownBarFill"
                style={{
                  width: `${(item.count / max) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
            <span className="categoryBreakdownCount">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
