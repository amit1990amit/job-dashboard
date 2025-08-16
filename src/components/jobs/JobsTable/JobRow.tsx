import React from 'react';
import type { Job } from '../../../types';
import { formatTime } from './utils';
import StatusBadge from './cells/StatusBadge';
import PriorityBadge from './cells/PriorityBadge';
import ProgressBar from './cells/ProgressBar';
import Highlight from './cells/Highlight';
import ActionButtons from './cells/ActionButtons';

type Props = {
  job: Job;
  highlight?: string;
};

const JobRow = ({ job, highlight }: Props) => {
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

// Only re-render if what we actually display changed
export default React.memo(JobRow, (prev, next) => {
  const a = prev.job, b = next.job;
  return (
    a.jobID === b.jobID &&
    a.name === b.name &&
    a.priority === b.priority &&
    a.status === b.status &&
    a.progress === b.progress &&
    a.startedAt === b.startedAt &&
    a.completedAt === b.completedAt &&
    prev.highlight === next.highlight
  );
});
