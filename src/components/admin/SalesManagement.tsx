import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, safeLower, safeText } from '../../utils';
import { ShoppingCart, User, Calendar, Tag, Search, Filter, Package, Phone, Trash2, Truck, ChevronDown, ChevronUp } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadSales();
  }, []);

  // Prioridade: criadoEm > createdAt > dataPedido > data
  // NUNCA usar: atualizadoEm, pagoEm, date_last_updated
  const getSaleDate = (order: any): Date => {
    const rawDate =
      order.criadoEm ||
      order.createdAt ||
      order.dataPedido ||
      order.data;
    if (!rawDate) return new Date(0); // data desconhecida → epoch, não 'agora'
    if (rawDate instanceof Timestamp) return rawDate.toDate();
    if (rawDate && typeof rawDate.toDate === 'function') return rawDate.toDate();
    if (typeof rawDate === 'string' || typeof rawDate === 'number') return new Date(rawDate);
    return new Date(0);
  };

  const getPaidDate = (order: any): Date | null => {
    const raw = order.pagoEm;
    if (!raw) return null;
    if (raw instanceof Timestamp) return raw.toDate();
    if (raw && typeof raw.toDate === 'function') return raw.toDate();
    if (typeof raw === 'string' || typeof raw === 'number') return new Date(raw);
    return null;
  };

  const getCouponText = (order: any): string => {
    if (order.couponCode && typeof order.couponCode === 'string') return order.couponCode;
    if (order.cupom) {
      if (typeof order.cupom === 'string') return order.cupom;
      if (typeof order.cupom === 'object' && order.cupom?.code) return String(order.cupom.code);
    }
    return '';
  };

  const normalizeOrder = (order: any) => {
    if (!order) return null;

    // Apenas pedidos completos com type === 'order'
    if (order.type !== 'order') return null;

    const date = getSaleDate(order);

    // Itens do pedido
    const items: any[] = Array.isArray(order.itens) ? order.itens.map((item: any) => ({
      productName:    item.productName || item.nome || 'Produto',
      size:           item.size || item.tamanho || '-',
      quantity:       Number(item.quantity || item.quantidade || 1),
      price:          Number(item.price || item.preco || 0),
      personalization: item.personalization || null,
    })) : [];

    const total = Number(order.total || order.totalPedido || order.valorTotal || 0);
    const coupon = getCouponText(order).trim().toUpperCase();

    return {
      id:                  order.id,
      customerName:        order.cliente?.nome || order.cliente?.name || 'Cliente',
      whatsapp:            order.cliente?.whatsapp || '',
      email:               order.cliente?.email || '',
      createdAt:           date,
      paidAt:              getPaidDate(order),
      coupon,
      items,
      total,
      shippingName:        order.freteNome || order.entrega || '',
      shippingValue:       Number(order.freteValor || 0),
      shippingObservation: order.freteObservacao || '',
      paymentMethod:       order.formaPagamento || order.payment || 'Mercado Pago',
      status:              order.status || 'Aguardando pagamento',
      discount:            Number(order.desconto || order.discountAmount || 0),
    };
  };

  const loadSales = async () => {
    try {
      const rawData = await adminService.getSales();
      const data = (Array.isArray(rawData) ? rawData : []) as any[];

      const normalizedData = data
        .map(order => normalizeOrder(order))
        .filter(order => order !== null) as any[];

      const sorted = normalizedData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setSales(sorted);
    } catch (error) {
      console.error("Erro na aba Vendas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    if (!window.confirm('Tem certeza que deseja excluir este pedido?')) return;
    setDeletingId(id);
    try {
      const success = await adminService.deleteSale(id);
      if (success) {
        setSales(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Erro ao excluir pedido.");
      }
    } catch {
      alert("Erro ao excluir pedido.");
    } finally {
      setDeletingId(null);
    }
  };

  const statusColor = (status: string) => {
    const s = safeLower(status);
    if (s === 'pago') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (s === 'pendente' || s === 'aguardando pagamento') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    if (s === 'recusado' || s === 'cancelado') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  const filteredSales = (Array.isArray(sales) ? sales : []).filter(sale => {
    if (!sale) return false;
    const s = safeLower(searchTerm);
    const matchName    = safeLower(sale.customerName).includes(s);
    const matchCoupon  = safeLower(sale.coupon).includes(s);
    const matchItems   = sale.items.some((item: any) => safeLower(item.productName).includes(s));
    const matchStatus  = safeLower(sale.status).includes(s);
    return matchName || matchCoupon || matchItems || matchStatus;
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
            placeholder="Buscar por cliente, produto, status ou cupom..."
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
          const isExpanded = expandedId === sale.id;

          return (
            <div key={sale.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-gold/30 transition-all">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-500">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-lg">
                        Pedido #{safeText(sale.id).slice(-6).toUpperCase()}
                      </span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${statusColor(sale.status)}`}>
                        {safeText(sale.status)}
                      </span>
                      <button
                        onClick={() => handleDelete(sale.id)}
                        disabled={deletingId === sale.id}
                        className="p-1.5 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Excluir"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <User size={13} className="text-neutral-500" />
                        {safeText(sale.customerName)}
                      </div>
                      {sale.whatsapp && (
                        <div className="flex items-center gap-1.5">
                          <Phone size={13} className="text-neutral-500" />
                          {safeText(sale.whatsapp)}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-neutral-500" />
                        <span>
                          Pedido em: {sale.createdAt.getFullYear() > 2000
                            ? `${sale.createdAt.toLocaleDateString('pt-BR')} ${sale.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
                            : 'Data desconhecida'
                          }
                        </span>
                      </div>
                      {sale.paidAt && (
                        <div className="flex items-center gap-1.5 text-green-400">
                          <Calendar size={13} />
                          Pago em: {sale.paidAt.toLocaleDateString('pt-BR')} {sale.paidAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      )}
                      {sale.shippingName && (
                        <div className="flex items-center gap-1.5 text-blue-400">
                          <Truck size={13} />
                          {safeText(sale.shippingName)} {sale.shippingValue > 0 ? `(${formatCurrency(sale.shippingValue)})` : '(Grátis)'}
                        </div>
                      )}
                      {sale.coupon && (
                        <div className="flex items-center gap-1.5 text-gold">
                          <Tag size={13} />
                          Cupom: {sale.coupon}
                        </div>
                      )}
                    </div>
                    {sale.shippingObservation && (
                      <div className="mt-1.5 text-[10px] text-blue-400/70 italic bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/10 max-w-xl">
                        Obs: {sale.shippingObservation}
                      </div>
                    )}
                    {sale.items && sale.items.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sale.items.map((item: any, idx: number) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs px-2.5 py-1 rounded-lg">
                            <span className="font-bold text-gold">{item.quantity}x</span>
                            <span>{safeText(item.productName)}</span>
                            {item.size && item.size !== '-' && (
                              <span className="ml-1 bg-gold text-black font-extrabold text-[10px] px-1.5 py-0.5 rounded uppercase">
                                TAM: {item.size}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="text-2xl font-black text-white">
                    {formatCurrency(sale.total)}
                  </div>
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest italic">
                    {safeText(sale.paymentMethod)}
                  </div>
                  {sale.discount > 0 && (
                    <div className="text-[10px] text-green-400 font-bold">
                      Desconto: -{formatCurrency(sale.discount)}
                    </div>
                  )}
                </div>
              </div>

              {/* Expandir Itens */}
              {sale.items.length > 0 && (
                <>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : sale.id)}
                    className="mt-4 flex items-center gap-2 text-xs text-neutral-500 hover:text-gold transition-colors font-bold uppercase tracking-widest"
                  >
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {isExpanded ? 'Ocultar' : 'Ver'} {sale.items.length} {sale.items.length === 1 ? 'produto' : 'produtos'}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 border-t border-neutral-800 pt-4 space-y-3">
                      {sale.items.map((item: any, idx: number) => {
                        const p = item.personalization;
                        const hasPersonalization = p && p.type && p.type !== 'Nenhum';
                        return (
                          <div key={idx} className="bg-black/40 rounded-xl p-3 border border-neutral-800">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="font-bold text-sm text-white">{item.quantity}x {safeText(item.productName)}</span>
                                {item.size && item.size !== '-' && (
                                  <span className="ml-2 text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-400 uppercase font-bold">
                                    TAM: {item.size}
                                  </span>
                                )}
                              </div>
                              <span className="text-gold font-black text-sm">{formatCurrency(item.price * item.quantity)}</span>
                            </div>

                            {hasPersonalization ? (
                              <div className="mt-2 text-[11px] text-neutral-400 space-y-0.5 border-t border-neutral-800/50 pt-2">
                                <div className="text-[#009b3a] font-bold uppercase tracking-wider text-[9px] mb-1">Personalização</div>
                                <div><span className="text-neutral-500">Tipo:</span> {safeText(p.type)}</div>
                                {p.name  && <div><span className="text-neutral-500">Nome:</span> {p.name}</div>}
                                {p.number && <div><span className="text-neutral-500">Número:</span> {p.number}</div>}
                                {p.phrase && <div><span className="text-neutral-500">Frase:</span> {p.phrase}</div>}
                                {p.observation && <div><span className="text-neutral-500">Obs:</span> {p.observation}</div>}
                                {p.additionalPrice > 0 && (
                                  <div><span className="text-neutral-500">Adicional:</span> +{formatCurrency(p.additionalPrice)}</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-[10px] text-neutral-600 mt-1">Personalização: Nenhuma</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {filteredSales.length === 0 && (
          <div className="text-center py-20 bg-neutral-900 rounded-3xl border-2 border-dashed border-neutral-800 text-neutral-500">
            Nenhum pedido encontrado.
          </div>
        )}
      </div>
    </div>
  );
};
