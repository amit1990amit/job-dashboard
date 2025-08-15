import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockJobsService, mockBus } from './index';
import { JobStatus } from '../types';
import type { CreateJobRequest, Job } from '../types';

const service = new MockJobsService();

const KEY = ['jobs'] as const;

export function useJobsQuery() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => service.getJobs(),
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJobRequest) => service.createJob(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useStopJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.stopJob(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Job[]>(KEY);
      if (prev) {
        qc.setQueryData<Job[]>(KEY, prev.map((j): Job => (
          j.jobID === id && (j.status === JobStatus.Running || j.status === JobStatus.InQueue)
            ? { ...j, status: JobStatus.Stopped }
            : j
        )));
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(KEY, ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRestartJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.restartJob(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Job[]>(KEY);
      if (prev) {
        qc.setQueryData<Job[]>(KEY, prev.map((j): Job => (
          j.jobID === id
            ? { ...j, status: JobStatus.InQueue, progress: 0, completedAt: undefined, errorMessage: undefined }
            : j
        )));
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(KEY, ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => service.deleteJob(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Job[]>(KEY);
      if (prev) {
        qc.setQueryData<Job[]>(KEY, prev.filter((j): j is Job => j.jobID !== id));
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(KEY, ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteJobsByStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: JobStatus) => service.deleteJobsByStatus(status),
    onMutate: async (status) => {
      await qc.cancelQueries({ queryKey: KEY });
      const prev = qc.getQueryData<Job[]>(KEY);
      if (prev) {
        qc.setQueryData<Job[]>(KEY, prev.filter((j): j is Job => j.status !== status));
      }
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(KEY, ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

/** Bridge server-push -> React Query cache (call once high in the tree) */
export function attachMockRealtimeToQueryClient(qc: ReturnType<typeof useQueryClient>) {
  mockBus.on('UpdateJobProgress', ({ jobID, status, progress }) => {
    qc.setQueryData<Job[]>(KEY, (prev) => {
      if (!prev) return prev;
      return prev.map((j): Job => {
        if (j.jobID !== jobID) return j;

        const completedAt =
          status === JobStatus.Completed || status === JobStatus.Failed
            ? Date.now()
            : j.completedAt;

        // return a concrete Job (no conditional spreads)
        return {
          ...j,
          status,
          progress,
          completedAt,
        };
      });
    });
  });
}
