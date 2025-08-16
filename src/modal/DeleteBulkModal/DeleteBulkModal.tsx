import React, { useState } from 'react';
import './DeleteBulkModal.scss';
import { JobStatus } from '../../types';
import { useDeleteJobsByStatus } from '../../services/useJobs';

type Props = { onRequestClose: () => void };

const DeleteBulkModal = ({ onRequestClose }: Props) => {
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
      <div className="modal__header">Delete Jobs by Status</div>

      <form className="deleteBulkForm" onSubmit={onSubmit}>
        <label className="field">
          <span>Status</span>
          <select
            className="select"
            value={status === '' ? '' : Number(status)}
            onChange={(e) => setStatus(Number(e.target.value) as JobStatus)}
          >
            <option value="">Select…</option>
            {/* Business rule: allow only Completed / Failed */}
            <option value={JobStatus.Completed}>Completed</option>
            <option value={JobStatus.Failed}>Failed</option>
          </select>
        </label>

        <p className="deleteBulkForm__note">
          This will permanently delete all jobs with the selected status.
        </p>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onRequestClose} disabled={del.isPending}>
            Cancel
          </button>
          <button type="submit" className="btn deleteBulkForm__danger" disabled={disabled}>
            {del.isPending ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeleteBulkModal;
