import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Organization, OrganizationApplication } from '../types/organizations';

interface OrganizationContextType {
    organizations: Organization[];
    applications: OrganizationApplication[];
    addOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => void;
    updateOrganization: (id: string, updates: Partial<Organization>) => void;
    deleteOrganization: (id: string) => void;
    addApplication: (app: Omit<OrganizationApplication, 'id' | 'createdAt'>) => void;
    updateApplicationStatus: (id: string, estado: string, notas?: string) => void;
    getOrganizationBySlug: (slug: string) => Organization | undefined;
    getApplicationsByOrganization: (orgId: string) => OrganizationApplication[];
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const useOrganizations = () => {
    const context = useContext(OrganizationContext);
    if (!context) {
        throw new Error('useOrganizations deve ser usado dentro de OrganizationProvider');
    }
    return context;
};

// Dados iniciais das organizações
const initialOrganizations: Organization[] = [
    {
        id: '1',
        nome: 'Polícia de Los Santos',
        slug: 'policia-ls',
        descricao: 'Força policial responsável por manter a ordem e segurança em Los Santos.',
        corHex: '#0066cc',
        icone: 'shield',
        requisitos: [
            'Mínimo 50 horas no servidor',
            'Registo criminal limpo',
            'Excelentes competências de comunicação',
            'Capacidade de manter a calma sob pressão',
            'Conhecimento das regras do servidor'
        ],
        beneficios: [
            'Salário competitivo e benefícios',
            'Acesso a veículos e equipamento policial',
            'Oportunidades de progressão na carreira',
            'Formação especializada',
            'Autoridade para fazer cumprir a lei'
        ],
        aceitaCandidaturas: true,
        ativo: true,
        createdAt: new Date('2024-01-15')
    },
    {
        id: '2',
        nome: 'Serviços Médicos de Emergência',
        slug: 'sme',
        descricao: 'Equipa médica responsável por salvar vidas e prestar cuidados de emergência.',
        corHex: '#dc3545',
        icone: 'heart-pulse',
        requisitos: [
            'Mínimo 30 horas no servidor',
            'Conhecimentos básicos de roleplay médico',
            'Boas competências de comunicação',
            'Disponibilidade em horários de pico',
            'Capacidade de trabalhar sob pressão'
        ],
        beneficios: [
            'Salário estável e pacote de benefícios',
            'Acesso a veículos e equipamento médico',
            'Formação médica especializada',
            'Posição respeitada na comunidade',
            'Oportunidades de progressão na carreira'
        ],
        aceitaCandidaturas: true,
        ativo: true,
        createdAt: new Date('2024-01-20')
    },
    {
        id: '3',
        nome: 'Oficina Mecânica Central',
        slug: 'mecanica',
        descricao: 'Oficina responsável por reparação e personalização de veículos em Los Santos.',
        corHex: '#ffc107',
        icone: 'wrench',
        requisitos: [
            'Mínimo 20 horas no servidor',
            'Conhecimentos básicos de veículos',
            'Competências de atendimento ao cliente',
            'Capacidade de roleplay profissional',
            'Carta de condução válida'
        ],
        beneficios: [
            'Estrutura de pagamento por comissão',
            'Acesso a ferramentas e equipamento',
            'Permissões para modificar veículos',
            'Oportunidades de negócio próprio',
            'Base de clientes estável'
        ],
        aceitaCandidaturas: true,
        ativo: true,
        createdAt: new Date('2024-01-25')
    },
    {
        id: '4',
        nome: 'Serviços Jurídicos',
        slug: 'juridicos',
        descricao: 'Escritório de advogados para representação legal e consultoria jurídica.',
        corHex: '#28a745',
        icone: 'briefcase',
        requisitos: [
            'Mínimo 40 horas no servidor',
            'Forte compreensão das leis do servidor',
            'Excelentes competências de escrita e oratória',
            'Capacidade de manter confidencialidade',
            'Postura profissional'
        ],
        beneficios: [
            'Alto potencial de ganhos',
            'Posição respeitada na comunidade',
            'Acesso às instalações do tribunal',
            'Capacidade de representar clientes em processos',
            'Carreira de prestígio'
        ],
        aceitaCandidaturas: true,
        ativo: true,
        createdAt: new Date('2024-02-01')
    }
];

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [organizations, setOrganizations] = useState<Organization[]>(() => {
        const saved = localStorage.getItem('enigma_organizations');
        return saved ? JSON.parse(saved) : initialOrganizations;
    });

    const [applications, setApplications] = useState<OrganizationApplication[]>(() => {
        const saved = localStorage.getItem('enigma_org_applications');
        return saved ? JSON.parse(saved) : [];
    });

    // Guardar no localStorage sempre que mudarem
    useEffect(() => {
        localStorage.setItem('enigma_organizations', JSON.stringify(organizations));
    }, [organizations]);

    useEffect(() => {
        localStorage.setItem('enigma_org_applications', JSON.stringify(applications));
    }, [applications]);

    const addOrganization = (orgData: Omit<Organization, 'id' | 'createdAt'>) => {
        const newOrg: Organization = {
            ...orgData,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        setOrganizations(prev => [...prev, newOrg]);
    };

    const updateOrganization = (id: string, updates: Partial<Organization>) => {
        setOrganizations(prev =>
            prev.map(org =>
                org.id === id ? { ...org, ...updates } : org
            )
        );
    };

    const deleteOrganization = (id: string) => {
        setOrganizations(prev => prev.filter(org => org.id !== id));
        // Remover também as candidaturas da organização
        setApplications(prev => prev.filter(app => app.organizacaoId !== id));
    };

    const addApplication = (appData: Omit<OrganizationApplication, 'id' | 'createdAt'>) => {
        const newApp: OrganizationApplication = {
            ...appData,
            id: Date.now().toString(),
            createdAt: new Date()
        };
        setApplications(prev => [...prev, newApp]);
    };

    const updateApplicationStatus = (id: string, estado: string, notas?: string) => {
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
    };

    const getOrganizationBySlug = (slug: string) => {
        return organizations.find(org => org.slug === slug && org.ativo);
    };

    const getApplicationsByOrganization = (orgId: string) => {
        return applications.filter(app => app.organizacaoId === orgId);
    };

    return (
        <OrganizationContext.Provider
            value={{
                organizations,
                applications,
                addOrganization,
                updateOrganization,
                deleteOrganization,
                addApplication,
                updateApplicationStatus,
                getOrganizationBySlug,
                getApplicationsByOrganization
            }}
        >
            {children}
        </OrganizationContext.Provider>
    );
};