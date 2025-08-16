import React from 'react';
import useModal from '../useModal';
import DeleteBulkModal from './DeleteBulkModal';

const useDeleteBulkDialog = () => {
  const { open } = useModal();
  const openDeleteBulk = () => {
    const { close } = open((close) => <DeleteBulkModal onRequestClose={close} />);
    return { close };
  };
  return { openDeleteBulk };
};

export default useDeleteBulkDialog;
