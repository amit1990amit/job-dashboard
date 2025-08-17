# ⚡ Job Management Dashboard (React + TS + Vite)

A frontend for creating, monitoring, and managing “jobs” with live progress.  
Runs in **two modes**:

- **Mock mode** – in-memory data + simulated real-time updates (no backend needed)
- **Real mode** – uses your backend **REST API** + **SignalR** hub for real-time

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js**: Recommended version **21.7.1** (or higher in the Node 21.x line).  
  Check your version with:
  ```bash
  node -v
---

## setup 
npm install
npm run dev

## ✨ Features

- Job list with **search**, **filter by status**, and **sorting**
- **Create / Stop / Restart / Delete** (with confirm popups)
- **Bulk delete** by status (Completed / Failed)
- **Real-time** progress updates (mock bus or SignalR)
- **React Query** caching + optimistic updates
- **TypeScript** + **SCSS**

---

## 🔄 Switching Between Mock and Real Backends

The app chooses its data source at runtime using **Vite env variables**.

### 1) Set the mode in `.env`

Create (or edit) a `.env` in the project root:

```env
# --- MODE TOGGLE ---
# true  = run with in-memory mock data and a mock realtime event bus
# false = connect to a real REST API and a SignalR hub
VITE_USE_MOCK=true

# --- REAL MODE ENDPOINTS (required only if VITE_USE_MOCK=false) ---
# Base URL for the REST API (e.g., https://localhost:5001)
VITE_API_BASE=https://localhost:5001

# SignalR hub URL (e.g., https://localhost:5001/JobSignalRHub)
VITE_SIGNALR_HUB=https://localhost:5001/JobSignalRHub
