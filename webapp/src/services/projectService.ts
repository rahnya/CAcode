import { Project, RegionCode } from '../types/project';
import { PROJECTS } from '../data/projects';
import { MOCK_FOLLOW_COUNTS, LEADERBOARD_SIZE } from '../config/constants';

export const projectService = {
  async getAll(): Promise<Project[]> {
    return PROJECTS;
  },

  async getByRegion(region: RegionCode | null): Promise<Project[]> {
    if (!region) return PROJECTS;
    return PROJECTS.filter((p) => p.region === region);
  },

  async getByIds(ids: string[]): Promise<Project[]> {
    return PROJECTS.filter((p) => ids.includes(p.id));
  },

  async getLeaderboard(region: RegionCode | null): Promise<{ project: Project; followCount: number }[]> {
    const projects = region ? PROJECTS.filter((p) => p.region === region) : PROJECTS;
    return projects
      .map((project) => ({ project, followCount: MOCK_FOLLOW_COUNTS[project.id] || 0 }))
      .sort((a, b) => b.followCount - a.followCount)
      .slice(0, LEADERBOARD_SIZE);
  },

  async getTotalFunding(projects: Project[]): Promise<number> {
    return projects.reduce((sum, p) => sum + p.fundingCurrent, 0);
  },
};
