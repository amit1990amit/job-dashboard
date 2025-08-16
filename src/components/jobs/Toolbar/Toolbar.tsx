import React from 'react';
import './Toolbar.scss';
import { useTranslation } from 'react-i18next';
import SearchBar from '../../common/SearchBar/SearchBar';
import CreateJobButton from './CreateJobButton';
import DeleteBulkButton from './DeleteBulkButton';
import LanguageSwitcher from '../../common/LanguageSwitcher/LanguageSwitcher';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
};

const Toolbar = ({ search, onSearchChange }: Props) => {
  const { t } = useTranslation();
  
  return (
    <div className="toolbar">
      <SearchBar value={search} onChange={onSearchChange} placeholder={t('search.placeholder')} />
      <CreateJobButton />
      <DeleteBulkButton />
      <LanguageSwitcher />
    </div>
  );
};

export default React.memo(Toolbar);
