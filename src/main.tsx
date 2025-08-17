import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import SingleModalProvider from './modal/SingleModalProvider';
import './i18n';                // <-- init i18n
import DirectionProvider from './i18n/DirectionProvider';
import RealtimeBridge from './RealtimeBridge';
import './styles/main.scss';

const queryClient = new QueryClient({
  defaultOptions: { 
    queries: { 
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query failed:', error);
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation failed:', error);
      }
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SingleModalProvider>
      <DirectionProvider>
        <RealtimeBridge />
        <App />
      </DirectionProvider>
      </SingleModalProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
