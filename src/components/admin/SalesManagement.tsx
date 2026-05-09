import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, safeLower, safeText } from '../../utils';
import { ShoppingCart, User, Calendar, Tag, Search, Filter, ChevronDown, Package, Phone, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  const normalizeOrder = (order: any) => {
    if (!order) return null;
    
    // Identificar se é um pedido completo ou item avulso
    const isFullOrder = order.type === 'order';
    
    // Normalizar Data
    const rawDate = order.date || order.criadoEm || order.createdAt;
    let date: Date;
    if (rawDate instanceof Timestamp) {
      date = rawDate.toDate();
    } else if (rawDate && typeof rawDate.toDate === 'function') {
      date = rawDate.toDate();
    } else if (typeof rawDate === 'string' || typeof rawDate === 'number') {
      date = new Date(rawDate);
    } else {
      date = new Date();
    }

    // Normalizar Itens (Sempre retornar um array)
    let items = [];
    if (isFullOrder && Array.isArray(order.itens)) {
      items = order.itens.map((item: any) => ({
        productName: item.productName || 'Produto',
        quantity: item.quantity || 1,
        price: item.price || 0
      }));
    } else {
      // Caso seja um item avulso (sale), transformamos em estrutura de item de pedido
      items = [{
        productName: order.productName || 'Produto',
        quantity: order.qty || 1,
        price: order.price || 0
      }];
    }

    // Calcular Total se não existir
    const total = Number(order.total || items.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0));

    // Normalizar Cupom
    let coupon = '';
    if (order.couponCode) coupon = String(order.couponCode);
    else if (order.cupom) {
      if (typeof order.cupom === 'string') coupon = order.cupom;
      else if (typeof order.cupom === 'object' && order.cupom.code) coupon = String(order.cupom.code);
    }

    return {
      id: order.id,
      customerName: order.cliente?.nome || 'Cliente do Site',
      whatsapp: order.cliente?.whatsapp || '',
      createdAt: date,
      coupon: coupon.trim().toUpperCase(),
      items: items,
      total: total,
      paymentMethod: order.formaPagamento || 'Site',
      status: order.status || 'concluído',
      isOrder: true // Forçamos para true para usar o layout azul em tudo
    };
  };

  const loadSales = async () => {
    try {
      const rawData = await adminService.getSales();
      const data = (Array.isArray(rawData) ? rawData : []) as any[];
      
      // Normalizar todos os dados antes de salvar no estado
      const normalizedData = data
        .map(order => normalizeOrder(order))
        .filter(order => order !== null);

      // Sort by date descending
      const sorted = normalizedData.sort((a: any, b: any) => {
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
      setSales(sorted);
    } catch (error) {
      console.error("Erro na aba Vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir esta venda? Esta ação não pode ser desfeita.')) return;
    
    setDeletingId(id);
    try {
      const success = await adminService.deleteSale(id);
      if (success) {
        setSales(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Erro ao excluir venda.");
      }
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      alert("Erro ao excluir venda.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSales = (Array.isArray(sales) ? sales : []).filter(sale => {
    if (!sale) return false;
    const searchStr = safeLower(searchTerm);
    const customerName = safeLower(sale.customerName);
    const coupon = safeLower(sale.coupon);
    // Verificar se algum item no pedido corresponde à busca
    const matchesItem = sale.items.some((item: any) => safeLower(item.productName).includes(searchStr));
    
    return customerName.includes(searchStr) || 
           coupon.includes(searchStr) ||
           matchesItem;
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
          const date = sale.createdAt;
          const isOrder = true; // Sempre layout completo
          const items = sale.items;
          const couponText = sale.coupon;

          return (
            <div key={sale.id || Math.random().toString()} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-gold/30 transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-500">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">
                        Pedido #{safeText(sale.id).slice(-5).toUpperCase()}
                      </span>
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        Pedido Completo
                      </span>
                      <button 
                        onClick={() => handleDelete(sale.id)}
                        disabled={deletingId === sale.id}
                        className="p-2 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all ml-2"
                        title="Excluir Venda"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-neutral-500" />
                        {safeText(sale.customerName)}
                      </div>
                      {sale.whatsapp && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-neutral-500" />
                          {safeText(sale.whatsapp)}
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
                      {!couponText && (
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
                    {formatCurrency(sale.total)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic">
                      {safeText(sale.paymentMethod)} | {safeText(sale.status).toUpperCase()}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${safeLower(sale.status) === 'cancelado' || safeLower(sale.status) === 'recusado' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                  </div>
                </div>
              </div>
              
              {items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {items.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black/40 p-2 rounded-lg text-xs flex justify-between items-center">
                      <span className="text-neutral-300">{item.quantity}x {safeText(item.productName)}</span>
                      <span className="text-neutral-500">{formatCurrency(item.price)}</span>
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
