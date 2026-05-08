import React, { useState } from 'react';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { influencerService } from '../../services/influencerService';
import { Influencer } from '../../types';

interface InfluencerLoginProps {
  onLogin: (influencer: Influencer) => void;
  onBackToHome: () => void;
}

export const InfluencerLogin: React.FC<InfluencerLoginProps> = ({ onLogin, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const influencer = await influencerService.authenticate(email, password);
      if (influencer) {
        onLogin(influencer);
      } else {
        setError('Credenciais inválidas ou influenciador inativo.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <button 
        onClick={onBackToHome}
        className="absolute top-8 left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar para a loja
      </button>

      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fedf00] rounded-2xl mb-6 shadow-[0_0_40px_rgba(254,223,0,0.3)]">
            <span className="text-black font-black text-2xl">TP</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase italic tracking-widest">
            Portal do<br/><span className="text-[#fedf00]">Influenciador</span>
          </h1>
          <p className="text-neutral-500 mt-4 font-medium">
            Acompanhe suas vendas e métricas de cupom
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-neutral-500 mb-2 ml-1 tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#fedf00] transition-colors"
                  placeholder="Seu e-mail cadastrado"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-neutral-500 mb-2 ml-1 tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-neutral-800 text-white rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#fedf00] transition-colors"
                  placeholder="Sua senha de acesso"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fedf00] text-black font-black uppercase italic tracking-widest py-4 rounded-xl mt-8 hover:bg-[#ffed4a] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              'Acessar Painel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
