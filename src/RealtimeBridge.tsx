import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { attachMockRealtimeToQueryClient } from './services/useJobs';

export default function RealtimeBridge() {
  const qc = useQueryClient();
  useEffect(() => { attachMockRealtimeToQueryClient(qc); }, [qc]);
  return null;
}
