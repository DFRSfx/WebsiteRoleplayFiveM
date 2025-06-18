import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import StorePage from './pages/StorePage';
import StaffApplicationPage from './pages/StaffApplicationPage';
import CandidaturesPage from './pages/CandidaturesPage';
import LoginPage from './pages/LoginPage';
import JobApplicationPage from './pages/JobApplicationPage';
import OrganizationsPage from './pages/OrganizationsPage';
import OrganizationApplicationPage from './pages/OrganizationApplicationPage';
import ApplicationsManagementPage from './pages/ApplicationsManagementPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="loja" element={<StorePage />} />
        <Route path="organizacoes" element={<OrganizationsPage />} />
        <Route path="organizacoes/:slug" element={<OrganizationApplicationPage />} />
        <Route path="organizacoes/:slug/candidatar" element={<OrganizationApplicationPage />} />
        <Route path="candidaturas-staff" element={<StaffApplicationPage />} />
        <Route path="candidaturas" element={<CandidaturesPage />} />
        <Route path="gestao-candidaturas" element={<ApplicationsManagementPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="entrar" element={<LoginPage />} />
        <Route path="empregos" element={<JobApplicationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;