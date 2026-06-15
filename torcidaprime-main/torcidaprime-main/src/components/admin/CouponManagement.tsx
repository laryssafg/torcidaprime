import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  RefreshCw,
  User,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    responsible: '',
    discountPercent: ''
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const data = await adminService.getCoupons();
    setCoupons(data || []);
    setLoading(false);
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.addCoupon(
        newCoupon.code.toUpperCase().trim(),
        newCoupon.responsible,
        parseFloat(newCoupon.discountPercent)
      );
      setNewCoupon({ code: '', responsible: '', discountPercent: '' });
      setIsAdding(false);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar cupom.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este cupom?')) {
      await adminService.deleteCoupon(id);
      fetchCoupons();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Gerenciamento de Cupons</h3>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-gold text-black px-4 py-2 rounded-xl font-bold hover:bg-gold/90 transition-all shadow-lg shadow-gold/10"
        >
          {isAdding ? <RefreshCw size={18} /> : <Plus size={18} />}
          {isAdding ? 'Ver Lista' : 'Novo Cupom'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8"
          >
            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Código do Cupom</label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                  <input 
                    type="text" 
                    required
                    value={newCoupon.code}
                    onChange={e => setNewCoupon({...newCoupon, code: e.target.value})}
                    placeholder="EX: PROMO10"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Responsável</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                  <input 
                    type="text" 
                    required
                    value={newCoupon.responsible}
                    onChange={e => setNewCoupon({...newCoupon, responsible: e.target.value})}
                    placeholder="Nome do influencer/vendedor"
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-2">Desconto (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                    <input 
                      type="number" 
                      required
                      min="1"
                      max="100"
                      value={newCoupon.discountPercent}
                      onChange={e => setNewCoupon({...newCoupon, discountPercent: e.target.value})}
                      placeholder="10"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="bg-gold text-black p-3.5 rounded-xl font-bold hover:bg-gold/90 transition-all flex items-center justify-center min-w-[60px]"
                >
                  <Plus size={24} />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {coupons.map((coupon) => (
              <div key={coupon.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center text-gold">
                    <Ticket size={24} />
                  </div>
                  <div>
                    <h4 className="font-black text-xl text-white tracking-tight">{coupon.code}</h4>
                    <p className="text-neutral-500 text-xs uppercase font-bold tracking-widest">{coupon.responsible}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gold">{coupon.discountPercent}</span>
                    <span className="text-neutral-400 font-bold">%</span>
                  </div>
                  <div className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest bg-black px-2 py-1 rounded-md border border-neutral-800">
                    Desconto Ativo
                  </div>
                </div>
              </div>
            ))}
            
            {coupons.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center text-neutral-500 border-2 border-dashed border-neutral-800 rounded-3x">
                Nenhum cupom cadastrado ainda.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
