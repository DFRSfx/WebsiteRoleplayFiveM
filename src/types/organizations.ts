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
    createdAt: Date;
}

export interface OrganizationApplication {
    id: string;
    organizacaoId: string;
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
    dataAvaliacao?: Date;
    createdAt: Date;
}