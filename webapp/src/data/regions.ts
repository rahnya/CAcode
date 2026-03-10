import { RegionCode } from '../types/project';

export interface Region {
  code: RegionCode;
  name: string;
  department: string;
}

export const REGIONS: Region[] = [
  { code: '04', name: 'Alpes-de-Haute-Provence', department: '04' },
  { code: '06', name: 'Alpes-Maritimes', department: '06' },
  { code: '83', name: 'Var', department: '83' },
];

export const ALL_REGION_CODES: RegionCode[] = ['04', '06', '83'];
