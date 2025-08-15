import React from 'react';
import './Toolbar.scss';
import  SearchBar  from '../../common/SearchBar/SearchBar';
import CreateJobButton from './CreateJobButton';

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
};

const Toolbar = ({ search, onSearchChange }: Props) => {
  return (
    <div className="toolbar">
      <SearchBar value={search} onChange={onSearchChange} placeholder="Search by job name…" />
      <CreateJobButton />
    </div>
  );
};

export default Toolbar;
