import mitt from 'mitt';
import type { JobStatus } from '../../types';

type Events = {
  UpdateJobProgress: { jobID: string; status: JobStatus; progress: number };
};

export const mockBus = mitt<Events>();
