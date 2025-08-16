import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { attachRealtimeToQueryClient } from './services/useJobs';

export default function RealtimeBridge() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const detach = attachRealtimeToQueryClient(queryClient);
    return detach;
  }, [queryClient]);
  return null;
}
