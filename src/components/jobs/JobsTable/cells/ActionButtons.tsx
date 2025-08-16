import React from 'react';
import { useTranslation } from 'react-i18next';
import { JobStatus } from '../../../../types';
import type { Job } from '../../../../types';
import useConfirm from '../../../../modal/ConfirmModal/useConfirm';
import { useDeleteJob, useRestartJob, useStopJob } from '../../../../services/useJobs';

type Props = { job: Job };

const ActionButtons = ({ job }: Props) => {
  const { t } = useTranslation();
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
      title: t('modal.stop.title'),
      message: t('modal.stop.message', { name: job.name }),
      confirmLabel: t('actions.stop'),
      isLoading: stop.isPending,
      onConfirm: () => stop.mutate(job.jobID),
    });
  };

  const askRestart = () => {
    confirm({
      title: t('modal.restart.title'),
      message: t('modal.restart.message', { name: job.name }),
      confirmLabel: t('actions.restart'),
      isLoading: restart.isPending,
      onConfirm: () => restart.mutate(job.jobID),
    });
  };

  const askDelete = () => {
    confirm({
      title: t('modal.delete.title'),
      message: t('modal.delete.message', { name: job.name }),
      confirmLabel: t('actions.delete'),
      isLoading: del.isPending,
      onConfirm: () => del.mutate(job.jobID),
    });
  };

  return (
    <td className="jobsTable__td jobsTable__actions">
      {canStop && (
        <button type="button" className="btn" onClick={askStop}>
          {t('actions.stop')}
        </button>
      )}
      {canRestart && (
        <button type="button" className="btn" onClick={askRestart}>
          {t('actions.restart')}
        </button>
      )}
      {canDelete && (
        <button type="button" className="btn" onClick={askDelete}>
          {t('actions.delete')}
        </button>
      )}
    </td>
  );
};

export default ActionButtons;
