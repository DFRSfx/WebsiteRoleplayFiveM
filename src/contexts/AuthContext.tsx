import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configuração do Axios
export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('enigma_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('enigma_token');
      localStorage.removeItem('enigma_user');
      window.location.href = '/entrar';
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'chefe_organizacao' | 'moderator' | 'admin';
  lastLogin?: string;
  organizationId?: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isModerator: () => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar se utilizador está logado ao carregar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('enigma_token');
        const savedUser = localStorage.getItem('enigma_user');

        if (token && savedUser) {
          const userData = JSON.parse(savedUser);

          // Verificar se o token ainda é válido
          try {
            const response = await api.get('/api/auth/verify');
            if (response.data.valid) {
              setUser(userData);
              setIsLoggedIn(true);
            } else {
              // Token inválido, remover dados
              localStorage.removeItem('enigma_token');
              localStorage.removeItem('enigma_user');
            }
          } catch (error) {
            // Erro na verificação, assumir que está logado se temos os dados
            setUser(userData);
            setIsLoggedIn(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, remember = false): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
        remember
      });

      if (response.data.success) {
        const { token, user: userData } = response.data;

        // Guardar token e dados do utilizador
        localStorage.setItem('enigma_token', token);
        localStorage.setItem('enigma_user', JSON.stringify(userData));

        setUser(userData);
        setIsLoggedIn(true);

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Erro no login:', error);

      // Re-throw para que o componente possa lidar com o erro
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });

      return response.data.success;
    } catch (error: any) {
      console.error('Erro no registo:', error);
      throw error;
    }
  };

  const logout = () => {
    // Remover dados do localStorage
    localStorage.removeItem('enigma_token');
    localStorage.removeItem('enigma_user');

    // Limpar estado
    setUser(null);
    setIsLoggedIn(false);

    // Redirecionar para página inicial
    window.location.href = '/';
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;

    const roleHierarchy = {
      'user': 1,
      'chefe_organizacao': 2,
      'moderator': 3,
      'admin': 4
    };

    const userRoleLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[role as keyof typeof roleHierarchy] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const isAdmin = (): boolean => {
    return user?.role === 'admin';
  };

  const isModerator = (): boolean => {
    return hasRole('moderator');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('enigma_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        register,
        hasRole,
        isAdmin,
        isModerator,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};