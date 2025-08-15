export const JobStatus = {
  Pending: 0,
  InQueue: 1,
  Running: 2,
  Completed: 3,
  Failed: 4,
  Stopped: 5,
} as const;
export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

export const JobPriority = {
  Regular: 0,
  High: 1,
} as const;
export type JobPriority = typeof JobPriority[keyof typeof JobPriority];

// --- Data shapes ---

export type Job = {
  jobID: string;
  name: string;
  status: JobStatus;
  priority: JobPriority;
  progress: number;     // 0..100
  createdAt: number;    // unix ms
  startedAt?: number;
  completedAt?: number;
  errorMessage?: string;
};

export type CreateJobRequest = {
  name: string;
  priority: JobPriority;
};

export type ApiResponse = { isSuccess: boolean; message: string };
