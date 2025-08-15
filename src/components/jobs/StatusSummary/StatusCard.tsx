import React from 'react';
import './StatusCard.scss';

type Props = {
  label: string;
  count: number;
  active?: boolean;
  onClick: () => void;
};

const StatusCard = ({ label, count, active, onClick }: Props) => {
  return (
    <button
      className={`statusCard ${active ? 'statusCard--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="statusCard__label">{label}</div>
      <div className="statusCard__count">{count}</div>
    </button>
  );
};

export default StatusCard;
