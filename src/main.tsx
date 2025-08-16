import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import SingleModalProvider from './modal/SingleModalProvider';
import RealtimeBridge from './RealtimeBridge';
import './styles/main.scss';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SingleModalProvider>
        <RealtimeBridge />
        <App />
      </SingleModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
