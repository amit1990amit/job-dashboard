import React from 'react';
import './JobsTable.scss';
import type { Job } from '../../../types';
import { headers } from './constants';
import type { SortState } from './types';
import JobRow from './JobRow';

const JobsTable = ({
  rows,
  sort,
  onSort,
  highlight,
}: {
  rows: Job[];
  sort: SortState;
  onSort: (s: SortState) => void;

  highlight?: string;
}) => {
  const toggleSort = (key: keyof Job) => {
    if (sort.key === key) onSort({ key, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    else onSort({ key, dir: 'asc' });
  };

  return (
    <div className="jobsTable__wrap">
      <table className="jobsTable" role="table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={String(h.key)}
                onClick={() => toggleSort(h.key)}
                className="jobsTable__th"
                aria-sort={
                  sort.key === h.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'
                }
              >
                <span className="jobsTable__thContent">
                  {h.label} {sort.key === h.key ? (sort.dir === 'asc' ? '▲' : '▼') : ''}
                </span>
              </th>
            ))}
            <th className="jobsTable__th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <JobRow
              key={row.jobID}
              job={row}
              highlight={highlight}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobsTable;
