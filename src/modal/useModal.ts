import React from 'react';
import { ModalContext } from './SingleModalProvider';

const useModal = () => {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used within <SingleModalProvider>');
  return ctx;
};

export default useModal;
