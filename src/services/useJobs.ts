import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { MockJobsService, mockBus } from './index';
import { JobStatus } from '../types';
import type { CreateJobRequest, Job } from '../types';

/** Service instance simulating API calls */
const jobsService = new MockJobsService();

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

// export function attachMockRealtimeToQueryClient(
//   queryClient: ReturnType<typeof useQueryClient>
// ) {
//   mockBus.on('UpdateJobProgress', ({ jobID, status, progress }) => {
//     queryClient.setQueryData<Job[]>(JOBS_QUERY_KEY, (previousJobs) => {
//       if (!previousJobs) return previousJobs;

//       return previousJobs.map((job): Job => {
//         if (job.jobID !== jobID) return job;

//         const completedAt =
//           status === JobStatus.Completed || status === JobStatus.Failed
//             ? Date.now()
//             : job.completedAt;

//         return {
//           ...job,
//           status,
//           progress,
//           completedAt,
//         };
//       });
//     });
//   });
// }
const attachedClients = new WeakSet<QueryClient>();

export function attachMockRealtimeToQueryClient(queryClient: QueryClient) {
  if (attachedClients.has(queryClient)) {
    // already attached for this client; no-op and return a noop cleanup
    return () => {};
  }
  attachedClients.add(queryClient);

  const handler = ({ jobID, status, progress }: { jobID: string; status: JobStatus; progress: number }) => {
    queryClient.setQueryData<Job[]>(JOBS_QUERY_KEY, (prev) => {
      if (!prev) return prev;

      // find the job index once (avoid mapping full array)
      const idx = prev.findIndex((j) => j.jobID === jobID);
      if (idx === -1) return prev;

      const target = prev[idx];
      const completedAt =
        status === JobStatus.Completed || status === JobStatus.Failed
          ? Date.now()
          : target.completedAt;

      // If nothing actually changed, return the same reference to avoid re-renders
      if (target.status === status && target.progress === progress && target.completedAt === completedAt) {
        return prev;
      }

      // shallow-copy the array and replace the single changed element
      const next = prev.slice();
      next[idx] = { ...target, status, progress, completedAt };
      return next;
    });
  };

  mockBus.on('UpdateJobProgress', handler);

  // Provide cleanup to avoid leaks / duplicate handlers (StrictMode-safe)
  return () => {
    mockBus.off('UpdateJobProgress', handler);
    attachedClients.delete(queryClient);
  };
}
