import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, safeLower, safeText } from '../../utils';
import { ShoppingCart, User, Calendar, Tag, Search, Filter, ChevronDown, Package, Phone } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const rawData = await adminService.getSales();
      const data = (Array.isArray(rawData) ? rawData : []) as any[];
      
      // Sort by date descending
      const sorted = data.sort((a: any, b: any) => {
        const dateA = a.date instanceof Timestamp ? a.date.toMillis() : (a.criadoEm instanceof Timestamp ? a.criadoEm.toMillis() : 0);
        const dateB = b.date instanceof Timestamp ? b.date.toMillis() : (b.criadoEm instanceof Timestamp ? b.criadoEm.toMillis() : 0);
        return dateB - dateA;
      });
      setSales(sorted);
    } catch (error) {
      console.error("Erro na aba Vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = (Array.isArray(sales) ? sales : []).filter(sale => {
    if (!sale) return false;
    const searchStr = safeLower(searchTerm);
    const customerName = safeLower(sale.cliente?.nome);
    const productName = safeLower(sale.productName);
    const coupon = safeLower(sale.couponCode || sale.cupom);
    
    return customerName.includes(searchStr) || 
           productName.includes(searchStr) || 
           coupon.includes(searchStr);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente, produto ou cupom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-neutral-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-700 transition-colors">
            <Filter size={14} />
            Filtrar
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSales.map((sale) => {
          if (!sale) return null;
          const unsafeDate = sale.date || sale.criadoEm;
          const date = unsafeDate instanceof Timestamp ? unsafeDate.toDate() : new Date();
          const isOrder = sale.type === 'order';
          const items = Array.isArray(sale.itens) ? sale.itens : [];
          const cliente = sale.cliente || {};
          const couponText = safeText(sale.couponCode || sale.cupom);

          return (
            <div key={sale.id || Math.random().toString()} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-gold/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isOrder ? 'bg-blue-500/10 text-blue-500' : 'bg-gold/10 text-gold'}`}>
                    {isOrder ? <Package size={24} /> : <ShoppingCart size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">
                        {isOrder ? `Pedido #${safeText(sale.id).slice(-5).toUpperCase()}` : safeText(sale.productName || 'Produto')}
                      </span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full ${isOrder ? 'bg-blue-500/20 text-blue-400' : 'bg-gold/20 text-gold'}`}>
                        {isOrder ? 'Pedido Completo' : 'Item Avulso'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-neutral-500" />
                        {safeText(cliente.nome) || 'Cliente do Site'}
                      </div>
                      {cliente.whatsapp && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-neutral-500" />
                          {safeText(cliente.whatsapp)}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-neutral-500" />
                        {date.toLocaleDateString('pt-BR')} {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {couponText && (
                        <div className="flex items-center gap-1.5 text-gold">
                          <Tag size={14} />
                          Cupom: {couponText}
                        </div>
                      )}
                      {!couponText && isOrder && (
                        <div className="flex items-center gap-1.5 text-neutral-600">
                          <Tag size={14} />
                          Sem cupom
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="text-2xl font-black text-white">
                    {formatCurrency(sale.total || (Number(sale.price || 0) * (Number(sale.qty || 1))))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic">
                      {safeText(sale.formaPagamento) || 'Site'} | {safeText(sale.status).toUpperCase() || 'CONCLUÍDO'}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${sale.status === 'cancelado' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                  </div>
                </div>
              </div>
              
              {isOrder && items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black/40 p-2 rounded-lg text-xs flex justify-between items-center">
                      <span className="text-neutral-300">{item.quantity || 1}x {safeText(item.productName || 'Produto')}</span>
                      <span className="text-neutral-500">{formatCurrency(item.price || 0)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredSales.length === 0 && (
          <div className="text-center py-20 bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-800 text-neutral-500">
            Nenhuma venda encontrada ainda.
          </div>
        )}
      </div>
    </div>
  );
};
