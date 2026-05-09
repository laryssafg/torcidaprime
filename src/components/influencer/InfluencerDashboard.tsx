import React, { useState, useEffect } from 'react';
import { LogOut, DollarSign, ShoppingBag, Calendar, Activity } from 'lucide-react';
import { influencerService } from '../../services/influencerService';
import { Influencer } from '../../types';

interface InfluencerDashboardProps {
  influencer: Influencer;
  onLogout: () => void;
}

export const InfluencerDashboard: React.FC<InfluencerDashboardProps> = ({ influencer, onLogout }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, [influencer.cupom]);

  const loadSales = async () => {
    try {
      setLoading(true);
      const data = await influencerService.getSalesByCoupon(influencer.cupom);
      
      if (!data || !Array.isArray(data)) {
        setSales([]);
        setLoading(false);
        return;
      }

      // Sort by date descending
      const getSafeDate = (val: any) => {
        if (!val) return new Date(0);
        if (val?.toDate && typeof val.toDate === 'function') return val.toDate();
        if (val?.seconds) return new Date(val.seconds * 1000);
        const d = new Date(val);
        return isNaN(d.getTime()) ? new Date(0) : d;
      };

      const sortedData = [...data].sort((a, b) => {
        const dateA = getSafeDate(a.criadoEm);
        const dateB = getSafeDate(b.criadoEm);
        return dateB.getTime() - dateA.getTime();
      });
      setSales(sortedData);
    } catch (err) {
      console.error("Erro ao carregar vendas no dashboard:", err);
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = (sales || []).reduce((acc, sale) => {
    if (sale?.status === 'Pago') {
      return acc + (Number(sale?.total) || 0);
    }
    return acc;
  }, 0);

  const totalOrders = (sales || []).length;
  
  // Count items if the payload has them, otherwise just use order count
  const totalItemsSold = (sales || []).reduce((acc, sale) => {
    if (sale?.items && Array.isArray(sale.items)) {
      return acc + sale.items.reduce((sum: number, item: any) => sum + (Number(item?.quantity) || 1), 0);
    }
    return acc + 1;
  }, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getValidDate = (pedido: any) => {
    const possibleDates = [
      pedido.criadoEm,
      pedido.createdAt,
      pedido.updatedAt,
      pedido.pagoEm,
      pedido.data
    ];

    for (const value of possibleDates) {
      if (!value) continue;

      // Firebase Timestamp
      if (typeof value.toDate === "function") {
        return value.toDate();
      }

      // Firestore timestamp object
      if (value.seconds) {
        return new Date(value.seconds * 1000);
      }

      // String/date
      const parsed = new Date(value);

      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    return null;
  };

  const formatDate = (sale: any) => {
    const validDate = getValidDate(sale);
    
    if (!validDate) return "Data não informada";

    return validDate.toLocaleDateString("pt-BR") + " " + validDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 bg-neutral-900 border border-neutral-800 p-6 rounded-3xl">
          <div>
            <h1 className="text-2xl font-black uppercase italic tracking-widest text-white">
              Olá, <span className="text-[#fedf00]">{influencer.nome}</span>
            </h1>
            <p className="text-neutral-400 mt-1">
              Acompanhamento de vendas do cupom: <span className="text-[#fedf00] font-mono font-bold">{influencer.cupom}</span>
            </p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-xl transition-colors font-bold text-sm uppercase tracking-wider"
          >
            <LogOut size={16} />
            Sair
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-neutral-500 flex flex-col items-center gap-4">
            <Activity className="animate-pulse text-[#fedf00]" size={40} />
            <p>Carregando seus dados...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-14 h-14 bg-[#fedf00]/10 text-[#fedf00] rounded-2xl flex items-center justify-center">
                  <DollarSign size={28} />
                </div>
                <div>
                  <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">Total Vendido</p>
                  <p className="text-3xl font-black">{formatCurrency(totalRevenue)}</p>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">Pedidos Realizados</p>
                  <p className="text-3xl font-black">{totalOrders}</p>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                  <Activity size={28} />
                </div>
                <div>
                  <p className="text-neutral-400 text-sm font-bold uppercase tracking-wider">Itens Vendidos</p>
                  <p className="text-3xl font-black">{totalItemsSold}</p>
                </div>
              </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-neutral-800 flex items-center gap-3">
                <Calendar className="text-[#fedf00]" size={24} />
                <h2 className="text-xl font-bold">Histórico de Pedidos</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-neutral-950 text-neutral-400 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Data</th>
                      <th className="p-4 font-bold">Cliente</th>
                      <th className="p-4 font-bold">Valor</th>
                      <th className="p-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-neutral-500">
                          Nenhuma venda registrada com o seu cupom ainda.
                        </td>
                      </tr>
                    ) : (
                      sales.map((sale) => (
                        <tr key={sale.id} className="hover:bg-black/20 transition-colors">
                          <td className="p-4 text-sm text-neutral-300">
                            {formatDate(sale)}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">{sale.cliente?.nome || 'Cliente não identificado'}</div>
                          </td>
                          <td className="p-4 font-bold text-[#fedf00]">
                            {formatCurrency(Number(sale.total) || 0)}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              sale.status === 'Pago' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                              sale.status === 'Recusado' || sale.status === 'Cancelado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                            }`}>
                              {sale.status || 'Novo'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
