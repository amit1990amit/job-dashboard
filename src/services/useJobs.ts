import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { MockJobsService, mockBus } from './index';
import { JobStatus } from '../types';
import type { CreateJobRequest, Job } from '../types';
import { RealJobsService } from './real/RealJobsService';
import { USE_MOCK } from '../config'



/** Dynamic Service instance simulating API calls */
const jobsService = USE_MOCK ? new MockJobsService() : new RealJobsService();

/** React Query cache key for all jobs */
const JOBS_QUERY_KEY = ['jobs'] as const;

/**
 * Fetch all jobs.
 * Keeps the UI in sync with the server via React Query caching.
 */
export function useJobsQuery() {
  return useQuery({
    queryKey: JOBS_QUERY_KEY,
    queryFn: () => jobsService.getJobs(),
  });
}

/**
 * Create a new job.
 * On success, refresh the jobs list from the server.
 */
export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJobRequest) => jobsService.createJob(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
  });
}

/**
 * Stop a job immediately.
 * Optimistically updates the UI before the server confirms.
 */
export function useStopJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.stopJob(jobId),

    // Optimistic update: apply the stopped status locally
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData<Job[]>(JOBS_QUERY_KEY);
      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          JOBS_QUERY_KEY,
          previousJobs.map((job): Job =>
            job.jobID === jobId &&
            (job.status === JobStatus.Running || job.status === JobStatus.InQueue)
              ? { ...job, status: JobStatus.Stopped }
              : job
          )
        );
      }
      return { previousJobs };
    },

    // Roll back if the server call fails
    onError: (_error, _jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, context.previousJobs);
      }
    },

    // Always refetch after mutation settles
    onSettled: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
  });
}

/**
 * Restart a job from the beginning.
 * Optimistically resets its state locally.
 */
export function useRestartJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.restartJob(jobId),

    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData<Job[]>(JOBS_QUERY_KEY);
      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          JOBS_QUERY_KEY,
          previousJobs.map((job): Job =>
            job.jobID === jobId
              ? {
                  ...job,
                  status: JobStatus.InQueue,
                  progress: 0,
                  completedAt: undefined,
                  errorMessage: undefined,
                }
              : job
          )
        );
      }
      return { previousJobs };
    },

    onError: (_error, _jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, context.previousJobs);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
  });
}

/**
 * Delete a job permanently.
 * Removes it from the UI immediately (optimistic update).
 */
export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobId: string) => jobsService.deleteJob(jobId),

    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData<Job[]>(JOBS_QUERY_KEY);
      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          JOBS_QUERY_KEY,
          previousJobs.filter((job): job is Job => job.jobID !== jobId)
        );
      }
      return { previousJobs };
    },

    onError: (_error, _jobId, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, context.previousJobs);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
  });
}

/**
 * Bulk delete jobs by status (e.g., delete all "Completed" jobs).
 */
export function useDeleteJobsByStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: JobStatus) => jobsService.deleteJobsByStatus(status),

    onMutate: async (status) => {
      await queryClient.cancelQueries({ queryKey: JOBS_QUERY_KEY });

      const previousJobs = queryClient.getQueryData<Job[]>(JOBS_QUERY_KEY);
      if (previousJobs) {
        queryClient.setQueryData<Job[]>(
          JOBS_QUERY_KEY,
          previousJobs.filter((job): job is Job => job.status !== status)
        );
      }
      return { previousJobs };
    },

    onError: (_error, _status, context) => {
      if (context?.previousJobs) {
        queryClient.setQueryData(JOBS_QUERY_KEY, context.previousJobs);
      }
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY }),
  });
}

/**
 * Attach the mock "server push" listener to React Query's cache.
 * This simulates real-time updates by applying job progress changes as events arrive.
 * Call this **once** at a high level (e.g., in App.tsx after queryClient is created).
 */


// Prevent duplicate listeners per QueryClient (StrictMode safe)
const attachedClients = new WeakSet<QueryClient>();

export function attachRealtimeToQueryClient(queryClient: QueryClient) {
  if (attachedClients.has(queryClient)) return () => {};
  attachedClients.add(queryClient);

  const handleUpdate = ({ jobID, status, progress }: { jobID: string; status: JobStatus; progress: number }) => {
    queryClient.setQueryData<Job[]>(JOBS_QUERY_KEY, (prev) => {
      if (!prev) return prev;

      const idx = prev.findIndex((j) => j.jobID === jobID);
      if (idx === -1) return prev;

      const current = prev[idx];
      const completedAt =
        status === JobStatus.Completed || status === JobStatus.Failed
          ? Date.now()
          : current.completedAt;

      // No-op if nothing changed to avoid extra renders
      if (current.status === status && current.progress === progress && current.completedAt === completedAt) {
        return prev;
      }

      const next = prev.slice();
      next[idx] = { ...current, status, progress, completedAt };
      return next;
    });
  };

  if (USE_MOCK) {
    // Mock event bus
    mockBus.on('UpdateJobProgress', handleUpdate);
    return () => {
      mockBus.off('UpdateJobProgress', handleUpdate);
      attachedClients.delete(queryClient);
    };
  } else {
    // Real SignalR
    void startSignalR(handleUpdate); // fire-and-forget connect
    return () => {
      void stopSignalR();
      attachedClients.delete(queryClient);
    };
  }
}

