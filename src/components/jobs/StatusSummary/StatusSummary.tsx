import React from 'react';
import './StatusSummary.scss';
import StatusCard from './StatusCard';
import { JobStatus } from '../../../types';

type Counts = {
  Pending: number;
  InQueue: number;
  Running: number;
  Completed: number;
  Failed: number;
  Stopped: number;
};

const ITEMS = [
  { label: 'Pending',   status: JobStatus.Pending,   key: 'Pending'   as const },
  { label: 'In Queue',  status: JobStatus.InQueue,   key: 'InQueue'   as const },
  { label: 'Running',   status: JobStatus.Running,   key: 'Running'   as const },
  { label: 'Completed', status: JobStatus.Completed, key: 'Completed' as const },
  { label: 'Failed',    status: JobStatus.Failed,    key: 'Failed'    as const },
  { label: 'Stopped',   status: JobStatus.Stopped,   key: 'Stopped'   as const },
];

type Props = {
  counts: Counts;
  selected?: JobStatus;
  onSelect: (s: JobStatus) => void;
};

const StatusSummary = ({ counts, selected, onSelect }: Props) => {
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

export default StatusSummary