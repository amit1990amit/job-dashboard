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
    const res = await assertOK(await fetch(`${API_BASE}/Jobs`));
    const data = (await res.json()) as Job[];
    return data.map(normalizeJob);
  }

  async createJob(payload: CreateJobRequest): Promise<Job> {
    // priority must be 0|1 (Regular|High)
    const res = await assertOK(await fetch(`${API_BASE}/Jobs`, json(payload)));
    const data = (await res.json()) as Job;
    return normalizeJob(data);
  }

  async stopJob(jobID: string): Promise<ApiResponse> {
    const res = await assertOK(await fetch(`${API_BASE}/Jobs/${jobID}/stop`, { method: 'POST' }));
    return (await res.json()) as ApiResponse;
  }

  async restartJob(jobID: string): Promise<ApiResponse> {
    const res = await assertOK(await fetch(`${API_BASE}/Jobs/${jobID}/restart`, { method: 'POST' }));
    return (await res.json()) as ApiResponse;
  }

  async deleteJob(jobID: string): Promise<void> {
    await assertOK(await fetch(`${API_BASE}/Jobs/${jobID}`, { method: 'DELETE' }));
  }

  async deleteJobsByStatus(status: JobStatus): Promise<void> {
    await assertOK(await fetch(`${API_BASE}/Jobs/status/${status}`, { method: 'DELETE' }));
  }
}
