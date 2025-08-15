import React from 'react';
import './ProgressBar.scss';
import { JobStatus } from '../../../../types';

const ProgressBar = ({ value, status }: { value: number; status: JobStatus }) => {
  const cls =
    status === JobStatus.Failed ? 'progress--danger' :
    status === JobStatus.Completed ? 'progress--success' : 'progress--primary';

  // Inline width is the one legit dynamic style here
  return (
    <div className={`progress ${cls}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress__bar" style={{ width: `${value}%` }} />
    </div>
  );
};

export default ProgressBar;
