import type React from 'react';

export type ModalRenderer = (close: () => void) => React.ReactNode;

export type ModalContextValue = {
  open: (renderer: ModalRenderer) => { close: () => void };
  close: () => void;
  isOpen: boolean;
};
