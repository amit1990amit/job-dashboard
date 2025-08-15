import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ModalContextValue, ModalRenderer } from './types';
import './SingleModalProvider.scss';

export const ModalContext = React.createContext<ModalContextValue | null>(null);

const SingleModalProvider = ({ children }: { children: React.ReactNode }) => {
  // one modal at a time
  const [content, setContent] = useState<ModalRenderer | null>(null);

  // for click-outside
  const cardRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setContent(null), []);
  const open = useCallback<ModalContextValue['open']>((renderer) => {
    setContent(() => renderer); // replace any existing modal
    return { close };
  }, [close]);

  // Close on Escape (no DOM querying)
  useEffect(() => {
    if (!content) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [content, close]);

  const onOverlayClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    // close if user clicked the overlay area, not the dialog
    if (e.target === e.currentTarget) close();
  };

  const value = useMemo<ModalContextValue>(() => ({
    open, close, isOpen: !!content
  }), [open, close, content]);

  return (
    <ModalContext.Provider value={value}>
      {children}

      {content && (
        <div className="modalOverlay" role="dialog" aria-modal="true" onMouseDown={onOverlayClick}>
          {/* We don’t use a portal; fixed + z-index keeps it above everything */}
          <div ref={cardRef}>
            {content(close)}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export default SingleModalProvider;
