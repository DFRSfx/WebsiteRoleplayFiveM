// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Building2,
    Users,
    FileText,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Search,
    Filter,
    Calendar,
    TrendingUp,
    UserCheck,
    UserX
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrganizations } from '../../contexts/OrganizationContext';
import { formatDate } from '../../utils/formatters';

const AdminDashboard: React.FC = () => {
    const { isLoggedIn, user } = useAuth();
    const { organizations, applications, updateOrganization, addOrganization, updateApplicationStatus } = useOrganizations();
    const [activeTab, setActiveTab] = useState<'overview' | 'organizations' | 'applications' | 'users'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateOrgModal, setShowCreateOrgModal] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<any>(null);
    const [selectedApp, setSelectedApp] = useState<any>(null);

    // Verificar se é admin
    if (!isLoggedIn) {
        return (
            <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Settings className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
                    <p className="text-gray-400 mb-4">Precisa de permissões de administrador.</p>
                    <button
                        onClick={() => window.location.href = '/entrar'}
                        className="btn btn-primary"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    // Estatísticas
    const stats = {
        totalOrgs: organizations.length,
        activeOrgs: organizations.filter(org => org.ativo).length,
        totalApps: applications.length,
        pendingApps: applications.filter(app => app.estado === 'pendente').length,
        approvedApps: applications.filter(app => app.estado === 'aprovada').length,
        rejectedApps: applications.filter(app => app.estado === 'rejeitada').length,
        recentApps: applications.filter(app => {
            const daysDiff = (Date.now() - new Date(app.createdAt).getTime()) / (1000 * 3600 * 24);
            return daysDiff <= 7;
        }).length
    };

    return (
        <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Painel de Administração
                            </h1>
                            <p className="text-gray-400">
                                Bem-vindo de volta, {user?.username || 'Administrador'}
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900 text-green-300">
                                <UserCheck className="h-4 w-4 mr-1" />
                                Online
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap gap-2 bg-gray-800 p-2 rounded-lg">
                        {[
                            { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                            { id: 'organizations', label: 'Organizações', icon: Building2 },
                            { id: 'applications', label: 'Candidaturas', icon: FileText },
                            { id: 'users', label: 'Utilizadores', icon: Users }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === tab.id
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                                    }`}
                            >
                                <tab.icon className="h-4 w-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatsCard
                                    title="Total Organizações"
                                    value={stats.totalOrgs}
                                    subtitle={`${stats.activeOrgs} ativas`}
                                    icon={Building2}
                                    color="blue"
                                />
                                <StatsCard
                                    title="Candidaturas Pendentes"
                                    value={stats.pendingApps}
                                    subtitle={`${stats.recentApps} esta semana`}
                                    icon={Clock}
                                    color="yellow"
                                />
                                <StatsCard
                                    title="Candidaturas Aprovadas"
                                    value={stats.approvedApps}
                                    subtitle={`${Math.round((stats.approvedApps / stats.totalApps) * 100) || 0}% do total`}
                                    icon={CheckCircle}
                                    color="green"
                                />
                                <StatsCard
                                    title="Total Candidaturas"
                                    value={stats.totalApps}
                                    subtitle={`${stats.rejectedApps} rejeitadas`}
                                    icon={FileText}
                                    color="purple"
                                />
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <RecentApplications applications={applications.slice(0, 5)} organizations={organizations} />
                                <QuickActions
                                    onCreateOrg={() => setShowCreateOrgModal(true)}
                                    pendingCount={stats.pendingApps}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Organizations Tab */}
                    {activeTab === 'organizations' && (
                        <OrganizationsTab
                            organizations={organizations}
                            onEdit={setSelectedOrg}
                            onToggle={(id) => {
                                const org = organizations.find(o => o.id === id);
                                if (org) {
                                    updateOrganization(id, { ativo: !org.ativo });
                                }
                            }}
                            onCreate={() => setShowCreateOrgModal(true)}
                        />
                    )}

                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <ApplicationsTab
                            applications={applications}
                            organizations={organizations}
                            onView={setSelectedApp}
                            onUpdateStatus={updateApplicationStatus}
                        />
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <UsersTab />
                    )}
                </div>
            </div>

            {/* Modals */}
            {showCreateOrgModal && (
                <CreateOrganizationModal
                    onClose={() => setShowCreateOrgModal(false)}
                    onSubmit={(orgData) => {
                        addOrganization(orgData);
                        setShowCreateOrgModal(false);
                    }}
                />
            )}

            {selectedOrg && (
                <EditOrganizationModal
                    organization={selectedOrg}
                    onClose={() => setSelectedOrg(null)}
                    onSubmit={(updates) => {
                        updateOrganization(selectedOrg.id, updates);
                        setSelectedOrg(null);
                    }}
                />
            )}

            {selectedApp && (
                <ApplicationDetailModal
                    application={selectedApp}
                    organization={organizations.find(o => o.id === selectedApp.organizacaoId)}
                    onClose={() => setSelectedApp(null)}
                    onStatusChange={(status, notas) => {
                        updateApplicationStatus(selectedApp.id, status, notas);
                        setSelectedApp(null);
                    }}
                />
            )}
        </div>
    );
};

// Stats Card Component
const StatsCard: React.FC<{
    title: string;
    value: number;
    subtitle: string;
    icon: any;
    color: string;
}> = ({ title, value, subtitle, icon: Icon, color }) => {
    const colorClasses = {
        blue: 'border-blue-500 text-blue-400',
        yellow: 'border-yellow-500 text-yellow-400',
        green: 'border-green-500 text-green-400',
        purple: 'border-purple-500 text-purple-400',
        red: 'border-red-500 text-red-400'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gray-800 p-6 rounded-lg border-t-4 ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-400 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{value}</p>
                    <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
                </div>
                <Icon className={`h-8 w-8 ${colorClasses[color as keyof typeof colorClasses]}`} />
            </div>
        </motion.div>
    );
};

// Recent Applications Component
const RecentApplications: React.FC<{
    applications: any[];
    organizations: any[];
}> = ({ applications, organizations }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Candidaturas Recentes
            </h3>
            <div className="space-y-3">
                {applications.length === 0 ? (
                    <p className="text-gray-400 text-sm">Nenhuma candidatura recente</p>
                ) : (
                    applications.map((app) => {
                        const org = organizations.find(o => o.id === app.organizacaoId);
                        return (
                            <div key={app.id} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                                <div>
                                    <p className="text-white font-medium">{app.nomePersonagem}</p>
                                    <p className="text-gray-400 text-sm">{org?.nome}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${app.estado === 'pendente' ? 'bg-yellow-900 text-yellow-300' :
                                    app.estado === 'aprovada' ? 'bg-green-900 text-green-300' :
                                        'bg-red-900 text-red-300'
                                    }`}>
                                    {app.estado}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

// Quick Actions Component
const QuickActions: React.FC<{
    onCreateOrg: () => void;
    pendingCount: number;
}> = ({ onCreateOrg, pendingCount }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Ações Rápidas
            </h3>
            <div className="space-y-3">
                <button
                    onClick={onCreateOrg}
                    className="w-full btn btn-primary flex items-center justify-center"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Organização
                </button>

                <button
                    onClick={() => window.location.href = '/gestao-candidaturas'}
                    className="w-full btn btn-secondary flex items-center justify-center"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Candidaturas ({pendingCount})
                </button>

                <button className="w-full btn btn-outline flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatórios
                </button>
            </div>
        </div>
    );
};

// Organizations Tab Component
const OrganizationsTab: React.FC<{
    organizations: any[];
    onEdit: (org: any) => void;
    onToggle: (id: string) => void;
    onCreate: () => void;
}> = ({ organizations, onEdit, onToggle, onCreate }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Gerir Organizações</h2>
                <button onClick={onCreate} className="btn btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Organização
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {organizations.map((org) => (
                    <div key={org.id} className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center mr-3"
                                    style={{ backgroundColor: org.corHex }}
                                >
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">{org.nome}</h3>
                                    <p className="text-gray-400 text-sm">{org.slug}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${org.ativo ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                }`}>
                                {org.ativo ? 'Ativa' : 'Inativa'}
                            </span>
                        </div>

                        <p className="text-gray-400 text-sm mb-4">{org.descricao}</p>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => onEdit(org)}
                                className="btn btn-secondary text-sm flex-1"
                            >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                            </button>
                            <button
                                onClick={() => onToggle(org.id)}
                                className={`btn text-sm flex-1 ${org.ativo ? 'btn-outline' : 'btn-primary'
                                    }`}
                            >
                                {org.ativo ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// Applications Tab Component
const ApplicationsTab: React.FC<{
    applications: any[];
    organizations: any[];
    onView: (app: any) => void;
    onUpdateStatus: (id: string, status: string, notas?: string) => void;
}> = ({ applications, organizations, onView }) => {
    const [filter, setFilter] = useState('all');

    const filteredApps = applications.filter(app => {
        if (filter === 'all') return true;
        return app.estado === filter;
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <h2 className="text-xl font-bold text-white mb-4 sm:mb-0">Gerir Candidaturas</h2>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input w-full sm:w-auto"
                >
                    <option value="all">Todas</option>
                    <option value="pendente">Pendentes</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovada">Aprovadas</option>
                    <option value="rejeitada">Rejeitadas</option>
                </select>
            </div>

            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Candidato
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Organização
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Data
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredApps.map((app) => {
                                const org = organizations.find(o => o.id === app.organizacaoId);
                                return (
                                    <tr key={app.id} className="hover:bg-gray-700">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-white">
                                                    {app.nomePersonagem}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {app.nomeJogador}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-white">{org?.nome}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${app.estado === 'pendente' ? 'bg-yellow-900 text-yellow-300' :
                                                app.estado === 'aprovada' ? 'bg-green-900 text-green-300' :
                                                    app.estado === 'rejeitada' ? 'bg-red-900 text-red-300' :
                                                        'bg-blue-900 text-blue-300'
                                                }`}>
                                                {app.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {formatDate(app.createdAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => onView(app)}
                                                className="text-blue-400 hover:text-blue-300 text-sm"
                                            >
                                                Ver Detalhes
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};


// Create Organization Modal
const CreateOrganizationModal: React.FC<{
    onClose: () => void;
    onSubmit: (data: any) => void;
}> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        corHex: '#0066cc',
        icone: 'building',
        requisitos: [''],
        beneficios: ['']
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const slug = formData.nome.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .replace(/\s+/g, '-');

        onSubmit({
            ...formData,
            slug,
            requisitos: formData.requisitos.filter(r => r.trim()),
            beneficios: formData.beneficios.filter(b => b.trim()),
            aceitaCandidaturas: true,
            ativo: true
        });
    };

    const addField = (field: 'requisitos' | 'beneficios') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeField = (field: 'requisitos' | 'beneficios', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateField = (field: 'requisitos' | 'beneficios', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Nova Organização</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Nome *</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2">Cor</label>
                                <input
                                    type="color"
                                    value={formData.corHex}
                                    onChange={(e) => setFormData(prev => ({ ...prev, corHex: e.target.value }))}
                                    className="input h-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Descrição</label>
                            <textarea
                                value={formData.descricao}
                                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                className="input min-h-[80px]"
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">Requisitos</label>
                            {formData.requisitos.map((req, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => updateField('requisitos', index, e.target.value)}
                                        className="input flex-1"
                                        placeholder="Requisito..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeField('requisitos', index)}
                                        className="btn btn-secondary px-3"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('requisitos')}
                                className="btn btn-secondary text-sm"
                            >
                                + Adicionar Requisito
                            </button>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Benefícios</label>
                            {formData.beneficios.map((ben, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={ben}
                                        onChange={(e) => updateField('beneficios', index, e.target.value)}
                                        className="input flex-1"
                                        placeholder="Benefício..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeField('beneficios', index)}
                                        className="btn btn-secondary px-3"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('beneficios')}
                                className="btn btn-secondary text-sm"
                            >
                                + Adicionar Benefício
                            </button>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Criar Organização
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Edit Organization Modal (versão completa)
const EditOrganizationModal: React.FC<{
    organization: any;
    onClose: () => void;
    onSubmit: (data: any) => void;
}> = ({ organization, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        nome: organization.nome,
        descricao: organization.descricao,
        corHex: organization.corHex,
        icone: organization.icone,
        requisitos: [...organization.requisitos],
        beneficios: [...organization.beneficios],
        aceitaCandidaturas: organization.aceitaCandidaturas
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const addField = (field: 'requisitos' | 'beneficios') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeField = (field: 'requisitos' | 'beneficios', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateField = (field: 'requisitos' | 'beneficios', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Editar Organização</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Nome *</label>
                                <input
                                    type="text"
                                    value={formData.nome}
                                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                                    className="input"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2">Cor</label>
                                <input
                                    type="color"
                                    value={formData.corHex}
                                    onChange={(e) => setFormData(prev => ({ ...prev, corHex: e.target.value }))}
                                    className="input h-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Descrição</label>
                            <textarea
                                value={formData.descricao}
                                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                                className="input min-h-[80px]"
                                placeholder="Descrição da organização..."
                            />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="aceitaCandidaturas"
                                checked={formData.aceitaCandidaturas}
                                onChange={(e) => setFormData(prev => ({ ...prev, aceitaCandidaturas: e.target.checked }))}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <label htmlFor="aceitaCandidaturas" className="ml-2 text-white">
                                Aceitar candidaturas
                            </label>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Requisitos</label>
                            {formData.requisitos.map((req, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={req}
                                        onChange={(e) => updateField('requisitos', index, e.target.value)}
                                        className="input flex-1"
                                        placeholder="Requisito..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeField('requisitos', index)}
                                        className="btn btn-secondary px-3"
                                        disabled={formData.requisitos.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('requisitos')}
                                className="btn btn-secondary text-sm"
                            >
                                + Adicionar Requisito
                            </button>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Benefícios</label>
                            {formData.beneficios.map((ben, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={ben}
                                        onChange={(e) => updateField('beneficios', index, e.target.value)}
                                        className="input flex-1"
                                        placeholder="Benefício..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeField('beneficios', index)}
                                        className="btn btn-secondary px-3"
                                        disabled={formData.beneficios.length === 1}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addField('beneficios')}
                                className="btn btn-secondary text-sm"
                            >
                                + Adicionar Benefício
                            </button>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Guardar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Users Tab - Versão mais completa
const UsersTab: React.FC = () => {
    const [users] = useState([
        {
            id: '1',
            username: 'admin',
            email: 'admin@enigmarp.com',
            role: 'admin',
            lastLogin: new Date(),
            active: true
        },
        {
            id: '2',
            username: 'moderador1',
            email: 'mod@enigmarp.com',
            role: 'moderator',
            lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            active: true
        },
        {
            id: '3',
            username: 'chefe_policia',
            email: 'policia@enigmarp.com',
            role: 'chefe_organizacao',
            lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            active: true
        }
    ]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Gerir Utilizadores</h2>
                <button className="btn btn-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Utilizador
                </button>
            </div>

            {/* Stats Cards for Users */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Utilizadores</p>
                            <p className="text-xl font-bold text-white">{users.length}</p>
                        </div>
                        <Users className="h-6 w-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Ativos</p>
                            <p className="text-xl font-bold text-white">{users.filter(u => u.active).length}</p>
                        </div>
                        <UserCheck className="h-6 w-6 text-green-500" />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Administradores</p>
                            <p className="text-xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
                        </div>
                        <Settings className="h-6 w-6 text-purple-500" />
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Chefes de Org.</p>
                            <p className="text-xl font-bold text-white">{users.filter(u => u.role === 'chefe_organizacao').length}</p>
                        </div>
                        <Building2 className="h-6 w-6 text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <h3 className="text-lg font-semibold text-white mb-4 sm:mb-0">
                            Lista de Utilizadores
                        </h3>
                        <div className="flex space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar utilizadores..."
                                    className="input pl-10 w-full sm:w-64"
                                />
                            </div>
                            <select className="input">
                                <option value="all">Todos os tipos</option>
                                <option value="admin">Administradores</option>
                                <option value="moderator">Moderadores</option>
                                <option value="chefe_organizacao">Chefes de Organização</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Utilizador
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Último Login
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-700">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-white">
                                                {user.username}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {user.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-900 text-purple-300' :
                                            user.role === 'moderator' ? 'bg-blue-900 text-blue-300' :
                                                user.role === 'chefe_organizacao' ? 'bg-orange-900 text-orange-300' :
                                                    'bg-gray-900 text-gray-300'
                                            }`}>
                                            {user.role === 'admin' ? 'Administrador' :
                                                user.role === 'moderator' ? 'Moderador' :
                                                    user.role === 'chefe_organizacao' ? 'Chefe de Org.' :
                                                        'Utilizador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(user.lastLogin)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                                            }`}>
                                            {user.active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex space-x-2">
                                            <button className="text-blue-400 hover:text-blue-300">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Future Development Notice */}
            <div className="bg-blue-900 bg-opacity-50 border border-blue-700 rounded-lg p-4">
                <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-blue-400 mr-2" />
                    <div>
                        <h4 className="text-blue-300 font-medium">Funcionalidade em Desenvolvimento</h4>
                        <p className="text-blue-200 text-sm mt-1">
                            A gestão completa de utilizadores estará disponível numa próxima atualização.
                            Atualmente é possível visualizar utilizadores existentes.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;