import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import StaffApplicationPage from './pages/StaffApplicationPage';
import CandidaturesPage from './pages/CandidaturesPage';
import LoginPage from './pages/LoginPage';
import JobApplicationPage from './pages/JobApplicationPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="store" element={<StorePage />} />
        <Route path="staff-application" element={<StaffApplicationPage />} />
        <Route path="candidatures" element={<CandidaturesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="job-application" element={<JobApplicationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;