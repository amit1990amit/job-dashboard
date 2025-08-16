import React, { useState } from 'react';
import './DeleteBulkModal.scss';
import { useTranslation } from 'react-i18next';
import { JobStatus } from '../../types';
import { useDeleteJobsByStatus } from '../../services/useJobs';

type Props = { onRequestClose: () => void };

const DeleteBulkModal = ({ onRequestClose }: Props) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<JobStatus | ''>('');
  const del = useDeleteJobsByStatus();

  const onSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    if (status === '') return;
    del.mutate(status as JobStatus, { onSettled: onRequestClose });
  };

  const disabled = del.isPending || status === '';

  return (
    <div className="modal">
      <div className="modal__header">{t('modal.deleteBulk.title')}</div>

      <form className="deleteBulkForm" onSubmit={onSubmit}>
        <label className="field">
          <span>{t('modal.deleteBulk.status')}</span>
          <select
            className="select"
            value={status === '' ? '' : Number(status)}
            onChange={(e) => setStatus(Number(e.target.value) as JobStatus)}
          >
            <option value="">{t('modal.deleteBulk.select')}</option>
            <option value={JobStatus.Completed}>{t('status.Completed')}</option>
            <option value={JobStatus.Failed}>{t('status.Failed')}</option>
          </select>
        </label>

        <p className="deleteBulkForm__note">{t('modal.deleteBulk.note')}</p>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onRequestClose} disabled={del.isPending}>
            {t('modal.cancel')}
          </button>
          <button type="submit" className="btn deleteBulkForm__danger" disabled={disabled}>
            {del.isPending ? t('modal.deleteBulk.deleting') : t('actions.delete')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteBulkModal;
