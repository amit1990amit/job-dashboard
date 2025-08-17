import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SingleModalProvider from './modal/SingleModalProvider';
import DirectionProvider from './i18n/DirectionProvider';
import RealtimeBridge from './RealtimeBridge';
import JobsDashboard from './pages/JobsDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query failed:', error);
      },
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again later.</div>}>
      <QueryClientProvider client={queryClient}>
        <SingleModalProvider>
          <DirectionProvider>
            <RealtimeBridge />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<JobsDashboard />} />
              </Routes>
            </BrowserRouter>
          </DirectionProvider>
        </SingleModalProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

