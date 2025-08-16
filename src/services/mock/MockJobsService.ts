import { mockBus } from './MockSignalR';
import { v4 as uuid } from 'uuid';
import { JobStatus, JobPriority } from '../../types';
import type { ApiResponse, CreateJobRequest, Job } from '../../types';
import type { JobsService } from '../JobsService';

const now = () => Date.now();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export class MockJobsService implements JobsService {
  private jobs: Job[] = [
      { jobID: uuid(), name: 'Seed Import', status: JobStatus.InQueue, priority: JobPriority.Regular, progress: 0, createdAt: now() },
    { jobID: uuid(), name: 'Daily ETL',  status: JobStatus.Running,  priority: JobPriority.High,    progress: 38, createdAt: now(), startedAt: now() },
    { jobID: uuid(), name: 'Cleanup',    status: JobStatus.Completed, priority: JobPriority.Regular, progress: 100, createdAt: now()-3e6, startedAt: now()-2.5e6, completedAt: now()-3e5 },];

  private timer: number;

  constructor() {
    // Simulate real-time: queue -> running; running progresses to 100 (or fail)
    this.timer = window.setInterval(() => {
      this.jobs = this.jobs.map(j => {
        if (j.status === JobStatus.InQueue) {
          const updated = { ...j, status: JobStatus.Running, progress: Math.max(1, j.progress), startedAt: j.startedAt ?? now() };
          mockBus.emit('UpdateJobProgress', { jobID: updated.jobID, status: updated.status, progress: updated.progress });
          return updated;
        }
        if (j.status === JobStatus.Running && j.progress < 100) {
          const next = Math.min(100, j.progress + Math.ceil(Math.random() * 8));
          const atEnd = next === 100;
          const endStatus = atEnd && Math.random() < 0.15 ? JobStatus.Failed : atEnd ? JobStatus.Completed : JobStatus.Running;
          const updated: Job = {
            ...j,
            progress: next,
            status: endStatus,
            completedAt: (endStatus === JobStatus.Completed || endStatus === JobStatus.Failed) ? now() : j.completedAt,
            errorMessage: endStatus === JobStatus.Failed ? 'Mock error' : j.errorMessage,
          };
          mockBus.emit('UpdateJobProgress', { jobID: updated.jobID, status: updated.status, progress: updated.progress });
          return updated;
        }
        return j;
      });
    }, 800);
  }

  async getJobs(): Promise<Job[]> {
    await sleep(120);
    return structuredClone(this.jobs);
  }

  async createJob(req: CreateJobRequest): Promise<ApiResponse> {
    await sleep(120);
    const job: Job = { jobID: uuid(), name: req.name.trim(), priority: req.priority, status: JobStatus.Pending, progress: 0, createdAt: now() };
    this.jobs.unshift(job);
    setTimeout(() => {
      const i = this.jobs.findIndex(x => x.jobID === job.jobID);
      if (i >= 0) {
        this.jobs[i] = { ...this.jobs[i], status: JobStatus.InQueue };
        mockBus.emit('UpdateJobProgress', { jobID: job.jobID, status: JobStatus.InQueue, progress: 0 });
      }
    }, 700);
    return { isSuccess: true, message: 'Created' };
  }

  async stopJob(id: string): Promise<ApiResponse> {
    await sleep(80);
    this.jobs = this.jobs.map(j =>
      j.jobID === id && (j.status === JobStatus.Running || j.status === JobStatus.InQueue)
        ? (mockBus.emit('UpdateJobProgress', { jobID: id, status: JobStatus.Stopped, progress: j.progress }), { ...j, status: JobStatus.Stopped })
        : j
    );
    return { isSuccess: true, message: 'Stopped' };
  }

  async restartJob(id: string): Promise<ApiResponse> {
    await sleep(80);
    this.jobs = this.jobs.map(j =>
      j.jobID === id && (j.status === JobStatus.Failed || j.status === JobStatus.Stopped)
        ? (mockBus.emit('UpdateJobProgress', { jobID: id, status: JobStatus.InQueue, progress: 0 }),
           { ...j, status: JobStatus.InQueue, progress: 0, completedAt: undefined, errorMessage: undefined })
        : j
    );
    return { isSuccess: true, message: 'Restarted' };
  }

  async deleteJob(id: string): Promise<ApiResponse> {
    await sleep(60);
    this.jobs = this.jobs.filter(j => j.jobID !== id);
    return { isSuccess: true, message: 'Deleted' };
  }

  async deleteJobsByStatus(status: JobStatus): Promise<ApiResponse> {
    await sleep(100);
    this.jobs = this.jobs.filter(j => j.status !== status);
    return { isSuccess: true, message: 'Bulk deleted' };
  }

  dispose() { window.clearInterval(this.timer); }
}
