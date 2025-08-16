import { useTranslation } from 'react-i18next';
import type { Job } from '../../../types';

export const useHeaders = (): { key: keyof Job; label: string }[] => {
  const { t } = useTranslation();
  
  return [
    { key: 'name',        label: t('table.jobName') },
    { key: 'priority',    label: t('table.priority') },
    { key: 'status',      label: t('table.status') },
    { key: 'progress',    label: t('table.progress') },
    { key: 'startedAt',   label: t('table.startTime') },
    { key: 'completedAt', label: t('table.endTime') },
  ];
};
