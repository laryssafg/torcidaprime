import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
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

import { getProductMedia } from '../../utils';

export const AdminDashboard: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesData, productsData] = await Promise.all([
          adminService.getSales(),
          adminService.getProducts()
        ]);
        // Only include items of type 'sale' to avoid double counting with full orders in the same collection
        const filteredSales = (salesData || []).filter((s: any) => s.type === 'sale' || (!s.type && s.productId));
        setSales(filteredSales);
        setProducts(productsData || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculations
  const getSaleDate = (sale: any) => {
    const rawDate = sale.date || sale.criadoEm;
    if (rawDate instanceof Timestamp) return rawDate.toDate();
    if (rawDate && typeof rawDate.toDate === 'function') return rawDate.toDate();
    return new Date(rawDate || Date.now());
  };

  const totalRevenue = sales.reduce((acc, sale) => {
    const price = Number(sale.price || 0);
    const qty = Number(sale.qty || 1);
    const personalizationPrice = Number(sale.personalization?.additionalPrice || 0);
    return acc + (price + personalizationPrice) * qty;
  }, 0);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlySales = sales.filter(sale => {
    const saleDate = getSaleDate(sale);
    return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
  });

  const liquidProfit = sales.reduce((acc, sale) => {
    const price = Number(sale.price || 0);
    const qty = Number(sale.qty || 1);
    const discount = Number(sale.discountAmount || 0);
    const personalizationPrice = Number(sale.personalization?.additionalPrice || 0);
    
    // Profit = (50% of base price) + personalization profit (assumed 70% margin on personalization) - discount
    // If no specific rule given for personalization, we assume cost is low since it's service based
    const baseProfit = (price + discount) * 0.5;
    const profit = (baseProfit + (personalizationPrice * 0.7)) - discount;
    
    return acc + (profit * qty);
  }, 0);

  // Group by month for chart
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const chartData = months.map((month, index) => {
    const monthSales = sales.filter(s => {
      const d = getSaleDate(s);
      return d.getMonth() === index && d.getFullYear() === currentYear;
    });
    return {
      name: month,
      revenue: monthSales.reduce((acc, s) => {
        const p = Number(s.price || 0);
        const q = Number(s.qty || 1);
        const pers = Number(s.personalization?.additionalPrice || 0);
        return acc + (p + pers) * q;
      }, 0)
    };
  });

  const popularProduct = [...products].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
  
  const categorySales: Record<string, number> = {};
  sales.forEach(sale => {
    categorySales[sale.category] = (categorySales[sale.category] || 0) + sale.qty;
  });
  const popularCategory = Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0];

  if (loading) return <div className="flex items-center justify-center p-20"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  const stats = [
    { label: 'Faturamento Total', value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Vendas no Mês', value: monthlySales.length.toString(), icon: ShoppingBag, color: 'text-gold' },
    { label: 'Lucro Líquido', value: `R$ ${liquidProfit.toFixed(2)}`, icon: TrendingUp, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-black/50 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Acumulado</span>
            </div>
            <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
            <h4 className="text-3xl font-bold mt-1">{stat.value}</h4>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Faturamento Mensal</h3>
            <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
              <ArrowUpRight size={16} />
              <span>Crescendo</span>
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

        {/* Populars */}
        <div className="space-y-8">
          <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-gold" />
              Destaques
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={getProductMedia(popularProduct)[0]} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Produto mais popular</p>
                  <p className="text-white font-medium">{popularProduct?.name || 'Nenhum venda ainda'}</p>
                  <p className="text-gold text-sm mt-1">{popularProduct?.salesCount || 0} vendas</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-black border border-neutral-800 flex items-center justify-center shrink-0">
                  <PieChartIcon size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Categoria mais popular</p>
                  <p className="text-white font-medium">{popularCategory?.[0] || 'Nenhuma venda ainda'}</p>
                  <p className="text-blue-500 text-sm mt-1">{popularCategory?.[1] || 0} vendas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 p-8 rounded-3xl">
            <h3 className="text-lg font-bold mb-2">Meta de Vendas</h3>
            <p className="text-neutral-400 text-sm mb-6">Você atingiu 65% da sua meta mensal.</p>
            <div className="w-full bg-neutral-800 h-3 rounded-full overflow-hidden">
              <div className="h-full bg-gold w-[65%] rounded-full shadow-[0_0_10px_rgba(254,223,0,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
