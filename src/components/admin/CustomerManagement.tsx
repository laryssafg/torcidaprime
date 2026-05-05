import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, Phone, Mail, MapPin, ShoppingBag, Search, ExternalLink, Trash2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { safeLower, safeText } from '../../utils';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const rawData = await adminService.getSales();
      const data = (Array.isArray(rawData) ? rawData : []) as any[];
      const uniqueCustomersMap = new Map<string, any>();

      // Extract unique customers from orders
      data.forEach((record: any) => {
        if (!record) return;

        const client = record.cliente || {};
        const email = safeLower(client.email);
        const whatsappRaw = safeText(client.whatsapp).replace(/\D/g, '');
        
        if (email || whatsappRaw) {
          const key = email || whatsappRaw;
          if (!uniqueCustomersMap.has(key)) {
            uniqueCustomersMap.set(key, {
              nome: safeText(client.nome) || 'Cliente Anonimo',
              email: email || 'Não informado',
              whatsapp: safeText(client.whatsapp) || 'Não informado',
              lastAddress: record.endereco || record.address || null,
              totalOrders: 0,
              totalSpent: 0,
              lastOrder: record.criadoEm || record.date || record.createdAt
            });
          }
          
          const customer = uniqueCustomersMap.get(key);
          customer.totalOrders += 1;
          
          const valorRaw = record.total ?? record.totalPedido ?? record.valorTotal ?? record.subtotal ?? 0;
          const valor = Number(valorRaw);
          customer.totalSpent += (isNaN(valor) ? 0 : valor);
          
          // Keep newest order date
          const currentTimestamp = record.criadoEm || record.date || record.createdAt;
          if (currentTimestamp instanceof Timestamp) {
            const currentMillis = currentTimestamp.toMillis();
            const lastMillis = customer.lastOrder instanceof Timestamp ? customer.lastOrder.toMillis() : 0;
            if (currentMillis > lastMillis) {
              customer.lastOrder = currentTimestamp;
              customer.lastAddress = record.endereco || record.address || customer.lastAddress;
            }
          }
        }
      });

      setCustomers(Array.from(uniqueCustomersMap.values()));
    } catch (error) {
      console.error("Erro na aba Clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    if (!customer) return false;
    const searchStr = safeLower(searchTerm);
    return safeLower(customer.nome).includes(searchStr) || 
           safeLower(customer.email).includes(searchStr) ||
           safeLower(customer.whatsapp).includes(searchStr);
  });

  const handleDeleteCustomer = async (customer: any) => {
    const id = customer.email !== 'Não informado' ? customer.email : customer.whatsapp;
    if (!id) return;

    if (!window.confirm(`Tem certeza que deseja excluir o cliente "${customer.nome}"? Isso removerá TODO o histórico de pedidos deste cliente.`)) return;

    setDeletingId(id);
    try {
      const success = await adminService.deleteCustomerSales(id);
      if (success) {
        setCustomers(prev => prev.filter(c => (c.email !== id && c.whatsapp !== id)));
      } else {
        alert("Erro ao excluir cliente.");
      }
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      alert("Erro ao excluir cliente.");
    } finally {
      setDeletingId(null);
    }
  };

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
          <div key={index} id={`customer-card-${index}`} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-gold/30 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full -mr-8 -mt-8 group-hover:bg-gold/10 transition-colors"></div>
            
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-14 h-14 bg-gradient-to-tr from-neutral-800 to-neutral-700 rounded-2xl flex items-center justify-center text-gold font-black text-xl border border-neutral-700 shadow-xl">
                {safeText(customer.nome || 'C').charAt(0).toUpperCase()}
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
                    {customer.lastAddress.rua || customer.lastAddress.street}, {customer.lastAddress.numero || customer.lastAddress.number}<br/>
                    {customer.lastAddress.cidade || customer.lastAddress.city} - {customer.lastAddress.estado || customer.lastAddress.state}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest italic">Total Gasto</p>
                <p className="text-xl font-black text-gold">R$ {Number(customer.totalSpent).toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleDeleteCustomer(customer)}
                  disabled={deletingId === (customer.email !== 'Não informado' ? customer.email : customer.whatsapp)}
                  className="w-10 h-10 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all"
                  title="Excluir Histórico do Cliente"
                >
                  <Trash2 size={18} />
                </button>
                <a 
                  href={`https://wa.me/55${safeText(customer.whatsapp).replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-gold/10 hover:bg-gold text-gold hover:text-black flex items-center justify-center transition-all shadow-lg shadow-gold/5"
                >
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-20 bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-800 text-neutral-500">
            Nenhum cliente encontrado ainda.
          </div>
        )}
      </div>
    </div>
  );
};
