import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import AdminUserManagement from './pages/admin/AdminUserManagement';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { loading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Rotas públicas */}
        <Route index element={<HomePage />} />
        <Route path="loja" element={<StorePage />} />
        <Route path="organizacoes" element={<OrganizationsPage />} />
        <Route path="organizacoes/:slug" element={<OrganizationApplicationPage />} />
        <Route path="organizacoes/:slug/candidatar" element={<OrganizationApplicationPage />} />
        <Route path="candidaturas-staff" element={<StaffApplicationPage />} />
        <Route path="candidaturas" element={<CandidaturesPage />} />
        <Route path="empregos" element={<JobApplicationPage />} />

        {/* Rota de login (redireciona se já estiver logado) */}
        <Route
          path="entrar"
          element={
            <ProtectedRoute requireAuth={false} redirectTo="/">
              <LoginPage />
            </ProtectedRoute>
          }
        />

        {/* Rotas protegidas - requerem login */}
        <Route
          path="gestao-candidaturas"
          element={
            <ProtectedRoute requireRole="moderator">
              <ApplicationsManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Rotas de administração - requerem role admin */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin/utilizadores"
          element={
            <ProtectedRoute requireRole="admin">
              <AdminUserManagement />
            </ProtectedRoute>
          }
        />

        {/* Rota 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;