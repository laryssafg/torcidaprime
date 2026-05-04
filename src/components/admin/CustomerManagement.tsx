import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, Phone, Mail, MapPin, ShoppingBag, Search, ExternalLink } from 'lucide-react';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = (await adminService.getSales()) as any[];
      const uniqueCustomersMap = new Map<string, any>();

      // Extract unique customers from orders
      (data || []).forEach((record: any) => {
        const client = record.cliente;
        if (client && (client.email || client.whatsapp)) {
          const key = client.email || client.whatsapp;
          if (!uniqueCustomersMap.has(key)) {
            uniqueCustomersMap.set(key, {
              ...client,
              lastAddress: record.endereco,
              totalOrders: 0,
              totalSpent: 0,
              lastOrder: record.criadoEm || record.date
            });
          }
          
          const customer = uniqueCustomersMap.get(key);
          customer.totalOrders += 1;
          customer.totalSpent += (record.total || (record.price * (record.qty || 1)));
          
          // Keep newest order date
          const currentTimestamp = record.criadoEm || record.date;
          if (currentTimestamp?.toMillis() > (customer.lastOrder?.toMillis() || 0)) {
            customer.lastOrder = currentTimestamp;
            customer.lastAddress = record.endereco;
          }
        }
      });

      setCustomers(Array.from(uniqueCustomersMap.values()));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchStr = searchTerm.toLowerCase();
    return (customer.nome || '').toLowerCase().includes(searchStr) || 
           (customer.email || '').toLowerCase().includes(searchStr) ||
           (customer.whatsapp || '').includes(searchStr);
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
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
        <input
          type="text"
          placeholder="Buscar clientes por nome, e-mail ou WhatsApp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-gold transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-gold/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-8 -mt-8 group-hover:bg-gold/10 transition-colors"></div>
            
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-14 h-14 bg-gradient-to-tr from-neutral-800 to-neutral-700 rounded-2xl flex items-center justify-center text-gold font-black text-xl border border-neutral-700 shadow-xl">
                {(customer.nome || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-lg group-hover:text-gold transition-colors">{customer.nome || 'Cliente Anonimo'}</h4>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <ShoppingBag size={12} />
                  {customer.totalOrders} pedido(s) realizados
                </div>
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-neutral-500">
                  <Phone size={14} />
                </div>
                {customer.whatsapp || 'Não informado'}
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-neutral-500">
                  <Mail size={14} />
                </div>
                <span className="truncate">{customer.email || 'Não informado'}</span>
              </div>
              {customer.lastAddress && (
                <div className="flex items-start gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center text-neutral-500 shrink-0">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs leading-relaxed text-neutral-400">
                    {customer.lastAddress.rua}, {customer.lastAddress.numero}<br/>
                    {customer.lastAddress.cidade} - {customer.lastAddress.estado}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest italic">Total Gasto</p>
                <p className="text-xl font-black text-gold">R$ {customer.totalSpent.toFixed(2)}</p>
              </div>
              <a 
                href={`https://wa.me/55${customer.whatsapp?.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black flex items-center justify-center transition-all shadow-lg shadow-gold/5"
              >
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-20 bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-800 text-neutral-500">
            Nenhum cliente encontrado
          </div>
        )}
      </div>
    </div>
  );
};
