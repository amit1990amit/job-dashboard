import './JobsDashboard.scss';
import { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useJobsQuery } from '../services/useJobs';
import StatusSummary from '../components/jobs/StatusSummary/StatusSummary';
import Toolbar from '../components/jobs/Toolbar/Toolbar';
import { type SortState } from '../components/jobs/JobsTable/types';
import JobsTable from '../components/jobs/JobsTable/JobsTable';
import { JobStatus } from '../types';
import type { Job } from '../types';

export default function JobsDashboard() {
  const { data: jobs = [], isLoading, error } = useJobsQuery();
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<JobStatus | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', dir: 'desc' });

// Memoize filtering + sorting so it only recalculates when its dependencies change
const filteredJobs = useMemo(() => {
  let result: Job[] = jobs;

  // Filter by selected status if one is chosen
  if (selectedStatus !== undefined) {
    result = result.filter(job => job.status === selectedStatus);
  }

  // Filter by search query if provided (case-insensitive match on job name)
  const trimmedQuery = query.trim().toLowerCase();
  if (trimmedQuery) {
    result = result.filter(job => job.name.toLowerCase().includes(trimmedQuery));
  }

  // Determine sort direction multiplier
  const sortDirectionMultiplier = sort.dir === 'asc' ? 1 : -1;

  // Sort by the chosen key
  result = [...result].sort((jobA, jobB) => {
    const valueA = jobA[sort.key] as any;
    const valueB = jobB[sort.key] as any;

    if (valueA === valueB) return 0;
    return valueA > valueB ? sortDirectionMultiplier : -sortDirectionMultiplier;
  });

  return result;
}, [jobs, selectedStatus, query, sort]);

const handleSelect = useCallback((s: JobStatus) => {
  // functional update = no dependency on selectedStatus
  setSelectedStatus(prev => (s === prev ? undefined : s));
}, []);


  if (isLoading) return <div className="page__wrap">{t('Loading…')}</div>;
  if (error) return <div className="page__wrap">{t('Error loading jobs')}</div>;

  return (
    <div className="page__wrap jobs">
      <h1 className="page__title">{t('app.title')}</h1>
      <StatusSummary
        jobs={jobs}
        selected={selectedStatus}
        onSelect={handleSelect}
      />
      <Toolbar
        search={query}
        onSearchChange={setQuery}
      />
      <JobsTable
        rows={filteredJobs}
        sort={sort}
        onSort={setSort}
        highlight={query}
      />

      {filteredJobs.length === 0 && (
        <div className="jobs__empty">
          {jobs.length === 0 ? t('empty.noJobs') : t('empty.noResults')}
        </div>
      )}
    </div>
  );
}
