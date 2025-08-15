import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SingleModalProvider from './modal/SingleModalProvider';
import './styles/main.scss';
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SingleModalProvider>
        <App />
      </SingleModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
