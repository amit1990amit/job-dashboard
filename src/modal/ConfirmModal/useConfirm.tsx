import React from 'react';
import useModal from '../useModal';
import ConfirmModal from './ConfirmModal';

type OpenArgs = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isLoading?: boolean;
};

const useConfirm = () => {
  const { open } = useModal();

  const confirm = (args: OpenArgs) => {
    const { close } = open((close) => (
      <ConfirmModal
        title={args.title}
        message={args.message}
        confirmLabel={args.confirmLabel}
        cancelLabel={args.cancelLabel}
        isLoading={args.isLoading}
        onConfirm={() => {
          args.onConfirm();
          // If the onConfirm triggers a mutation, it can close in its onSettled.
          // If it’s sync, we can close immediately after calling it:
          // close();
        }}
        onRequestClose={close}
      />
    ));
    return { close };
  };

  return { confirm };
};

export default useConfirm;
