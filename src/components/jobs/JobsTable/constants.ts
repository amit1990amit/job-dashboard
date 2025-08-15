import type { Job } from '../../../types';

export const headers: { key: keyof Job; label: string }[] = [
  { key: 'name',        label: 'Job Name' },
  { key: 'priority',    label: 'Priority' },
  { key: 'status',      label: 'Status' },
  { key: 'progress',    label: 'Progress' },
  { key: 'startedAt',   label: 'Start Time' },
  { key: 'completedAt', label: 'End Time' },
];
