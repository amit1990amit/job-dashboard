import { USE_MOCK } from '../config';
import { MockJobsService, mockBus } from './mock';
import { RealJobsService } from './real/RealJobsService';
import { startSignalR, stopSignalR } from './signalRClient';
import type { Job, JobStatus } from '../types';
import type { QueryClient } from '@tanstack/react-query';

export const service = USE_MOCK ? new MockJobsService() : new RealJobsService();

/**
 * We may mount the realtime-attachment component in StrictMode (mount/unmount twice).
 * Use a WeakSet so we only attach one listener per QueryClient and avoid duplicates.
 */
const attached = new WeakSet<QueryClient>();

/**
 * attachRealtime(queryClient)
 *
 * Subscribes to job progress updates and writes them directly into the React Query cache.
 * - In mock mode: listens to the local mockBus ("UpdateJobProgress" events)
 * - In real mode: connects to the SignalR hub and listens to the same event name
 *
 * Returns a cleanup function that detaches the listener / closes the connection.
 */
export function attachRealtime(queryClient: QueryClient) {
  // No-op if this client is already wired (StrictMode-safe)
  if (attached.has(queryClient)) return () => {};
  attached.add(queryClient);

  if (USE_MOCK) {
    // --- MOCK MODE: subscribe to the in-memory event bus ---
    const handler = ({
      jobID,
      status,
      progress,
    }: {
      jobID: string;
      status: JobStatus;
      progress: number;
    }) => {
      queryClient.setQueryData<Job[]>(['jobs'], (prev) => {
        if (!prev) return prev;

        // Update only the single changed job to avoid re-rendering the entire table
        const index = prev.findIndex((j) => j.jobID === jobID);
        if (index === -1) return prev;

        const currentJob = prev[index];
        const completedAt =
          status === 3 || status === 4 /* Completed or Failed */ ? Date.now() : currentJob.completedAt;

        // If nothing actually changed, return the same array reference to skip renders
        if (
          currentJob.status === status &&
          currentJob.progress === progress &&
          currentJob.completedAt === completedAt
        ) {
          return prev;
        }

        // Shallow-copy array and replace just the updated item
        const next = prev.slice();
        next[index] = { ...currentJob, status, progress, completedAt };
        return next;
      });
    };

    mockBus.on('UpdateJobProgress', handler);

    // Cleanup for unmount / StrictMode remounts
    return () => {
      mockBus.off('UpdateJobProgress', handler);
      attached.delete(queryClient);
    };
  } else {
    // --- REAL MODE: connect to SignalR and subscribe to the same event ---
    startSignalR(({ jobID, status, progress }) => {
      queryClient.setQueryData<Job[]>(['jobs'], (prev) => {
        if (!prev) return prev;

        const index = prev.findIndex((j) => j.jobID === jobID);
        if (index === -1) return prev;

        const currentJob = prev[index];
        const completedAt =
          status === 3 || status === 4 /* Completed or Failed */ ? Date.now() : currentJob.completedAt;

        if (
          currentJob.status === status &&
          currentJob.progress === progress &&
          currentJob.completedAt === completedAt
        ) {
          return prev;
        }

        const next = prev.slice();
        next[index] = { ...currentJob, status, progress, completedAt };
        return next;
      });
    });

    // Cleanup closes the SignalR connection and clears the guard
    return () => {
      stopSignalR();
      attached.delete(queryClient);
    };
  }
}
