import { useJobsQuery, useStopJob, useRestartJob, useDeleteJob } from '../services/useJobs';
import { JobStatus } from '../types';

export default function JobsDashboard() {
  const { data: jobs = [], isLoading, error } = useJobsQuery();
  const stop = useStopJob();
  const restart = useRestartJob();
  const remove = useDeleteJob();

  if (isLoading) return <div>Loading…</div>;
  if (error) return <div>Error loading jobs</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Jobs</h1>
      <ul>
        {jobs.map(j => (
          <li key={j.jobID} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ minWidth: 220 }}>{j.name}</span>
            <span>Status: {Object.keys(JobStatus)[j.status]}</span>
            <span>Progress: {j.progress}%</span>
            <button
              disabled={!(j.status === JobStatus.Running || j.status === JobStatus.InQueue)}
              onClick={() => stop.mutate(j.jobID)}
            >Stop</button>
            <button
              disabled={!(j.status === JobStatus.Failed || j.status === JobStatus.Stopped)}
              onClick={() => restart.mutate(j.jobID)}
            >Restart</button>
            <button
              disabled={!(j.status === JobStatus.Completed || j.status === JobStatus.Failed || j.status === JobStatus.Stopped)}
              onClick={() => remove.mutate(j.jobID)}
            >Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
