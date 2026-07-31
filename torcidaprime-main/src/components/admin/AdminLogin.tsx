import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Shield, Lock, Mail, Loader2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('--- Iniciando Login Supabase ---');
      
      const { data, error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginErr) throw loginErr;

      const user = data.user;

      console.log('✅ Login Sucedido');
      console.log('Email:', user?.email);

      if (user?.email?.toLowerCase() !== 'torcidaprime01@gmail.com') {
        setError('Acesso negado. Portal restrito ao administrador.');
        await supabase.auth.signOut();
        return;
      }
    } catch (err: any) {
      console.error('❌ Erro Supabase Auth:', err.message);
      setError(err.message || 'Falha no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-4 shadow-lg shadow-gold/20 border-2 border-gold flex-shrink-0 bg-gold">
            <img 
              src="https://i.imgur.com/UFZMD9V.png" 
              alt="Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 font-black italic tracking-tighter uppercase">
            TORCIDA <span className="text-gold">PRIME</span>
          </h1>
          <p className="text-neutral-400 text-sm">Portal do Vendedor</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="seu@dominio.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-12 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-gold transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verificando...</span>
              </>
            ) : (
              'Entrar no Portal'
            )}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-neutral-500 text-xs text-balance">
            Acesso restrito para administradores da Torcida Prime.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-gold text-xs font-bold hover:underline"
          >
            Voltar para a Loja
          </button>
        </div>
      </motion.div>
    </div>
  );
};
