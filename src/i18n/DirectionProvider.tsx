import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Keeps document direction in sync with current language.
 * he -> rtl, everything else -> ltr
 */
const DirectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  useEffect(() => {
    const dir = i18n.language?.startsWith('he') ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', i18n.language || 'en');
  }, [i18n.language]);

  return <>{children}</>;
};

export default DirectionProvider;
