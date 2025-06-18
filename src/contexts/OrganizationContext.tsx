import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from './AuthContext';

export interface Organization {
    id: string;
    nome: string;
    slug: string;
    descricao: string;
    corHex: string;
    icone: string;
    requisitos: string[];
    beneficios: string[];
    aceitaCandidaturas: boolean;
    ativo: boolean;
    chefeId?: string;
    chefeUsername?: string;
    createdAt: Date;
}

export interface OrganizationApplication {
    id: string;
    organizacaoId: string;
    organizationName?: string;
    organizationColor?: string;
    nomePersonagem: string;
    nomeJogador: string;
    email: string;
    discordUsername: string;
    idadePersonagem: number;
    horasJogadas: number;
    experienciaPrevia?: string;
    motivacao: string;
    disponibilidade?: string;
    informacaoAdicional?: string;
    estado: 'pendente' | 'aprovada' | 'rejeitada' | 'em_analise';
    notasAdmin?: string;
    avaliadoPor?: string;
    avaliadoPorUsername?: string;
    dataAvaliacao?: Date;
    createdAt: Date;
}

interface OrganizationContextType {
    organizations: Organization[];
    applications: OrganizationApplication[];
    loading: boolean;
    loadingApplications: boolean;
    error: string | null;
    addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => Promise<boolean>;
    updateOrganization: (id: string, updates: Partial<Organization>) => Promise<boolean>;
    deleteOrganization: (id: string) => Promise<boolean>;
    addApplication: (app: Omit<OrganizationApplication, 'id' | 'createdAt'>) => Promise<boolean>;
    updateApplicationStatus: (id: string, estado: string, notas?: string) => Promise<boolean>;
    getOrganizationBySlug: (slug: string) => Organization | undefined;
    getApplicationsByOrganization: (orgId: string) => OrganizationApplication[];
    refreshOrganizations: () => Promise<void>;
    refreshApplications: () => Promise<void>;
    clearError: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizations = () => {
    const context = useContext(OrganizationContext);
    if (!context) {
        throw new Error('useOrganizations deve ser usado dentro de OrganizationProvider');
    }
    return context;
};

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [applications, setApplications] = useState<OrganizationApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingApplications, setLoadingApplications] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Buscar organizações da API
    const fetchOrganizations = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/api/organizations');

            // Transformar os dados para o formato esperado pelo frontend
            const transformedOrgs = response.data.map((org: any) => ({
                ...org,
                corHex: org.cor_hex || org.corHex,
                aceitaCandidaturas: org.aceita_candidaturas ?? org.aceitaCandidaturas,
                chefeUsername: org.chefe_username || org.chefeUsername,
                createdAt: new Date(org.created_at || org.createdAt)
            }));

            setOrganizations(transformedOrgs);
        } catch (error: any) {
            console.error('Erro ao buscar organizações:', error);
            setError('Erro ao carregar organizações');

            // Fallback para dados locais em caso de erro
            const savedOrgs = localStorage.getItem('enigma_organizations');
            if (savedOrgs) {
                try {
                    const parsedOrgs = JSON.parse(savedOrgs);
                    setOrganizations(parsedOrgs);
                } catch (parseError) {
                    console.error('Erro ao parsear organizações salvas:', parseError);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    // Buscar candidaturas da API
    const fetchApplications = async () => {
        try {
            setLoadingApplications(true);
            setError(null);

            const response = await api.get('/api/applications');

            // Transformar os dados para o formato esperado pelo frontend
            const transformedApps = response.data.map((app: any) => ({
                ...app,
                organizacaoId: app.organization_id?.toString() || app.organizacaoId,
                organizationName: app.organization_name || app.organizationName,
                organizationColor: app.cor_hex || app.organizationColor,
                nomePersonagem: app.nome_personagem || app.nomePersonagem,
                nomeJogador: app.nome_jogador || app.nomeJogador,
                discordUsername: app.discord_username || app.discordUsername,
                idadePersonagem: app.idade_personagem || app.idadePersonagem,
                horasJogadas: app.horas_jogadas || app.horasJogadas,
                experienciaPrevia: app.experiencia_previa || app.experienciaPrevia,
                informacaoAdicional: app.informacao_adicional || app.informacaoAdicional,
                notasAdmin: app.notas_admin || app.notasAdmin,
                avaliadoPor: app.avaliado_por?.toString() || app.avaliadoPor,
                avaliadoPorUsername: app.avaliado_por_username || app.avaliadoPorUsername,
                dataAvaliacao: app.data_avaliacao ? new Date(app.data_avaliacao) : app.dataAvaliacao,
                createdAt: new Date(app.created_at || app.createdAt)
            }));

            setApplications(transformedApps);
        } catch (error: any) {
            console.error('Erro ao buscar candidaturas:', error);
            setError('Erro ao carregar candidaturas');

            // Fallback para dados locais
            const savedApps = localStorage.getItem('enigma_org_applications');
            if (savedApps) {
                try {
                    const parsedApps = JSON.parse(savedApps);
                    setApplications(parsedApps);
                } catch (parseError) {
                    console.error('Erro ao parsear candidaturas salvas:', parseError);
                }
            }
        } finally {
            setLoadingApplications(false);
        }
    };

    // Carregar dados iniciais
    useEffect(() => {
        fetchOrganizations();
        fetchApplications();
    }, []);

    // Salvar organizações no localStorage como backup
    useEffect(() => {
        if (organizations.length > 0) {
            localStorage.setItem('enigma_organizations', JSON.stringify(organizations));
        }
    }, [organizations]);

    // Salvar candidaturas no localStorage como backup
    useEffect(() => {
        if (applications.length > 0) {
            localStorage.setItem('enigma_org_applications', JSON.stringify(applications));
        }
    }, [applications]);

    const addOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
            setError(null);

            const response = await api.post('/api/admin/organizations', {
                nome: orgData.nome,
                descricao: orgData.descricao,
                cor_hex: orgData.corHex,
                icone: orgData.icone,
                requisitos: orgData.requisitos,
                beneficios: orgData.beneficios,
                aceita_candidaturas: orgData.aceitaCandidaturas,
                ativo: orgData.ativo
            });

            if (response.data.success) {
                await fetchOrganizations();
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao criar organização:', error);
            setError(error.response?.data?.error || 'Erro ao criar organização');
            throw new Error(error.response?.data?.error || 'Erro ao criar organização');
        }
    };

    const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<boolean> => {
        try {
            setError(null);

            const response = await api.patch(`/api/admin/organizations/${id}`, {
                nome: updates.nome,
                descricao: updates.descricao,
                cor_hex: updates.corHex,
                icone: updates.icone,
                requisitos: updates.requisitos,
                beneficios: updates.beneficios,
                aceita_candidaturas: updates.aceitaCandidaturas,
                ativo: updates.ativo
            });

            if (response.data.success) {
                await fetchOrganizations();
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao atualizar organização:', error);
            setError(error.response?.data?.error || 'Erro ao atualizar organização');

            // Fallback: atualizar localmente
            setOrganizations(prev =>
                prev.map(org =>
                    org.id === id ? { ...org, ...updates } : org
                )
            );

            throw new Error(error.response?.data?.error || 'Erro ao atualizar organização');
        }
    };

    const deleteOrganization = async (id: string): Promise<boolean> => {
        try {
            setError(null);

            const response = await api.delete(`/api/admin/organizations/${id}`);

            if (response.data.success) {
                await fetchOrganizations();
                await fetchApplications(); // Atualizar candidaturas também
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao eliminar organização:', error);
            setError(error.response?.data?.error || 'Erro ao eliminar organização');

            // Fallback: remover localmente
            setOrganizations(prev => prev.filter(org => org.id !== id));
            setApplications(prev => prev.filter(app => app.organizacaoId !== id));

            throw new Error(error.response?.data?.error || 'Erro ao eliminar organização');
        }
    };

    const addApplication = async (appData: Omit<OrganizationApplication, 'id' | 'createdAt'>): Promise<boolean> => {
        try {
            setError(null);

            const response = await api.post(`/api/organizations/${appData.organizacaoId}/apply`, {
                nome_personagem: appData.nomePersonagem,
                nome_jogador: appData.nomeJogador,
                email: appData.email,
                discord_username: appData.discordUsername,
                idade_personagem: appData.idadePersonagem,
                horas_jogadas: appData.horasJogadas,
                experiencia_previa: appData.experienciaPrevia,
                motivacao: appData.motivacao,
                disponibilidade: appData.disponibilidade,
                informacao_adicional: appData.informacaoAdicional
            });

            if (response.data.success) {
                await fetchApplications();
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao submeter candidatura:', error);
            setError(error.response?.data?.error || 'Erro ao submeter candidatura');

            // Fallback: adicionar localmente
            const newApp: OrganizationApplication = {
                ...appData,
                id: Date.now().toString(),
                createdAt: new Date()
            };
            setApplications(prev => [...prev, newApp]);

            throw new Error(error.response?.data?.error || 'Erro ao submeter candidatura');
        }
    };

    const updateApplicationStatus = async (id: string, estado: string, notas?: string): Promise<boolean> => {
        try {
            setError(null);

            const response = await api.patch(`/api/applications/${id}/status`, {
                estado,
                notas_admin: notas
            });

            if (response.data.success) {
                await fetchApplications();
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Erro ao atualizar candidatura:', error);
            setError(error.response?.data?.error || 'Erro ao atualizar candidatura');

            // Fallback: atualizar localmente
            setApplications(prev =>
                prev.map(app =>
                    app.id === id
                        ? {
                            ...app,
                            estado: estado as any,
                            notasAdmin: notas,
                            dataAvaliacao: new Date()
                        }
                        : app
                )
            );

            throw new Error(error.response?.data?.error || 'Erro ao atualizar candidatura');
        }
    };

    const getOrganizationBySlug = (slug: string): Organization | undefined => {
        return organizations.find(org => org.slug === slug && org.ativo);
    };

    const getApplicationsByOrganization = (orgId: string): OrganizationApplication[] => {
        return applications.filter(app => app.organizacaoId === orgId);
    };

    const refreshOrganizations = async (): Promise<void> => {
        await fetchOrganizations();
    };

    const refreshApplications = async (): Promise<void> => {
        await fetchApplications();
    };

    const clearError = () => {
        setError(null);
    };

    return (
        <OrganizationContext.Provider
            value={{
                organizations,
                applications,
                loading,
                loadingApplications,
                error,
                addOrganization,
                updateOrganization,
                deleteOrganization,
                addApplication,
                updateApplicationStatus,
                getOrganizationBySlug,
                getApplicationsByOrganization,
                refreshOrganizations,
                refreshApplications,
                clearError
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
};