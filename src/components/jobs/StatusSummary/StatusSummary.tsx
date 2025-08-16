import React, { useMemo } from 'react';
import './StatusSummary.scss';
import { useTranslation } from 'react-i18next';
import StatusCard from './StatusCard';
import { JobStatus } from '../../../types';
import type { Job } from '../../../types';

type Props = {
  jobs: Job[];
  selected?: JobStatus;
  onSelect: (s: JobStatus) => void;
};

const StatusSummary = ({ selected, onSelect, jobs }: Props) => {
  const { t } = useTranslation();
  
  const ITEMS = [
    { label: t('status.Pending'),   status: JobStatus.Pending,   key: 'Pending'   as const },
    { label: t('status.InQueue'),  status: JobStatus.InQueue,   key: 'InQueue'   as const },
    { label: t('status.Running'),   status: JobStatus.Running,   key: 'Running'   as const },
    { label: t('status.Completed'), status: JobStatus.Completed, key: 'Completed' as const },
    { label: t('status.Failed'),    status: JobStatus.Failed,    key: 'Failed'    as const },
    { label: t('status.Stopped'),   status: JobStatus.Stopped,   key: 'Stopped'   as const },
  ];

  const counts = useMemo(() => {
      const base = { Pending: 0, InQueue: 0, Running: 0, Completed: 0, Failed: 0, Stopped: 0 };
      for (const job of jobs) {
        if (job.status === JobStatus.Pending) base.Pending++;
        else if (job.status === JobStatus.InQueue) base.InQueue++;
        else if (job.status === JobStatus.Running) base.Running++;
        else if (job.status === JobStatus.Completed) base.Completed++;
        else if (job.status === JobStatus.Failed) base.Failed++;
        else if (job.status === JobStatus.Stopped) base.Stopped++;
      }
      return base;
    }, [jobs]);
    
  return (
    <div className="statusSummary">
      {ITEMS.map(({ label, status, key }) => (
        <StatusCard
          key={key}
          label={label}
          count={counts[key]}
          active={selected === status}
          onClick={() => onSelect(status)}
        />
      ))}
    </div>
  );
};

export default StatusSummary;