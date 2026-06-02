import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';
import Button from '../../shared/Button';
import Input from '../../shared/Input';
import { Lock, Mail, Eye, EyeOff, Building2, User, ArrowRight } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(name, email, password);
        setIsLogin(true);
        setError('');
        alert('Conta criada com sucesso! Faça login para continuar.');
      }
    } catch (err) {
      setError(err.message || (isLogin ? 'Erro ao fazer login' : 'Erro ao criar conta'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand & Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-accent2 to-accent p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">PROJING</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            Sistema de<br />
            <span className="text-gold">Orçamentos</span>
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Gere propostas comerciais profissionalmente para armazéns e silos com geomembrana PEAD.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-black text-white">15+</div>
              <div className="text-white/70 text-sm">Anos de experiência</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-black text-white">2.1M</div>
              <div className="text-white/70 text-sm">Toneladas protegidas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-black text-white">45+</div>
              <div className="text-white/70 text-sm">Unidades atendidas</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/50 text-sm">
          © 2026 PROJING Soluções em PEAD
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-bg p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              <Building2 size={32} />
            </div>
            <h1 className="text-3xl font-black font-syne text-white">PROJING<span className="text-gold">Pro</span></h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
            </h2>
            <p className="text-muted">
              {isLogin ? 'Entre com suas credenciais para continuar' : 'Preencha os dados para criar sua conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                  <input 
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-surface border-2 border-border rounded-xl pl-12 pr-4 py-4 text-white placeholder-muted outline-none focus:border-accent transition-colors"
                    required={!isLogin}
                  />
                </div>
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                className="w-full bg-surface border-2 border-border rounded-xl pl-12 pr-4 py-4 text-white placeholder-muted outline-none focus:border-accent transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full bg-surface border-2 border-border rounded-xl pl-12 pr-14 py-4 text-white placeholder-muted outline-none focus:border-accent transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-accent2 hover:text-white text-sm font-medium transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full py-4 text-lg flex items-center justify-center gap-2" disabled={isLoading}>
              {isLoading ? (
                <span>Processando...</span>
              ) : (
                <>
                  {isLogin ? 'Entrar' : 'Criar Conta'}
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-muted">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-accent2 hover:text-white font-medium ml-2 transition-colors"
              >
                {isLogin ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs text-muted font-bold uppercase tracking-wider mb-2">Credenciais de Demo</p>
            <p className="text-sm text-white">Email: <span className="text-accent2">admin@projing.pro</span></p>
            <p className="text-sm text-white">Senha: <span className="text-accent2">admin123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;