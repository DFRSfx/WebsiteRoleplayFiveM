// src/pages/ApplicationsManagementPage.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Users,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Search,
    Filter,
    Calendar,
    Mail,
    MessageSquare
} from 'lucide-react';
import { useOrganizations } from '../contexts/OrganizationContext';
import { useAuth } from '../contexts/AuthContext';
import { formatDate } from '../utils/formatters';

const ApplicationsManagementPage: React.FC = () => {
    const { organizations, applications, updateApplicationStatus } = useOrganizations();
    const { isLoggedIn } = useAuth();
    const [selectedOrg, setSelectedOrg] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<any>(null);

    // Filtrar candidaturas
    const filteredApplications = useMemo(() => {
        return applications.filter(app => {
            const org = organizations.find(o => o.id === app.organizacaoId);
            if (!org) return false;

            const matchesOrg = selectedOrg === 'all' || app.organizacaoId === selectedOrg;
            const matchesStatus = selectedStatus === 'all' || app.estado === selectedStatus;
            const matchesSearch =
                app.nomePersonagem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.nomeJogador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                org.nome.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesOrg && matchesStatus && matchesSearch;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [applications, organizations, selectedOrg, selectedStatus, searchTerm]);

    // Estatísticas
    const stats = useMemo(() => {
        return {
            total: applications.length,
            pendentes: applications.filter(a => a.estado === 'pendente').length,
            aprovadas: applications.filter(a => a.estado === 'aprovada').length,
            rejeitadas: applications.filter(a => a.estado === 'rejeitada').length,
            emAnalise: applications.filter(a => a.estado === 'em_analise').length
        };
    }, [applications]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aprovada': return 'text-green-400 bg-green-900';
            case 'rejeitada': return 'text-red-400 bg-red-900';
            case 'em_analise': return 'text-blue-400 bg-blue-900';
            default: return 'text-yellow-400 bg-yellow-900';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'aprovada': return <CheckCircle className="h-4 w-4" />;
            case 'rejeitada': return <XCircle className="h-4 w-4" />;
            case 'em_analise': return <Eye className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const handleStatusChange = (appId: string, newStatus: string, notas?: string) => {
        updateApplicationStatus(appId, newStatus, notas);
        setSelectedApplication(null);
    };

    if (!isLoggedIn) {
        return (
            <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
                    <p className="text-gray-400 mb-4">Precisa de fazer login para aceder a esta página.</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="btn btn-primary"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Gestão de Candidaturas
                    </h1>
                    <p className="text-gray-400">
                        Gerir candidaturas às organizações do EnigmaRP
                    </p>
                </motion.div>

                {/* Estatísticas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
                >
                    <div className="bg-gray-800 p-4 rounded-lg text-center border-t-4 border-blue-500">
                        <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{stats.total}</h3>
                        <p className="text-gray-400 text-sm">Total</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg text-center border-t-4 border-yellow-500">
                        <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{stats.pendentes}</h3>
                        <p className="text-gray-400 text-sm">Pendentes</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg text-center border-t-4 border-blue-400">
                        <Eye className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{stats.emAnalise}</h3>
                        <p className="text-gray-400 text-sm">Em Análise</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg text-center border-t-4 border-green-500">
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{stats.aprovadas}</h3>
                        <p className="text-gray-400 text-sm">Aprovadas</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg text-center border-t-4 border-red-500">
                        <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white">{stats.rejeitadas}</h3>
                        <p className="text-gray-400 text-sm">Rejeitadas</p>
                    </div>
                </motion.div>

                {/* Filtros */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Pesquisar candidaturas..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>

                        <select
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                            className="input"
                        >
                            <option value="all">Todas as organizações</option>
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.nome}</option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="input"
                        >
                            <option value="all">Todos os estados</option>
                            <option value="pendente">Pendentes</option>
                            <option value="em_analise">Em Análise</option>
                            <option value="aprovada">Aprovadas</option>
                            <option value="rejeitada">Rejeitadas</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedOrg('all');
                                setSelectedStatus('all');
                            }}
                            className="btn btn-secondary"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </motion.div>

                {/* Lista de Candidaturas */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                >
                    {filteredApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">
                                Nenhuma candidatura encontrada
                            </h3>
                            <p className="text-gray-400">
                                Tente ajustar os filtros de pesquisa.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Candidato
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Organização
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Data
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredApplications.map((app, index) => {
                                        const org = organizations.find(o => o.id === app.organizacaoId);
                                        return (
                                            <tr key={app.id} className="hover:bg-gray-700 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-white">
                                                            {app.nomePersonagem}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {app.nomeJogador} • {app.horasJogadas}h
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div
                                                            className="w-3 h-3 rounded-full mr-2"
                                                            style={{ backgroundColor: org?.corHex }}
                                                        ></div>
                                                        <span className="text-sm text-white">{org?.nome}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.estado)}`}>
                                                        {getStatusIcon(app.estado)}
                                                        <span className="ml-1 capitalize">{app.estado}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {formatDate(app.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => setSelectedApplication(app)}
                                                        className="text-blue-400 hover:text-blue-300 mr-3"
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
                    )}
                </motion.div>
            </div>

            {/* Modal de Detalhes */}
            {selectedApplication && (
                <ApplicationDetailModal
                    application={selectedApplication}
                    organization={organizations.find(o => o.id === selectedApplication.organizacaoId)}
                    onClose={() => setSelectedApplication(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
};

// Modal para detalhes da candidatura
const ApplicationDetailModal: React.FC<{
    application: any;
    organization: any;
    onClose: () => void;
    onStatusChange: (id: string, status: string, notas?: string) => void;
}> = ({ application, organization, onClose, onStatusChange }) => {
    const [newStatus, setNewStatus] = useState(application.estado);
    const [notas, setNotas] = useState(application.notasAdmin || '');

    const handleSubmit = () => {
        onStatusChange(application.id, newStatus, notas);
    };

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">
                            Detalhes da Candidatura
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informações do Candidato */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Informações do Candidato
                            </h3>

                            <div className="bg-gray-700 p-4 rounded-lg space-y-3">
                                <div>
                                    <label className="text-gray-400 text-sm">Nome do Personagem</label>
                                    <p className="text-white font-medium">{application.nomePersonagem}</p>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm">Nome do Jogador (OOC)</label>
                                    <p className="text-white">{application.nomeJogador}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-gray-400 text-sm">Idade do Personagem</label>
                                        <p className="text-white">{application.idadePersonagem} anos</p>
                                    </div>
                                    <div>
                                        <label className="text-gray-400 text-sm">Horas Jogadas</label>
                                        <p className="text-white">{application.horasJogadas}h</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm">Email</label>
                                    <p className="text-white flex items-center">
                                        <Mail className="h-4 w-4 mr-1" />
                                        {application.email}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-gray-400 text-sm">Discord</label>
                                    <p className="text-white">{application.discordUsername}</p>
                                </div>
                            </div>
                        </div>

                        {/* Motivação e Experiência */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white mb-4">
                                Motivação e Experiência
                            </h3>

                            <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                                {application.experienciaPrevia && (
                                    <div>
                                        <label className="text-gray-400 text-sm">Experiência Prévia</label>
                                        <p className="text-white text-sm">{application.experienciaPrevia}</p>
                                    </div>
                                )}

                                <div>
                                    <label className="text-gray-400 text-sm">Motivação</label>
                                    <p className="text-white text-sm">{application.motivacao}</p>
                                </div>

                                {application.disponibilidade && (
                                    <div>
                                        <label className="text-gray-400 text-sm">Disponibilidade</label>
                                        <p className="text-white text-sm">{application.disponibilidade}</p>
                                    </div>
                                )}

                                {application.informacaoAdicional && (
                                    <div>
                                        <label className="text-gray-400 text-sm">Informação Adicional</label>
                                        <p className="text-white text-sm">{application.informacaoAdicional}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gestão do Estado */}
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Gestão da Candidatura
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Estado</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="input w-full"
                                >
                                    <option value="pendente">Pendente</option>
                                    <option value="em_analise">Em Análise</option>
                                    <option value="aprovada">Aprovada</option>
                                    <option value="rejeitada">Rejeitada</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-400 text-sm mb-2">
                                    Data de Candidatura
                                </label>
                                <p className="text-white p-2 bg-gray-700 rounded">
                                    {formatDate(application.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-400 text-sm mb-2">
                                Notas da Administração
                            </label>
                            <textarea
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                className="input w-full min-h-[100px]"
                                placeholder="Adicione notas sobre a decisão..."
                            />
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={onClose}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="btn btn-primary"
                            >
                                Guardar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ApplicationsManagementPage;