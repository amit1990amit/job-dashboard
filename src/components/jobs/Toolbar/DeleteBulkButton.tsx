import React from 'react';
import { useTranslation } from 'react-i18next';

import useDeleteBulkDialog from '../../../modal/DeleteBulkModal/useDeleteBulkDialog';

type Props = { disabled?: boolean };

const DeleteBulkButton = ({ disabled }: Props) => {
  const { openDeleteBulk } = useDeleteBulkDialog();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="btn deleteBulkBtn"
      onClick={() => openDeleteBulk()}
      disabled={disabled}
    >
      {t('actions.deleteJobs')}
    </button>
  );
};

export default DeleteBulkButton;
