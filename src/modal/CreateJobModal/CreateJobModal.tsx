import React, { useState } from 'react';
import './CreateJobModal.scss';
import { useTranslation } from 'react-i18next';
import { JobPriority } from '../../types';
import { useCreateJob } from '../../services/useJobs';

type Props = { onRequestClose: () => void };

const CreateJobModal = ({ onRequestClose }: Props) => {
  const { t } = useTranslation();
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
      <div className="modal__header">{t('modal.create.title')}</div>
      <form onSubmit={onSubmit} className="createJobForm">
        <label className="field">
          <span>{t('modal.create.name')}</span>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label className="field">
          <span>{t('modal.create.priority')}</span>
          <select
            className="select"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as JobPriority)}
          >
            <option value={JobPriority.Regular}>{t('priority.regular')}</option>
            <option value={JobPriority.High}>{t('priority.high')}</option>
          </select>
        </label>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onRequestClose} disabled={isPending}>
            {t('modal.cancel')}
          </button>
          <button type="submit" className="btn" disabled={!name.trim() || isPending}>
            {t('modal.confirm')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobModal;
