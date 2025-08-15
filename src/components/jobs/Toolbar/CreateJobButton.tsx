import React from 'react';
import './CreateJobButton.scss';
import useCreateJobDialog from '../../../modal/CreateJobModal/useCreateJobDialog';

const CreateJobButton = () => {
  const { openCreateJob } = useCreateJobDialog();
  return (
    <button type="button" className="btn createJobBtn"  onClick={() => openCreateJob()}>
      + Create Job
    </button>
  );
};

export default CreateJobButton;
