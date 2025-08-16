import React from 'react';
import { JobStatus } from '../../../../types';
import type { Job } from '../../../../types';
import useConfirm from '../../../../modal/ConfirmModal/useConfirm';
import { useDeleteJob, useRestartJob, useStopJob } from '../../../../services/useJobs';

type Props = { job: Job };

const ActionButtons = ({ job }: Props) => {
  // mutations
  const stop = useStopJob();
  const restart = useRestartJob();
  const del = useDeleteJob();

  // confirm helper
  const { confirm } = useConfirm();

  // which actions are valid for this job
  const canStop = job.status === JobStatus.Running || job.status === JobStatus.InQueue;
  const canRestart = job.status === JobStatus.Failed || job.status === JobStatus.Stopped;
  const canDelete =
    job.status === JobStatus.Completed ||
    job.status === JobStatus.Failed ||
    job.status === JobStatus.Stopped;

  const askStop = () => {
    confirm({
      title: 'Stop Job',
      message: `Stop job "${job.name}"?`,
      confirmLabel: 'Stop',
      isLoading: stop.isPending,
      onConfirm: () => stop.mutate(job.jobID),
    });
  };

  const askRestart = () => {
    confirm({
      title: 'Restart Job',
      message: `Restart job "${job.name}"?`,
      confirmLabel: 'Restart',
      isLoading: restart.isPending,
      onConfirm: () => restart.mutate(job.jobID),
    });
  };

  const askDelete = () => {
    confirm({
      title: 'Delete Job',
      message: `Delete job "${job.name}"?`,
      confirmLabel: 'Delete',
      isLoading: del.isPending,
      onConfirm: () => del.mutate(job.jobID),
    });
  };

  return (
    <td className="jobsTable__td jobsTable__actions">
      {canStop && (
        <button type="button" className="btn" onClick={askStop}>
          Stop
        </button>
      )}
      {canRestart && (
        <button type="button" className="btn" onClick={askRestart}>
          Restart
        </button>
      )}
      {canDelete && (
        <button type="button" className="btn" onClick={askDelete}>
          Delete
        </button>
      )}
    </td>
  );
};

export default ActionButtons;
