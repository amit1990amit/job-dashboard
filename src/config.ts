export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
export const SIGNALR_HUB = String(import.meta.env.VITE_SIGNALR_HUB || 'https://localhost:5001/JobSignalRHub');
export const API_BASE = String(import.meta.env.VITE_API_BASE || '');

