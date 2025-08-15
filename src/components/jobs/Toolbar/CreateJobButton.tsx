import React from 'react';
import './CreateJobButton.scss';

type Props = { onClick: () => void };

const CreateJobButton = ({ onClick }: Props) => {
  return (
    <button type="button" className="btn createJobBtn" onClick={onClick}>
      + Create Job
    </button>
  );
};

export default CreateJobButton;
