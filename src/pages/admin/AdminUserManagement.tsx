import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Shield,
    UserCheck,
    UserX,
    Mail,
    User,
    Lock,
    Building2,
    Search,
    Filter,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { useAuth, api } from '../../contexts/AuthContext';
import { useOrganizations } from '../../contexts/OrganizationContext';

interface User {
    id: string;
    username: string;
    email: string;
    role: 'user' | 'moderator' | 'admin' | 'chefe_organizacao';
    active: boolean;
    lastLogin?: string;
    organizationId?: string;
    organizationName?: string;
}

interface CreateUserFormData {
    username: string;
    email: string;
    password: string;
    role: string;
    organizationId?: string;
    active: boolean;
}

const AdminUserManagement: React.FC = () => {
    const { isAdmin } = useAuth();
    const { organizations } = useOrganizations();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<CreateUserFormData>();

    // Buscar utilizadores
    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdmin()) {
            fetchUsers();
        }
    }, []);

    // Verificar se não é admin
    if (!isAdmin()) {
        return (
            <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
                    <p className="text-gray-400">Apenas administradores podem aceder a esta página.</p>
                </div>
            </div>
        );
    }

    // Filtrar utilizadores
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Criar utilizador
    const handleCreateUser = async (data: CreateUserFormData) => {
        setIsSubmitting(true);
        try {
            const response = await api.post('/api/admin/users', {
                ...data,
                organizationId: data.role === 'chefe_organizacao' ? data.organizationId : null
            });

            if (response.data.success) {
                await fetchUsers();
                setShowCreateModal(false);
                reset();
            }
        } catch (error: any) {
            console.error('Erro ao criar utilizador:', error);
            alert(error.response?.data?.error || 'Erro ao criar utilizador');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Editar utilizador
    const handleEditUser = async (data: CreateUserFormData) => {
        if (!selectedUser) return;

        setIsSubmitting(true);
        try {
            const updateData: any = {
                username: data.username,
                email: data.email,
                role: data.role,
                active: data.active,
                organizationId: data.role === 'chefe_organizacao' ? data.organizationId : null
            };

            // Só incluir password se foi fornecida
            if (data.password && data.password.trim()) {
                updateData.password = data.password;
            }

            const response = await api.patch(`/api/admin/users/${selectedUser.id}`, updateData);

            if (response.data.success) {
                await fetchUsers();
                setShowEditModal(false);
                setSelectedUser(null);
                reset();
            }
        } catch (error: any) {
            console.error('Erro ao editar utilizador:', error);
            alert(error.response?.data?.error || 'Erro ao editar utilizador');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Alternar status do utilizador
    const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/api/admin/users/${userId}/status`, {
                active: !currentStatus
            });
            await fetchUsers();
        } catch (error) {
            console.error('Erro ao alterar status:', error);
        }
    };

    // Eliminar utilizador
    const deleteUser = async (userId: string) => {
        if (!confirm('Tem certeza que deseja eliminar este utilizador?')) return;

        try {
            await api.delete(`/api/admin/users/${userId}`);
            await fetchUsers();
        } catch (error) {
            console.error('Erro ao eliminar utilizador:', error);
        }
    };

    const selectedRole = watch('role');

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return <Shield className="h-4 w-4 text-purple-400" />;
            case 'moderator': return <UserCheck className="h-4 w-4 text-blue-400" />;
            case 'chefe_organizacao': return <Building2 className="h-4 w-4 text-orange-400" />;
            default: return <User className="h-4 w-4 text-gray-400" />;
        }
    };

    const getRoleName = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'moderator': return 'Moderador';
            case 'chefe_organizacao': return 'Chefe de Organização';
            default: return 'Utilizador';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-900 text-purple-300';
            case 'moderator': return 'bg-blue-900 text-blue-300';
            case 'chefe_organizacao': return 'bg-orange-900 text-orange-300';
            default: return 'bg-gray-900 text-gray-300';
        }
    };

    if (loading) {
        return (
            <div className="pt-24 pb-16 bg-gray-900 min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-red-500" />
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
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Gestão de Utilizadores
                            </h1>
                            <p className="text-gray-400">
                                Criar e gerir contas de utilizadores do sistema
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn btn-primary flex items-center mt-4 sm:mt-0"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Utilizador
                        </button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total</p>
                                <p className="text-xl font-bold text-white">{users.length}</p>
                            </div>
                            <Users className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Ativos</p>
                                <p className="text-xl font-bold text-white">
                                    {users.filter(u => u.active).length}
                                </p>
                            </div>
                            <UserCheck className="h-6 w-6 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Admins</p>
                                <p className="text-xl font-bold text-white">
                                    {users.filter(u => u.role === 'admin').length}
                                </p>
                            </div>
                            <Shield className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border-t-4 border-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Chefes Org.</p>
                                <p className="text-xl font-bold text-white">
                                    {users.filter(u => u.role === 'chefe_organizacao').length}
                                </p>
                            </div>
                            <Building2 className="h-6 w-6 text-orange-500" />
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800 p-6 rounded-lg mb-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Pesquisar utilizadores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input pl-10 w-full"
                            />
                        </div>

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="input"
                        >
                            <option value="all">Todos os roles</option>
                            <option value="admin">Administradores</option>
                            <option value="moderator">Moderadores</option>
                            <option value="chefe_organizacao">Chefes de Organização</option>
                            <option value="user">Utilizadores</option>
                        </select>

                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setRoleFilter('all');
                            }}
                            className="btn btn-secondary"
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </motion.div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gray-800 rounded-lg overflow-hidden"
                >
                    {filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">
                                Nenhum utilizador encontrado
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                            Utilizador
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                            Organização
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-white flex items-center">
                                                        {getRoleIcon(user.role)}
                                                        <span className="ml-2">{user.username}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-400 flex items-center mt-1">
                                                        <Mail className="h-3 w-3 mr-1" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                    {getRoleName(user.role)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {user.organizationName ? (
                                                    <span className="text-sm text-white flex items-center">
                                                        <Building2 className="h-4 w-4 mr-1 text-orange-400" />
                                                        {user.organizationName}
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-gray-500">N/A</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.active
                                                    ? 'bg-green-900 text-green-300'
                                                    : 'bg-red-900 text-red-300'
                                                    }`}>
                                                    {user.active ? (
                                                        <>
                                                            <UserCheck className="h-3 w-3 mr-1" />
                                                            Ativo
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UserX className="h-3 w-3 mr-1" />
                                                            Inativo
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditModal(true);
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => toggleUserStatus(user.id, user.active)}
                                                        className={`transition-colors ${user.active
                                                            ? 'text-red-400 hover:text-red-300'
                                                            : 'text-green-400 hover:text-green-300'
                                                            }`}
                                                        title={user.active ? 'Desativar' : 'Ativar'}
                                                    >
                                                        {user.active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                                    </button>

                                                    <button
                                                        onClick={() => deleteUser(user.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Create User Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <CreateUserModal
                        organizations={organizations}
                        onClose={() => {
                            setShowCreateModal(false);
                            reset();
                        }}
                        onSubmit={handleCreateUser}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        selectedRole={selectedRole}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {showEditModal && selectedUser && (
                    <EditUserModal
                        user={selectedUser}
                        organizations={organizations}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedUser(null);
                            reset();
                        }}
                        onSubmit={handleEditUser}
                        register={register}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        selectedRole={selectedRole}
                        isSubmitting={isSubmitting}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

// Modal para criar utilizador
const CreateUserModal: React.FC<any> = ({
    organizations,
    onClose,
    onSubmit,
    register,
    handleSubmit,
    errors,
    showPassword,
    setShowPassword,
    selectedRole,
    isSubmitting
}) => {
    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Criar Novo Utilizador</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Nome de Utilizador *</label>
                                <input
                                    type="text"
                                    className="input"
                                    placeholder="username"
                                    {...register("username", {
                                        required: "Nome de utilizador é obrigatório",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message: "Apenas letras, números e underscore"
                                        }
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">Email *</label>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder="user@example.com"
                                    {...register("email", {
                                        required: "Email é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Password *</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input pr-10"
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "Password é obrigatória",
                                        minLength: { value: 8, message: "Mínimo 8 caracteres" }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Role *</label>
                                <select
                                    className="input"
                                    {...register("role", { required: "Role é obrigatório" })}
                                >
                                    <option value="">Selecionar role</option>
                                    <option value="user">Utilizador</option>
                                    <option value="chefe_organizacao">Chefe de Organização</option>
                                    <option value="moderator">Moderador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                                )}
                            </div>

                            {selectedRole === 'chefe_organizacao' && (
                                <div>
                                    <label className="block text-white mb-2">Organização *</label>
                                    <select
                                        className="input"
                                        {...register("organizationId", {
                                            required: selectedRole === 'chefe_organizacao' ? "Organização é obrigatória" : false
                                        })}
                                    >
                                        <option value="">Selecionar organização</option>
                                        {organizations.map((org: any) => (
                                            <option key={org.id} value={org.id}>{org.nome}</option>
                                        ))}
                                    </select>
                                    {errors.organizationId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.organizationId.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                defaultChecked={true}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                {...register("active")}
                            />
                            <label htmlFor="active" className="ml-2 text-white">
                                Conta ativa
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        A criar...
                                    </>
                                ) : (
                                    'Criar Utilizador'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Modal para editar utilizador
const EditUserModal: React.FC<any> = ({
    user,
    organizations,
    onClose,
    onSubmit,
    register,
    handleSubmit,
    errors,
    showPassword,
    setShowPassword,
    selectedRole,
    isSubmitting
}) => {
    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal-content max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">Editar Utilizador</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Nome de Utilizador *</label>
                                <input
                                    type="text"
                                    className="input"
                                    defaultValue={user.username}
                                    {...register("username", {
                                        required: "Nome de utilizador é obrigatório",
                                        minLength: { value: 3, message: "Mínimo 3 caracteres" }
                                    })}
                                />
                                {errors.username && (
                                    <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">Email *</label>
                                <input
                                    type="email"
                                    className="input"
                                    defaultValue={user.email}
                                    {...register("email", {
                                        required: "Email é obrigatório",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Email inválido"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-white mb-2">Nova Password (deixar vazio para manter atual)</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input pr-10"
                                    placeholder="••••••••"
                                    {...register("password", {
                                        minLength: { value: 8, message: "Mínimo 8 caracteres" }
                                    })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white mb-2">Role *</label>
                                <select
                                    className="input"
                                    defaultValue={user.role}
                                    {...register("role", { required: "Role é obrigatório" })}
                                >
                                    <option value="user">Utilizador</option>
                                    <option value="chefe_organizacao">Chefe de Organização</option>
                                    <option value="moderator">Moderador</option>
                                    <option value="admin">Administrador</option>
                                </select>
                                {errors.role && (
                                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                                )}
                            </div>

                            {selectedRole === 'chefe_organizacao' && (
                                <div>
                                    <label className="block text-white mb-2">Organização *</label>
                                    <select
                                        className="input"
                                        defaultValue={user.organizationId}
                                        {...register("organizationId", {
                                            required: selectedRole === 'chefe_organizacao' ? "Organização é obrigatória" : false
                                        })}
                                    >
                                        <option value="">Selecionar organização</option>
                                        {organizations.map((org: any) => (
                                            <option key={org.id} value={org.id}>{org.nome}</option>
                                        ))}
                                    </select>
                                    {errors.organizationId && (
                                        <p className="text-red-500 text-sm mt-1">{errors.organizationId.message}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                defaultChecked={user.active}
                                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                {...register("active")}
                            />
                            <label htmlFor="active" className="ml-2 text-white">
                                Conta ativa
                            </label>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <button type="button" onClick={onClose} className="btn btn-secondary">
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`btn btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                        A guardar...
                                    </>
                                ) : (
                                    'Guardar Alterações'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

// Modal para detalhes da candidatura (usado no AdminDashboard)
const ApplicationDetailModal: React.FC<{
    application: any;
    organization: any;
    onClose: () => void;
    onStatusChange: (status: string, notas?: string) => void;
}> = ({ application, organization, onClose, onStatusChange }) => {
    const [newStatus, setNewStatus] = useState(application.estado);
    const [notas, setNotas] = useState(application.notasAdmin || '');

    const handleSubmit = () => {
        onStatusChange(newStatus, notas);
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

                            <div className="bg-gray-700 p-4 rounded-lg