import React from 'react';
import './PriorityBadge.scss';
import { useTranslation } from 'react-i18next';
import { JobPriority } from '../../../../types';

const PriorityBadge = ({ value }: { value: JobPriority }) => {
  const { t } = useTranslation();
  const label = value === JobPriority.High ? t('priority.high') : t('priority.regular');
  const cls = value === JobPriority.High ? 'pill--high' : 'pill--regular';
  return <span className={`pill ${cls}`}>{label}</span>;
};

export default PriorityBadge;
