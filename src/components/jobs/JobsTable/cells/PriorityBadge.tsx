import React from 'react';
import './PriorityBadge.scss';
import { JobPriority } from '../../../../types';

const PriorityBadge = ({ value }: { value: JobPriority }) => {
  const label = value === JobPriority.High ? 'High' : 'Regular';
  const cls = value === JobPriority.High ? 'pill--high' : 'pill--regular';
  return <span className={`pill ${cls}`}>{label}</span>;
};

export default PriorityBadge;
