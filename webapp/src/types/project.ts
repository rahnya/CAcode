export type RegionCode = '04' | '06' | '83';

export interface ProjectLink {
  label: string;
  url: string;
  type: 'website' | 'facebook' | 'instagram' | 'twitter' | 'other';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  region: RegionCode;
  category: string;
  fundingGoal: number;
  fundingCurrent: number;
  createdAt: string;
  author: string;
  tags: string[];
  links?: ProjectLink[];
}
