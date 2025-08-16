import React from 'react';
import './LanguageSwitcher.scss';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="langSwitch">
      <label className="langSwitch__label">
        {t('language.label')}
        <select className="select langSwitch__select" onChange={change} value={i18n.language.startsWith('he') ? 'he' : 'en'}>
          <option value="en">{t('language.en')}</option>
          <option value="he">{t('language.he')}</option>
        </select>
      </label>
    </div>
  );
};

export default LanguageSwitcher;
