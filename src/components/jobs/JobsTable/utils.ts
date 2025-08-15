export const formatTime = (ts: number) => {
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '—';
  }
};
