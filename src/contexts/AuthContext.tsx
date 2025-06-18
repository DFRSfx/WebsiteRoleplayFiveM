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
  addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => Promise<boolean>;
  updateOrganization: (id: string, updates: Partial<Organization>) => Promise<boolean>;
  deleteOrganization: (id: string) => Promise<boolean>;
  addApplication: (app: Omit<OrganizationApplication, 'id' | 'createdAt'>) => Promise<boolean>;
  updateApplicationStatus: (id: string, estado: string, notas?: string) => Promise<boolean>;
  getOrganizationBySlug: (slug: string) => Organization | undefined;
  getApplicationsByOrganization: (orgId: string) => OrganizationApplication[];
  refreshOrganizations: () => Promise<void>;
  refreshApplications: () => Promise<void>;
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

  // Buscar organizações
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/organizations');

      // Transformar os dados para o formato esperado pelo frontend
      const transformedOrgs = response.data.map((org: any) => ({
        ...org,
        corHex: org.cor_hex,
        aceitaCandidaturas: org.aceita_candidaturas,
        chefeUsername: org.chefe_username,
        createdAt: new Date(org.created_at)
      }));

      setOrganizations(transformedOrgs);
    } catch (error) {
      console.error('Erro ao buscar organizações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar candidaturas
  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await api.get('/api/applications');

      // Transformar os dados para o formato esperado pelo frontend
      const transformedApps = response.data.map((app: any) => ({
        ...app,
        organizacaoId: app.organization_id.toString(),
        organizationName: app.organization_name,
        organizationColor: app.cor_hex,
        nomePersonagem: app.nome_personagem,
        nomeJogador: app.nome_jogador,
        discordUsername: app.discord_username,
        idadePersonagem: app.idade_personagem,
        horasJogadas: app.horas_jogadas,
        experienciaPrevia: app.experiencia_previa,
        informacaoAdicional: app.informacao_adicional,
        notasAdmin: app.notas_admin,
        avaliadoPor: app.avaliado_por?.toString(),
        avaliadoPorUsername: app.avaliado_por_username,
        dataAvaliacao: app.data_avaliacao ? new Date(app.data_avaliacao) : undefined,
        createdAt: new Date(app.created_at)
      }));

      setApplications(transformedApps);
    } catch (error) {
      console.error('Erro ao buscar candidaturas:', error);
    } finally {
      setLoadingApplications(false);
    }
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchOrganizations();
    fetchApplications();
  }, []);

  const addOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
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
      throw new Error(error.response?.data?.error || 'Erro ao criar organização');
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<boolean> => {
    try {
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
      throw new Error(error.response?.data?.error || 'Erro ao atualizar organização');
    }
  };

  const deleteOrganization = async (id: string): Promise<boolean> => {
    try {
      const response = await api.delete(`/api/admin/organizations/${id}`);

      if (response.data.success) {
        await fetchOrganizations();
        await fetchApplications(); // Atualizar candidaturas também
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erro ao eliminar organização:', error);
      throw new Error(error.response?.data?.error || 'Erro ao eliminar organização');
    }
  };

  const addApplication = async (appData: Omit<OrganizationApplication, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
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
      throw new Error(error.response?.data?.error || 'Erro ao submeter candidatura');
    }
  };

  const updateApplicationStatus = async (id: string, estado: string, notas?: string): Promise<boolean> => {
    try {
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

  return (
    <OrganizationContext.Provider
      value={{
        organizations,
        applications,
        loading,
        loadingApplications,
        addOrganization,
        updateOrganization,
        deleteOrganization,
        addApplication,
        updateApplicationStatus,
        getOrganizationBySlug,
        getApplicationsByOrganization,
        refreshOrganizations,
        refreshApplications
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};