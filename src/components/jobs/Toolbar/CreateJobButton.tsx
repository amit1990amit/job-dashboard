import React from 'react';
import { useTranslation } from 'react-i18next';
import useCreateJobDialog from '../../../modal/CreateJobModal/useCreateJobDialog';

const CreateJobButton = () => {
  const { openCreateJob } = useCreateJobDialog();
  const { t } = useTranslation();
  
  return (
    <button type="button" className="btn createJobBtn" onClick={() => openCreateJob()}>
      {t('actions.create')}
    </button>
  );
};

export default CreateJobButton;
