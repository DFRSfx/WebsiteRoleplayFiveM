import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Shield, Lock } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireRole?: 'user' | 'chefe_organizacao' | 'moderator' | 'admin';
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    requireRole,
    redirectTo = '/entrar'
}) => {
    const { isLoggedIn, user, loading, hasRole } = useAuth();
    const location = useLocation();

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return <LoadingSpinner />;
    }

    // Se não requer autenticação mas o utilizador está logado, redirecionar
    if (!requireAuth && isLoggedIn) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Se requer autenticação mas o utilizador não está logado
    if (requireAuth && !isLoggedIn) {
        return <Navigate to="/entrar" state={{ from: location }} replace />;
    }

    // Se requer um role específico
    if (requireRole && (!user || !hasRole(requireRole))) {
        return (
            <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-gray-800 rounded-lg p-8">
                        <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6">
                            <Lock className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-4">
                            Acesso Restrito
                        </h1>

                        <p className="text-gray-400 mb-6">
                            Não tem permissões suficientes para aceder a esta página.
                            {requireRole === 'admin' && ' É necessário ser administrador.'}
                            {requireRole === 'moderator' && ' É necessário ser moderador ou superior.'}
                            {requireRole === 'chefe_organizacao' && ' É necessário ser chefe de organização ou superior.'}
                        </p>

                        <div className="space-y-3">
                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Seu role atual:</span>
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-blue-400" />
                                        <span className="text-white capitalize">
                                            {user?.role === 'chefe_organizacao' ? 'Chefe de Organização' :
                                                user?.role === 'moderator' ? 'Moderador' :
                                                    user?.role === 'admin' ? 'Administrador' : 'Utilizador'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-400">Role necessário:</span>
                                    <div className="flex items-center">
                                        <Shield className="h-4 w-4 mr-2 text-red-400" />
                                        <span className="text-white capitalize">
                                            {requireRole === 'chefe_organizacao' ? 'Chefe de Organização' :
                                                requireRole === 'moderator' ? 'Moderador' :
                                                    requireRole === 'admin' ? 'Administrador' : 'Utilizador'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2">
                            <button
                                onClick={() => window.history.back()}
                                className="btn btn-secondary w-full"
                            >
                                Voltar
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="btn btn-primary w-full"
                            >
                                Ir para Início
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            Se acha que isto é um erro, contacte um administrador.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Se passou todas as verificações, mostrar o conteúdo
    return <>{children}</>;
};

export default ProtectedRoute;