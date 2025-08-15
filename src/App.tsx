import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JobsDashboard from './pages/JobsDashboard';
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JobsDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

