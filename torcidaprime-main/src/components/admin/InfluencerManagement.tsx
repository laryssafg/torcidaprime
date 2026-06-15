import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check, Search } from 'lucide-react';
import { influencerService } from '../../services/influencerService';
import { adminService } from '../../services/adminService';
import { Influencer } from '../../types';

export const InfluencerManagement: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    email: '',
    whatsapp: '',
    cupom: '',
    senha: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [infData, cupData] = await Promise.all([
      influencerService.getInfluencers(),
      adminService.getCoupons()
    ]);
    setInfluencers(infData);
    setCoupons(cupData || []);
    setLoading(false);
  };

  const loadInfluencers = async () => {
    setLoading(true);
    const data = await influencerService.getInfluencers();
    setInfluencers(data);
    setLoading(false);
  };

  const handleOpenModal = (inf?: Influencer) => {
    if (inf) {
      setFormData({
        id: inf.id,
        nome: inf.nome,
        email: inf.email,
        whatsapp: inf.whatsapp,
        cupom: inf.cupom,
        senha: '', // leave empty when editing
        status: inf.status
      });
    } else {
      setFormData({
        id: '',
        nome: '',
        email: '',
        whatsapp: '',
        cupom: '',
        senha: '',
        status: 'ativo'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) {
      // Update
      const updates: any = {
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        cupom: formData.cupom,
        status: formData.status
      };
      await influencerService.updateInfluencer(formData.id, updates, formData.senha ? formData.senha : undefined);
    } else {
      // Create
      if (!formData.senha) {
        alert("A senha é obrigatória para novos influenciadores.");
        return;
      }
      await influencerService.addInfluencer({
        nome: formData.nome,
        email: formData.email,
        whatsapp: formData.whatsapp,
        cupom: formData.cupom,
        status: formData.status
      }, formData.senha);
    }
    setIsModalOpen(false);
    loadInfluencers();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este influenciador?")) {
      await influencerService.deleteInfluencer(id);
      loadInfluencers();
    }
  };

  const filtered = influencers.filter(i => 
    i.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.cupom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h3 className="text-xl font-bold">Gestão de Influenciadores</h3>
          <p className="text-neutral-400 text-sm mt-1">
            Cadastre parceiros e vincule cupons de desconto.
          </p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#fedf00] text-black px-4 py-2 rounded-xl font-bold hover:bg-[#ffed4a] transition-colors"
        >
          <Plus size={20} />
          Novo Influenciador
        </button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
        <input 
          type="text"
          placeholder="Buscar por nome ou cupom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-[#fedf00] outline-none"
        />
      </div>

      {loading ? (
        <div className="text-center py-10 text-neutral-500">Carregando influenciadores...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-sm">
                <th className="pb-3 font-medium">Nome</th>
                <th className="pb-3 font-medium">Contato</th>
                <th className="pb-3 font-medium">Cupom</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {filtered.map(inf => (
                <tr key={inf.id} className="hover:bg-black/20">
                  <td className="py-4">
                    <div className="font-semibold">{inf.nome}</div>
                  </td>
                  <td className="py-4 text-sm text-neutral-400">
                    <div>{inf.email}</div>
                    <div className="text-xs">{inf.whatsapp}</div>
                  </td>
                  <td className="py-4">
                    <span className="bg-neutral-800 px-2 py-1 rounded text-xs font-mono text-[#fedf00]">
                      {inf.cupom}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${inf.status === 'ativo' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {inf.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenModal(inf)}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-blue-400"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(inf.id)}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-red-400"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-neutral-500">Nenhum influenciador encontrado.</div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-2xl w-full max-w-md border border-neutral-800 overflow-hidden">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-xl font-bold">{formData.id ? 'Editar Influenciador' : 'Novo Influenciador'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Nome</label>
                <input 
                  type="text" 
                  required
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">E-mail (Login)</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">WhatsApp</label>
                  <input 
                    type="text" 
                    value={formData.whatsapp}
                    onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Cupom Vinculado</label>
                  <select 
                    required
                    value={formData.cupom}
                    onChange={e => setFormData({...formData, cupom: e.target.value})}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                  >
                    <option value="" disabled>Selecione um cupom</option>
                    {coupons.map(c => (
                      <option key={c.id} value={c.code}>{c.code} ({c.discountPercent}%)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">
                  {formData.id ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha de Acesso'}
                </label>
                <input 
                  type="password" 
                  required={!formData.id}
                  value={formData.senha}
                  onChange={e => setFormData({...formData, senha: e.target.value})}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Status</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                  className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-2 focus:border-[#fedf00] outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors font-bold"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#fedf00] hover:bg-[#ffed4a] text-black rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
