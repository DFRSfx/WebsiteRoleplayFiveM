import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LoginFormData } from '../types';
import { useForm } from 'react-hook-form';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  ArrowRight
} from 'lucide-react';

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  // Timer para desbloqueio automático
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimeRemaining > 0) {
      interval = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const onSubmit = async (data: LoginFormData) => {
    if (isLocked) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const success = await login(data.email, data.password, rememberMe);

      if (success) {
        // Reset tentativas em caso de sucesso
        setLoginAttempts(0);
        setIsLocked(false);

        // Pequeno delay para mostrar sucesso
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimeRemaining(900); // 15 minutos
          setError('Conta temporariamente bloqueada devido a muitas tentativas falhadas. Tente novamente em 15 minutos.');
        } else {
          setError(`Credenciais inválidas. ${5 - newAttempts} tentativas restantes.`);
        }
      }
    } catch (err: any) {
      if (err.response?.status === 423) {
        setIsLocked(true);
        setLockTimeRemaining(900);
        setError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
      } else {
        setError(err.response?.data?.error || 'Erro interno do servidor. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = watch('email');
  const password = watch('password');
  const isFormValid = email && password && password.length >= 6;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-6"
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-400">
              Entre na sua conta do EnigmaRP
            </p>
          </div>

          {/* Lock Warning */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/50 border border-red-700 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <p className="text-red-300 font-medium">Conta Bloqueada</p>
                    <p className="text-red-200 text-sm">
                      Desbloqueio em: {formatTime(lockTimeRemaining)}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && !isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/50 border border-red-700 rounded-lg p-4"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`input pl-10 pr-4 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-red-600'
                    }`}
                  placeholder="seu@email.com"
                  {...register("email", {
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido"
                    }
                  })}
                />
                {email && !errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-1 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className={`input pl-10 pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-red-600'
                    }`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password é obrigatória",
                    minLength: {
                      value: 6,
                      message: "Password deve ter pelo menos 6 caracteres"
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm mt-1 flex items-center"
                >
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password.message}
                </motion.p>
              )}

              {/* Password Strength Indicator */}
              {password && password.length > 0 && (
                <div className="mt-2">
                  <div className="flex space-x-1">
                    <div className={`h-1 w-full rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div className={`h-1 w-full rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <div className={`h-1 w-full rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`} />
                    <div className={`h-1 w-full rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-600'}`} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Força da password: {
                      password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                        ? 'Forte'
                        : password.length >= 6
                          ? 'Média'
                          : 'Fraca'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 bg-gray-700 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me por 30 dias
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Esqueceu a password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || isLocked || !isFormValid}
              whileHover={{ scale: isSubmitting || isLocked ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 ${isSubmitting || isLocked || !isFormValid
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  A entrar...
                </>
              ) : isLocked ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Conta Bloqueada
                </>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </motion.button>

            {/* Login Attempts Indicator */}
            {loginAttempts > 0 && loginAttempts < 5 && (
              <div className="text-center">
                <div className="flex justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i < loginAttempts ? 'bg-red-500' : 'bg-gray-600'
                        }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {loginAttempts} de 5 tentativas utilizadas
                </p>
              </div>
            )}
          </motion.form>

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-6 border-t border-gray-700"
          >
            <p className="text-gray-400 text-sm">
              Não tem conta?{' '}
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 font-medium transition-colors"
              >
                Registe-se aqui
              </Link>
            </p>
          </motion.div>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <p className="text-xs text-gray-500">
              <Shield className="h-3 w-3 inline mr-1" />
              Ligação segura protegida por SSL
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1605194251945-9eb4b5b20c9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 to-black/80" />

        <div className="relative flex flex-col justify-center items-center text-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              ENIGMA<span className="text-red-400">RP</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 max-w-md">
              Junte-se à melhor experiência de roleplay em FiveM
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">500+ Jogadores Online</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Servidor 24/7</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Anti-Cheat Ativo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;