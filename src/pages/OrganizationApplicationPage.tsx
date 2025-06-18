import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { CheckCircle2, Building2, AlertCircle, Shield, Heart, Wrench, Briefcase } from 'lucide-react';
import { useOrganizations } from '../contexts/OrganizationContext';

interface ApplicationFormData {
    nomePersonagem: string;
    nomeJogador: string;
    email: string;
    discordUsername: string;
    idadePersonagem: number;
    horasJogadas: number;
    experienciaPrevia: string;
    motivacao: string;
    disponibilidade: string;
    informacaoAdicional: string;
}

const getIconByName = (iconName: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        'shield': <Shield className="w-10 h-10" />,
        'heart-pulse': <Heart className="w-10 h-10" />,
        'wrench': <Wrench className="w-10 h-10" />,
        'briefcase': <Briefcase className="w-10 h-10" />,
        'building': <Building2 className="w-10 h-10" />
    };
    return icons[iconName] || <Building2 className="w-10 h-10" />;
};

const OrganizationApplicationPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { getOrganizationBySlug, addApplication } = useOrganizations();
    const [organization, setOrganization] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<ApplicationFormData>();

    useEffect(() => {
        if (slug) {
            const org = getOrganizationBySlug(slug);
            setOrganization(org);
            setLoading(false);

            if (!org) {
                navigate('/404');
            }
        }
    }, [slug, getOrganizationBySlug, navigate]);

    const onSubmit = async (data: ApplicationFormData) => {
        if (!organization) return;

        setIsSubmitting(true);

        try {
            // Simular delay de envio
            await new Promise(resolve => setTimeout(resolve, 1500));

            addApplication({
                organizacaoId: organization.id,
                ...data,
                estado: 'pendente'
            });

            setIsSubmitted(true);
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao submeter candidatura');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-400">A carregar informações da organização...</p>
                </div>
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="min-h-screen pt-24 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Organização não encontrada</h1>
                    <p className="text-gray-400 mb-4">A organização que procura não existe ou foi removida.</p>
                    <button onClick={() => navigate('/organizacoes')} className="btn btn-primary">
                        Ver Organizações
                    </button>
                </div>
            </div>
        );
    }

    if (!organization.aceitaCandidaturas) {
        return (
            <div className="min-h-screen pt-24 bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Candidaturas Fechadas</h1>
                    <p className="text-gray-400 mb-4">
                        A {organization.nome} não está a aceitar candidaturas neste momento.
                    </p>
                    <button onClick={() => navigate('/organizacoes')} className="btn btn-primary">
                        Ver Outras Organizações
                    </button>
                </div>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen pt-24 bg-gray-900 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-800 p-8 rounded-xl shadow-md text-center max-w-md mx-4"
                >
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                        Candidatura Submetida!
                    </h2>
                    <p className="text-gray-300 mb-6">
                        A sua candidatura para <strong>{organization.nome}</strong> foi submetida com sucesso.
                        A nossa equipa irá analisá-la e contactá-lo via Discord em 3-5 dias.
                    </p>
                    <div className="space-y-2">
                        <button
                            onClick={() => navigate('/organizacoes')}
                            className="btn btn-primary w-full"
                        >
                            Ver Outras Organizações
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-secondary w-full"
                        >
                            Voltar ao Início
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16 bg-gray-900">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Organization Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div
                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: organization.corHex }}
                    >
                        <div className="text-white">
                            {getIconByName(organization.icone)}
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Candidatura para {organization.nome}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {organization.descricao}
                    </p>
                </motion.div>

                {/* Requirements and Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
                >
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                            Requisitos
                        </h3>
                        <ul className="space-y-2">
                            {organization.requisitos.map((req: string, index: number) => (
                                <li key={index} className="flex items-start text-gray-300">
                                    <span className="text-yellow-500 mr-2 mt-1">•</span>
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                            Benefícios
                        </h3>
                        <ul className="space-y-2">
                            {organization.beneficios.map((ben: string, index: number) => (
                                <li key={index} className="flex items-start text-gray-300">
                                    <span className="text-green-500 mr-2 mt-1">•</span>
                                    {ben}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* Application Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800 rounded-lg p-6 md:p-8"
                >
                    <h2 className="text-xl font-bold text-white mb-6">
                        Formulário de Candidatura
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Character Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">
                                    Nome do Personagem *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: João Silva"
                                    {...register("nomePersonagem", {
                                        required: "Nome do personagem é obrigatório",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" }
                                    })}
                                />
                                {errors.nomePersonagem && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nomePersonagem.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Idade do Personagem *
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Ex: 25"
                                    {...register("idadePersonagem", {
                                        required: "Idade é obrigatória",
                                        min: { value: 18, message: "Idade mínima: 18 anos" },
                                        max: { value: 80, message: "Idade máxima: 80 anos" }
                                    })}
                                />
                                {errors.idadePersonagem && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.idadePersonagem.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Player Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">
                                    Seu Nome (OOC) *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Seu nome real"
                                    {...register("nomeJogador", {
                                        required: "Nome do jogador é obrigatório"
                                    })}
                                />
                                {errors.nomeJogador && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nomeJogador.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Horas Jogadas no Servidor *
                                </label>
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="Ex: 150"
                                    {...register("horasJogadas", {
                                        required: "Horas jogadas é obrigatório",
                                        min: { value: 0, message: "Valor deve ser positivo" }
                                    })}
                                />
                                {errors.horasJogadas && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.horasJogadas.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="seu@email.com"
                                    {...register("email", {
                                        required: "Email é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Discord *
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="usuario#1234"
                                    {...register("discordUsername", {
                                        required: "Discord é obrigatório"
                                    })}
                                />
                                {errors.discordUsername && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.discordUsername.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Experience and Motivation */}
                        <div>
                            <label className="block text-white mb-2">
                                Experiência Prévia
                            </label>
                            <textarea
                                className="input min-h-[100px]"
                                placeholder="Descreva qualquer experiência relevante que tenha..."
                                {...register("experienciaPrevia")}
                            />
                        </div>

                        <div>
                            <label className="block text-white mb-2">
                                Motivação *
                            </label>
                            <textarea
                                className="input min-h-[120px]"
                                placeholder="Porque quer juntar-se a esta organização? Quais são os seus objetivos?"
                                {...register("motivacao", {
                                    required: "Motivação é obrigatória",
                                    minLength: {
                                        value: 50,
                                        message: "Mínimo 50 caracteres"
                                    }
                                })}
                            />
                            {errors.motivacao && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.motivacao.message}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">
                                    Disponibilidade
                                </label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="Ex: Noites e fins-de-semana"
                                    {...register("disponibilidade")}
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Informação Adicional
                                </label>
                                <textarea
                                    className="input"
                                    placeholder="Qualquer informação adicional..."
                                    {...register("informacaoAdicional")}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/organizacoes')}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'A submeter...' : 'Submeter Candidatura'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default OrganizationApplicationPage;