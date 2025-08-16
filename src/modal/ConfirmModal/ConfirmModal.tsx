import React from 'react';
import './ConfirmModal.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onRequestClose: () => void;
  isLoading?: boolean;
};

const ConfirmModal = ({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onRequestClose,
  isLoading,
}: Props) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm?.();
    onRequestClose();
  }

  return (
    <div className="modal">
      <div className="modal__header">{title}</div>
      {message && <p className="confirm__message">{message}</p>}
      <div className="modal__actions">
        <button type="button" className="btn" onClick={onRequestClose} disabled={isLoading}>
          {cancelLabel || t('modal.cancel')}
        </button>
        <button type="button" className="btn confirm__primary" onClick={handleConfirm} disabled={isLoading}>
          {confirmLabel || t('modal.confirm')}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
