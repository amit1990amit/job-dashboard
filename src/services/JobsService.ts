import type { ApiResponse, CreateJobRequest, Job, JobStatus } from '../types';

export interface JobsService {
  getJobs(): Promise<Job[]>;
  createJob(req: CreateJobRequest): Promise<ApiResponse>;
  stopJob(id: string): Promise<ApiResponse>;
  restartJob(id: string): Promise<ApiResponse>;
  deleteJob(id: string): Promise<ApiResponse>;
  deleteJobsByStatus(status: JobStatus): Promise<ApiResponse>;
}
