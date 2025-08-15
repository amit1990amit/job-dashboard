import './JobsDashboard.scss';
import { useMemo, useState } from 'react';
import { useJobsQuery, useStopJob, useRestartJob, useDeleteJob, useDeleteJobsByStatus } from '../services/useJobs';
import StatusSummary from '../components/jobs/StatusSummary/StatusSummary';
import Toolbar from '../components/jobs/Toolbar/Toolbar';
import { type SortState } from '../components/jobs/JobsTable/types';
import  JobsTable from '../components/jobs/JobsTable/JobsTable';
import { JobStatus } from '../types';
import type { Job } from '../types';

export default function JobsDashboard() {
  const { data: jobs = [], isLoading, error } = useJobsQuery();
  const stop = useStopJob();
  const restart = useRestartJob();
  const remove = useDeleteJob();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const bulkDelete = useDeleteJobsByStatus();

  const [selectedStatus, setSelectedStatus] = useState<JobStatus | undefined>(undefined);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>({ key: 'createdAt', dir: 'desc' });

  const counts = useMemo(() => {
    const base = { Pending: 0, InQueue: 0, Running: 0, Completed: 0, Failed: 0, Stopped: 0 };
    for (const j of jobs) {
      if (j.status === JobStatus.Pending) base.Pending++;
      else if (j.status === JobStatus.InQueue) base.InQueue++;
      else if (j.status === JobStatus.Running) base.Running++;
      else if (j.status === JobStatus.Completed) base.Completed++;
      else if (j.status === JobStatus.Failed) base.Failed++;
      else if (j.status === JobStatus.Stopped) base.Stopped++;
    }
    return base;
  }, [jobs]);

  const filtered = useMemo(() => {
    let out: Job[] = jobs;
    if (selectedStatus !== undefined) out = out.filter(j => j.status === selectedStatus);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter(j => j.name.toLowerCase().includes(q));
    }
    const dirMul = sort.dir === 'asc' ? 1 : -1;
    out = [...out].sort((a, b) => {
      const ka = a[sort.key] as any;
      const kb = b[sort.key] as any;
      if (ka === kb) return 0;
      return ka > kb ? dirMul : -dirMul;
    });
    return out;
  }, [jobs, selectedStatus, query, sort]);

  if (isLoading) return <div className="page__wrap">Loading…</div>;
  if (error) return <div className="page__wrap">Error loading jobs</div>;

  return (
    <div className="page__wrap jobs">
      <h1 className="page__title">Job Management</h1>

      <StatusSummary
        counts={counts}
        selected={selectedStatus}
        onSelect={(s) => setSelectedStatus(s === selectedStatus ? undefined : s)}
      />
      <Toolbar
        search={query}
        onSearchChange={setQuery}
      />
      <JobsTable
        rows={filtered}
        sort={sort}
        onSort={setSort}
        onStop={(id) => stop.mutate(id)}
        onRestart={(id) => restart.mutate(id)}
        onDelete={(id) => remove.mutate(id)}
        highlight={query}
      />

      {filtered.length === 0 && (
        <div className="jobs__empty">
          {jobs.length === 0 ? 'No jobs yet.' : 'No results. Try clearing filters or search.'}
        </div>
      )}
    </div>
  );
}
