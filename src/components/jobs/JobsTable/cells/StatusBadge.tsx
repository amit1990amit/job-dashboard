import React from 'react';
import './StatusBadge.scss';
import { JobStatus } from '../../../../types';

const StatusBadge = ({ value }: { value: JobStatus }) => {
  const label =
    value === JobStatus.Pending ? 'Pending' :
    value === JobStatus.InQueue ? 'In Queue' :
    value === JobStatus.Running ? 'Running' :
    value === JobStatus.Completed ? 'Completed' :
    value === JobStatus.Failed ? 'Failed' : 'Stopped';

  const cls =
    value === JobStatus.Running ? 'badge--running' :
    value === JobStatus.Completed ? 'badge--success' :
    value === JobStatus.Failed ? 'badge--danger' :
    value === JobStatus.Stopped ? 'badge--stopped' :
    value === JobStatus.InQueue ? 'badge--warn' : 'badge--neutral';

  return <span className={`badge ${cls}`}>{label}</span>;
};

export default StatusBadge;
