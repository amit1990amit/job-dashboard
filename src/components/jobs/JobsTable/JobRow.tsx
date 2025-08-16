import React from 'react';
import type { Job } from '../../../types';
import { JobStatus } from '../../../types';
import { formatTime } from './utils';
import StatusBadge from './cells/StatusBadge';
import PriorityBadge from './cells/PriorityBadge';
import ProgressBar from './cells/ProgressBar';
import Highlight from './cells/Highlight';
import ActionButtons from './cells/ActionButtons';

const JobRow = ({
  job,
  onStop,
  onRestart,
  onDelete,
  highlight,
}: {
  job: Job;
  onStop: (id: string) => void;
  onRestart: (id: string) => void;
  onDelete: (id: string) => void;
  highlight?: string;
}) => {
  const canStop = job.status === JobStatus.Running || job.status === JobStatus.InQueue;
  const canRestart = job.status === JobStatus.Failed || job.status === JobStatus.Stopped;
  const canDelete =
    job.status === JobStatus.Completed ||
    job.status === JobStatus.Failed ||
    job.status === JobStatus.Stopped;

  return (
    <tr className="jobsTable__tr">
      <td className="jobsTable__td">
        <Highlight text={job.name} query={highlight} />
      </td>
      <td className="jobsTable__td">
        <PriorityBadge value={job.priority} />
      </td>
      <td className="jobsTable__td">
        <StatusBadge value={job.status} />
      </td>
      <td className="jobsTable__td">
        <ProgressBar value={job.progress} status={job.status} />
      </td>
      <td className="jobsTable__td jobsTable__td--nowrap">
        {job.startedAt ? formatTime(job.startedAt) : '—'}
      </td>
      <td className="jobsTable__td jobsTable__td--nowrap">
        {job.completedAt ? formatTime(job.completedAt) : '—'}
      </td>
      <ActionButtons job={job} />
    </tr>
  );
};

export default JobRow;
