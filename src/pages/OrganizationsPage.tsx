import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    CheckCircle,
    Clock,
    ArrowRight,
    Shield,
    Heart,
    Wrench,
    Briefcase,
    Search
} from 'lucide-react';
import { useOrganizations } from '../contexts/OrganizationContext';

const getIconByName = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        'shield': <Shield className="w-8 h-8" />,
        'heart-pulse': <Heart className="w-8 h-8" />,
        'wrench': <Wrench className="w-8 h-8" />,
        'briefcase': <Briefcase className="w-8 h-8" />,
        'building': <Building2 className="w-8 h-8" />
    };
    return icons[iconName] || <Building2 className="w-8 h-8" />;
};

const OrganizationsPage: React.FC = () => {
    const { organizations, getApplicationsByOrganization } = useOrganizations();
    const [searchTerm, setSearchTerm] = useState('');

    const activeOrganizations = organizations.filter(org => {
        const matchesSearch = org.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            org.descricao.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && org.ativo;
    });

    return (
        <div className="pt-24 pb-16 bg-gray-900 min-h-screen animate-fadeIn">
            <div className="container-custom">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Organizações do <span className="text-red-600">EnigmaRP</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Descubra as diferentes organizações disponíveis no nosso servidor e candidate-se
                        para fazer parte de uma equipa profissional.
                    </p>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 max-w-md mx-auto"
                >
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Pesquisar organizações..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    <div className="bg-gray-800 p-6 rounded-lg text-center border-t-4 border-blue-500">
                        <Building2 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-white">{organizations.filter(o => o.ativo).length}</h3>
                        <p className="text-gray-400">Organizações Ativas</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg text-center border-t-4 border-green-500">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-white">
                            {organizations.filter(o => o.aceitaCandidaturas && o.ativo).length}
                        </h3>
                        <p className="text-gray-400">A Recrutar</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg text-center border-t-4 border-yellow-500">
                        <Users className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                        <h3 className="text-2xl font-bold text-white">100+</h3>
                        <p className="text-gray-400">Membros Ativos</p>
                    </div>
                </motion.div>

                {/* Organizations Grid */}
                {activeOrganizations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center py-12"
                    >
                        <Building2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Nenhuma organização encontrada</h3>
                        <p className="text-gray-400 mb-4">
                            Tente ajustar os seus critérios de pesquisa.
                        </p>
                        <button
                            onClick={() => setSearchTerm('')}
                            className="btn btn-secondary"
                        >
                            Limpar Pesquisa
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeOrganizations.map((org, index) => (
                            <OrganizationCard
                                key={org.id}
                                organization={org}
                                index={index}
                                applicationCount={getApplicationsByOrganization(org.id).length}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Componente para cada organização
const OrganizationCard: React.FC<{
    organization: any;
    index: number;
    applicationCount: number;
}> = ({ organization, index, applicationCount }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="group"
        >
            <div className="card h-full hover:transform hover:-translate-y-2 transition-all duration-300">
                {/* Header com cor da organização */}
                <div
                    className="h-32 relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${organization.corHex}DD, ${organization.corHex}AA)`
                    }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative h-full flex items-center justify-center">
                        <div className="text-white">
                            {getIconByName(organization.icone)}
                        </div>
                    </div>

                    {/* Badge de status */}
                    <div className="absolute top-4 right-4">
                        {organization.aceitaCandidaturas ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                A recrutar
                            </span>
                        ) : (
                            <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Fechado
                            </span>
                        )}
                    </div>
                </div>

                {/* Conteúdo */}
                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                        {organization.nome}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 flex-1">
                        {organization.descricao}
                    </p>

                    {/* Estatísticas */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{organization.requisitos.length} requisitos</span>
                        <span>{organization.beneficios.length} benefícios</span>
                        <span>{applicationCount} candidaturas</span>
                    </div>

                    {/* Botões de ação */}
                    <div className="space-y-2">
                        {organization.aceitaCandidaturas && (
                            <Link
                                to={`/organizacoes/${organization.slug}/candidatar`}
                                className="btn btn-primary w-full flex items-center justify-center group"
                            >
                                Candidatar-me
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}

                        <button className="btn btn-outline w-full">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrganizationsPage;
