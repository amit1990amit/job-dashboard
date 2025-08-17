import { API_BASE } from '../../config';
import type { ApiResponse, CreateJobRequest, Job, JobStatus } from '../../types';

const json = (data: unknown) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});

const assertOK = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res;
};

const normalizeJob = (j: Job): Job => ({
  ...j,
  // backend may return 0 instead of undefined
  startedAt: j.startedAt || 0,
  completedAt: j.completedAt || 0,
});

export class RealJobsService {
  async getJobs(): Promise<Job[]> {
    try {
      const res = await fetch(`${API_BASE}/Jobs`);
      await assertOK(res);
      const data = (await res.json()) as Job[];
      return data.map(normalizeJob);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async createJob(payload: CreateJobRequest): Promise<Job> {
    try {
      const res = await fetch(`${API_BASE}/Jobs`, json(payload));
      await assertOK(res);
      const data = (await res.json()) as Job;
      return normalizeJob(data);
    } catch (error) {
      console.error('Failed to create job:', error);
      throw new Error(`Failed to create job: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async stopJob(jobID: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`${API_BASE}/Jobs/${jobID}/stop`, { method: 'POST' });
      await assertOK(res);
      return (await res.json()) as ApiResponse;
    } catch (error) {
      console.error(`Failed to stop job ${jobID}:`, error);
      throw new Error(`Failed to stop job: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async restartJob(jobID: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`${API_BASE}/Jobs/${jobID}/restart`, { method: 'POST' });
      await assertOK(res);
      return (await res.json()) as ApiResponse;
    } catch (error) {
      console.error(`Failed to restart job ${jobID}:`, error);
      throw new Error(`Failed to restart job: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteJob(jobID: string): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/Jobs/${jobID}`, { method: 'DELETE' });
      await assertOK(res);
    } catch (error) {
      console.error(`Failed to delete job ${jobID}:`, error);
      throw new Error(`Failed to delete job: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async deleteJobsByStatus(status: JobStatus): Promise<void> {
    try {
      const res = await fetch(`${API_BASE}/Jobs/status/${status}`, { method: 'DELETE' });
      await assertOK(res);
    } catch (error) {
      console.error(`Failed to delete jobs with status ${status}:`, error);
      throw new Error(`Failed to delete jobs by status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
