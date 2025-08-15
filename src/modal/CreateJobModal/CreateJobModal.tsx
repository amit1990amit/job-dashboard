import React, { useState } from 'react';
import './CreateJobModal.scss';
import { JobPriority } from '../../types';
import { useCreateJob } from '../../services/useJobs';

type Props = { onRequestClose: () => void };

const CreateJobModal = ({ onRequestClose }: Props) => {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<JobPriority>(JobPriority.Regular);
  const { mutateAsync, isPending } = useCreateJob();

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await mutateAsync({ name: name.trim(), priority });
    onRequestClose();
  };

  return (
    <div className="modal">
      <div className="modal__header">Create Job</div>
      <form onSubmit={onSubmit} className="createJobForm">
        <label className="field">
          <span>Name</span>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label className="field">
          <span>Priority</span>
          <select
            className="select"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as JobPriority)}
          >
            <option value={JobPriority.Regular}>Regular</option>
            <option value={JobPriority.High}>High</option>
          </select>
        </label>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onRequestClose} disabled={isPending}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={!name.trim() || isPending}>
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobModal;
