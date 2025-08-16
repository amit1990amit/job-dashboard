import React from 'react';

import useDeleteBulkDialog from '../../../modal/DeleteBulkModal/useDeleteBulkDialog';

type Props = { disabled?: boolean };

const DeleteBulkButton = ({ disabled }: Props) => {
  const { openDeleteBulk } = useDeleteBulkDialog();

  return (
    <button
      type="button"
      className="btn deleteBulkBtn"
      onClick={() => openDeleteBulk()}
      disabled={disabled}
    >
      Delete Jobs…
    </button>
  );
};

export default DeleteBulkButton;
