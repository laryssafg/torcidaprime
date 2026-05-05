import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';
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
      console.log('--- Debug Firebase Connection ---');
      console.log('Project ID:', firebaseConfig.projectId);
      console.log('Auth Domain:', firebaseConfig.authDomain);
      console.log('API Key exists:', !!firebaseConfig.apiKey);
      console.log('--- Iniciando Login ---');
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('✅ Login Sucedido');
      console.log('Email:', user.email);
      console.log('UID:', user.uid);
      console.log('Auth CurrentUser:', auth.currentUser);

      if (user.email?.toLowerCase() !== 'torcidaprime01@gmail.com') {
        setError('Acesso negado. Portal restrito ao administrador.');
        await auth.signOut();
        return;
      }
    } catch (err: any) {
      console.error('❌ Erro Firebase Auth:', err.code, err.message);
      
      const errorCode = err.code;

      switch (errorCode) {
        case 'auth/user-not-found':
          setError('Usuário não encontrado. (auth/user-not-found)');
          break;
        case 'auth/wrong-password':
          setError('Senha incorreta. (auth/wrong-password)');
          break;
        case 'auth/invalid-credential':
        case 'auth/invalid-login-credentials':
          setError('Credenciais inválidas. Verifique e-mail e senha. (auth/invalid-credential)');
          break;
        case 'auth/too-many-requests':
          setError('Muitas tentativas bloqueadas temporariamente. (auth/too-many-requests)');
          break;
        case 'auth/network-request-failed':
          setError('Falha de conexão com o Firebase. Verifique se o domínio está autorizado e se há internet. (auth/network-request-failed)');
          break;
        case 'auth/unauthorized-domain':
          setError('Domínio não autorizado no console do Firebase. (auth/unauthorized-domain)');
          break;
        default:
          setError(`Erro: ${errorCode || 'Falha no login'}`);
      }
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
            <div className="space-y-2">
              <p className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-3 rounded-lg border border-red-500/20">
                {error}
              </p>
              
              {error.includes('network-request-failed') && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg flex gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                  <p className="text-[11px] text-amber-200 leading-tight">
                    <strong>Atenção:</strong> Se estiver usando o preview do AI Studio, o Firebase pode bloquear a conexão. Tente testar em localhost ou após o deploy final.
                  </p>
                </div>
              )}

              {/* Modo Debug Temporário */}
              <div className="bg-neutral-800/50 p-2 rounded-md border border-neutral-700 text-center">
                <p className="text-[10px] text-neutral-500 font-mono">
                  DEBUG: {error.match(/\(([^)]+)\)/)?.[1] || 'Unknown Code'}
                </p>
              </div>
            </div>
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
