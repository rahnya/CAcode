import { RegionCode } from '../types/project';
import { Region, REGIONS } from '../data/regions';
import { CATEGORY_COLORS } from '../data/categories';
import { CITIZEN_COUNTS } from '../config/constants';

export const regionService = {
  async getAll(): Promise<Region[]> {
    return REGIONS;
  },

  getCitizenCount(region: RegionCode | null): number {
    return region ? (CITIZEN_COUNTS[region] || 0) : CITIZEN_COUNTS.all;
  },

  getCategoryColors(): Record<string, string> {
    return CATEGORY_COLORS;
  },
};
