import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  PieChart as PieChartIcon,
  ClipboardList
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';
import { Timestamp } from 'firebase/firestore';

import { getProductMedia, safeLower, safeText } from '../../utils';

export const AdminDashboard: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Dashboard: Iniciando busca de dados...");
        const [salesData, productsData] = await Promise.all([
          adminService.getSales(),
          adminService.getProducts()
        ]);
        
        console.log(`Dashboard: Dados recebidos. Pedidos: ${(salesData || []).length}, Produtos: ${(productsData || []).length}`);
        
        setSales(salesData || []);
        setProducts(productsData || []);
      } catch (error) {
        console.error("Erro no Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSaleDate = (sale: any) => {
    const rawDate = sale.date || sale.criadoEm || sale.createdAt;
    if (rawDate instanceof Timestamp) return rawDate.toDate();
    if (rawDate && typeof rawDate.toDate === 'function') return rawDate.toDate();
    if (typeof rawDate === 'string' || typeof rawDate === 'number') return new Date(rawDate);
    return new Date();
  };

  // Filter paid sales for financial metrics
  const paidSales = (Array.isArray(sales) ? sales : []).filter(pedido =>
    String(pedido.status || "").trim().toLowerCase() === "pago"
  );

  // Robust revenue calculation logic requested by user - Only PAID orders
  const calculateTotalRevenue = () => {
    return paidSales.reduce((acc, pedido) => {
      const valorRaw = pedido.total ?? pedido.totalPedido ?? pedido.valorTotal ?? pedido.subtotal ?? 0;
      const valor = Number(valorRaw);
      return acc + (Number.isNaN(valor) ? 0 : valor);
    }, 0);
  };

  const totalRevenue = calculateTotalRevenue();
  
  const getUniqueCustomersCount = () => {
    const uniqueIds = new Set();
    sales.forEach(sale => {
      const client = sale.cliente || {};
      const id = safeLower(client.email || client.whatsapp);
      if (id) uniqueIds.add(id);
    });
    return uniqueIds.size;
  };

  const uniqueCustomersCount = getUniqueCustomersCount();
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlySales = paidSales.filter(sale => {
    const saleDate = getSaleDate(sale);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  const liquidProfit = monthlySales.reduce((acc, sale) => {
    const valorRaw = sale.total ?? sale.totalPedido ?? sale.valorTotal ?? sale.subtotal ?? 0;
    const valor = Number(valorRaw);
    if (Number.isNaN(valor)) return acc;
    return acc + (valor * 0.5); // 50% margin requested
  }, 0);

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const chartData = months.map((month, index) => {
    const monthSales = paidSales.filter(s => {
      const d = getSaleDate(s);
      return d.getMonth() === index && d.getFullYear() === currentYear;
    });
    
    const revenue = monthSales.reduce((acc, p) => {
      const valor = Number(p.total ?? p.totalPedido ?? p.valorTotal ?? p.subtotal ?? 0);
      return acc + (Number.isNaN(valor) ? 0 : valor);
    }, 0);
                    
    return { name: month, revenue };
  });

  const popularProduct = [...products].sort((a, b) => (Number(b.salesCount) || 0) - (Number(a.salesCount) || 0))[0];
  
  const categorySales: Record<string, number> = {};
  paidSales.forEach(sale => {
    const cat = safeText(sale.category || "Geral");
    categorySales[cat] = (categorySales[cat] || 0) + (Number(sale.qty) || 1);
  });
  const popularCategory = Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0];

  if (loading) return <div className="flex items-center justify-center p-20"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  const stats = [
    { label: 'Faturamento Total', value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Produtos Cadastrados', value: products.length.toString(), icon: ShoppingBag, color: 'text-gold' },
    { label: 'Clientes Únicos', value: uniqueCustomersCount.toString(), icon: Users, color: 'text-blue-500' },
    { label: 'Pedidos Realizados', value: sales.length.toString(), icon: ClipboardList, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-8" id="admin-dashboard-layout">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            id={`stat-card-${i}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-black/50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic text-right leading-tight">Total<br/>Geral</span>
            </div>
            <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
            <h4 className="text-3xl font-bold mt-1 text-white">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Faturamento Mensal ({currentYear})</h3>
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <ArrowUpRight size={16} />
              <span>Real</span>
            </div>
          </div>
          <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fedf00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fedf00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#262626" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#525252" fontSize={12} tickMargin={10} />
                <YAxis axisLine={false} tickLine={false} stroke="#525252" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#fedf00' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#fedf00" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-gold" />
              Destaques
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {popularProduct ? (
                    <img src={getProductMedia(popularProduct)[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ShoppingBag size={20} className="text-neutral-700" />
                  )}
                </div>
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Produto mais popular</p>
                  <p className="text-white font-medium">{popularProduct?.name || 'Nenhuma venda ainda'}</p>
                  <p className="text-gold text-sm mt-1">{popularProduct?.salesCount || 0} compras</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 flex items-center justify-center shrink-0">
                  <PieChartIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Categoria líder</p>
                  <p className="text-white font-medium">{popularCategory?.[0] || 'Nenhuma venda ainda'}</p>
                  <p className="text-blue-500 text-sm mt-1">{popularCategory?.[1] || 0} itens saíram</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 p-8 rounded-3xl"
          >
            <h3 className="text-lg font-bold mb-2 text-white">Lucro Estimado</h3>
            <p className="text-neutral-400 text-sm mb-6">
              Baseado na margem de 50% dos pedidos deste mês.
            </p>
            <h4 className="text-2xl font-bold text-gold">{`R$ ${liquidProfit.toFixed(2)}`}</h4>
            <div className="w-full bg-neutral-800 h-2 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-gold w-full rounded-full opacity-30"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
