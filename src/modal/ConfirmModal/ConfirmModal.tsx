import React from 'react';
import './ConfirmModal.scss';

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
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onRequestClose,
  isLoading,
}: Props) => {

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
          {cancelLabel}
        </button>
        <button type="button" className="btn confirm__primary" onClick={handleConfirm} disabled={isLoading}>
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
