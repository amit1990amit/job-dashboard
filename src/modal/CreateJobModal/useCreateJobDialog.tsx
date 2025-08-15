import React from 'react';
import useModal from '../useModal';
import CreateJobModal from './CreateJobModal';

const useCreateJobDialog = () => {
  const { open } = useModal();

  const openCreateJob = () => {
    open((close) => (
      <CreateJobModal onRequestClose={close} />
    ));
  };

  return { openCreateJob };
};

export default useCreateJobDialog;
