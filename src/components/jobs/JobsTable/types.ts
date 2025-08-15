import type { Job } from '../../../types';

export type SortState = { key: keyof Job; dir: 'asc' | 'desc' };
