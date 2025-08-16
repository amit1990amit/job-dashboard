import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUB } from '../config';
import type { JobStatus } from '../types';

let connection: signalR.HubConnection | null = null;

// Shape of the update messages we expect from the backend SignalR hub
type UpdatePayload = { jobID: string; status: JobStatus; progress: number };

/**
 * Establishes a SignalR connection to the backend hub and subscribes to the
 * "UpdateJobProgress" event, which the backend emits when job status or progress changes.
 *
 * @param onUpdate - callback to run whenever a job update is received
 */
export async function startSignalR(onUpdate: (u: UpdatePayload) => void) {
  // If a connection is already active, don't create another one (idempotent start)
  if (connection) return;

  // Build a new SignalR connection instance
  connection = new signalR.HubConnectionBuilder()
    .withUrl(SIGNALR_HUB)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information) // Optional: log connection events to console
    .build();

  // Register an event handler for the "UpdateJobProgress" message
  // This event name must match exactly what the backend SignalR hub sends
  connection.on('UpdateJobProgress', (payload: UpdatePayload) => onUpdate(payload));

  await connection.start();
}

/**
 * Gracefully stops the SignalR connection if it's running.
 * Cleans up the singleton so it can be restarted later.
 */
export async function stopSignalR() {
  if (!connection) return; // Nothing to stop if not connected
  try {
    await connection.stop();
  } finally {
    connection = null; // Clear reference so startSignalR can be called again
  }
}
