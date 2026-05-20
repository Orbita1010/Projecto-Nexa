/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Mail, Lock, LogIn, Github, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';

import { dbService } from '../lib/dbService';
import { Loader2, AlertCircle } from 'lucide-react';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'ENTREPRENEUR' | 'INVESTOR'>('ENTREPRENEUR');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // Real Login
        const user = await dbService.login(email);
        if (user.role === 'INVESTOR') {
          navigate('/investors');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Real Register
        const uid = 'user_' + Math.random().toString(36).substr(2, 9);
        const avatarSeed = name.toLowerCase().replace(/\s+/g, '-');
        const user = await dbService.register({
          uid,
          name,
          email,
          role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`,
          bio: role === 'ENTREPRENEUR' 
            ? 'Empreendedor à procura de capital e mentoria.' 
            : 'Investidor interessado em projetos inovadores em Angola.'
        });
        
        if (user.role === 'INVESTOR') {
          navigate('/investors');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocorreu um erro no processo de autenticação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col p-8 md:p-20 justify-center bg-white relative">
        <Link to="/" className="absolute top-10 left-10 text-gray-400 hover:text-nexa-dark flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft size={18} /> Voltar
        </Link>
        
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-nexa-dark rounded-xl flex items-center justify-center mb-6">
               <span className="text-white font-bold text-2xl">N</span>
            </div>
            <h1 className="text-4xl font-display font-bold">
              {isLogin ? "Bem-vindo de volta" : "Criar sua conta NEXA"}
            </h1>
            <p className="text-gray-500">
              Transformando o ecossistema de startups angolano.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 text-sm font-medium border border-red-100">
              <AlertCircle className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Nome Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nelson Camisassa"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-nexa-ghost border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-nexa-teal transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Perfil</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full bg-nexa-ghost border-none rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-nexa-teal transition-all text-sm"
                    >
                      <option value="ENTREPRENEUR">Empreendedor (Tenho um projeto)</option>
                      <option value="INVESTOR">Investidor (Procuro startups)</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email" 
                    required
                    placeholder="exemplo@nexa.ao"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-nexa-ghost border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-nexa-teal transition-all text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-nexa-ghost border-none rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-nexa-teal transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-bold text-nexa-teal hover:underline underline-offset-4">Esqueceu a senha?</button>
              </div>
            )}

            <Button type="submit" className="w-full h-14 text-lg gap-2" disabled={loading}>
               {loading ? (
                 <>
                   <Loader2 className="animate-spin" size={18} /> A carregar...
                 </>
               ) : (
                 isLogin ? "Entrar na Plataforma" : "Criar Conta Pro"
               )}
            </Button>
          </form>

          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
             <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-bold">Ou continuar com</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="gap-2 h-12">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" /> Google
             </Button>
             <Button variant="outline" className="gap-2 h-12">
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" /> LinkedIn
             </Button>
          </div>

          <div className="text-center pt-6">
            <p className="text-gray-500 text-sm">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-nexa-dark hover:text-nexa-teal transition-colors underline underline-offset-4"
              >
                {isLogin ? "Criar conta agora" : "Entrar aqui"}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex bg-nexa-dark p-20 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-nexa-teal/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-nexa-amber/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-8 h-8 bg-nexa-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-base">N</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tighter text-white">NEXA</span>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="inline-flex gap-1">
             {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-1 bg-nexa-teal rounded-full"></div>)}
          </div>
          <h2 className="text-5xl font-display font-bold text-white max-w-lg leading-tight">
            "A NEXA foi crucial para o meu primeiro round de investimento."
          </h2>
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-gray-600 rounded-full border-2 border-nexa-teal overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=maria" alt="Avatar" />
             </div>
             <div>
                <div className="font-bold text-white">Maria Henriques</div>
                <div className="text-nexa-teal text-sm font-medium">CEO da Kandengue Pay</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 opacity-30 relative z-10">
           <div className="space-y-1">
              <div className="text-2xl font-bold text-white">$2.5M</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Financiado</div>
           </div>
           <div className="space-y-1">
              <div className="text-2xl font-bold text-white">45+</div>
              <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">Angels Ativos</div>
           </div>
        </div>
      </div>
    </div>
  );
};
