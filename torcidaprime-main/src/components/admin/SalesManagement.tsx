import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { formatCurrency, safeLower, safeText } from '../../utils';
import { ShoppingCart, User, Calendar, Tag, Search, Filter, Package, Phone, Trash2, Truck, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

export const SalesManagement: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Helper to get local ISO string for datetime-local input
  const getLocalDateTimeString = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  // States for the Manual Sale Modal
  const [availableProducts, setAvailableProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('WhatsApp');
  const [status, setStatus] = useState('Pago');
  const [discount, setDiscount] = useState(0);
  const [shippingName, setShippingName] = useState('');
  const [shippingValue, setShippingValue] = useState(0);
  const [shippingObservation, setShippingObservation] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [saleDateTime, setSaleDateTime] = useState(getLocalDateTimeString());
  const [items, setItems] = useState<any[]>([
    {
      productId: '',
      productName: '',
      size: 'M',
      quantity: 1,
      price: 0,
      personalization: {
        type: 'Nenhum',
        name: '',
        number: '',
        phrase: '',
        observation: '',
        additionalPrice: 0
      }
    }
  ]);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const prodList = await adminService.getProducts();
      setAvailableProducts(prodList || []);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  // Prioridade: criadoEm > createdAt > dataPedido > data
  // NUNCA usar: atualizadoEm, pagoEm, date_last_updated
  const getSaleDate = (order: any): Date => {
    const rawDate =
      order.criadoEm ||
      order.createdAt ||
      order.dataPedido ||
      order.data;
    if (!rawDate) return new Date(0); // data desconhecida → epoch, não 'agora'
    if (rawDate && typeof rawDate === 'object' && typeof rawDate.toDate === 'function') return rawDate.toDate();
    if (rawDate && typeof rawDate.toDate === 'function') return rawDate.toDate();
    if (typeof rawDate === 'string' || typeof rawDate === 'number') return new Date(rawDate);
    return new Date(0);
  };

  const getPaidDate = (order: any): Date | null => {
    const raw = order.pagoEm;
    if (!raw) return null;
    if (raw && typeof raw === 'object' && typeof raw.toDate === 'function') return raw.toDate();
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

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        productId: '',
        productName: '',
        size: 'M',
        quantity: 1,
        price: 0,
        personalization: {
          type: 'Nenhum',
          name: '',
          number: '',
          phrase: '',
          observation: '',
          additionalPrice: 0
        }
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    setItems(prev => {
      const copy = [...prev];
      if (field === 'productId') {
        copy[index].productId = value;
        if (value === 'custom') {
          copy[index].productName = '';
          copy[index].price = 0;
        } else {
          const selected = availableProducts.find(p => p.id === value);
          if (selected) {
            copy[index].productName = selected.name;
            copy[index].price = selected.price;
          }
        }
      } else if (field.startsWith('personalization.')) {
        const pField = field.split('.')[1];
        copy[index].personalization = {
          ...copy[index].personalization,
          [pField]: value
        };
      } else {
        copy[index][field] = value;
      }
      return copy;
    });
  };

  const calculatedTotal = items.reduce((acc, item) => {
    const itemBasePrice = Number(item.price || 0);
    const itemAddPrice = Number(item.personalization?.additionalPrice || 0);
    return acc + ((itemBasePrice + itemAddPrice) * Number(item.quantity || 1));
  }, 0) - Number(discount || 0) + Number(shippingValue || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Por favor, insira o nome do cliente.");
      return;
    }
    if (items.some(item => !item.productName.trim())) {
      alert("Por favor, insira o nome de todos os produtos ou selecione produtos válidos.");
      return;
    }

    try {
      const newOrder = {
        cliente: {
          nome: customerName.trim(),
          whatsapp: whatsapp.trim() || null,
          email: email.trim() || null
        },
        itens: items.map(item => ({
          productName: item.productName,
          size: item.size,
          quantity: Number(item.quantity),
          price: Number(item.price),
          personalization: item.personalization.type !== 'Nenhum' ? {
            type: item.personalization.type,
            name: item.personalization.name || null,
            number: item.personalization.number || null,
            phrase: item.personalization.phrase || null,
            observation: item.personalization.observation || null,
            additionalPrice: Number(item.personalization.additionalPrice || 0)
          } : null
        })),
        total: calculatedTotal,
        freteNome: shippingName.trim() || null,
        freteValor: Number(shippingValue || 0),
        freteObservacao: shippingObservation.trim() || null,
        formaPagamento: paymentMethod,
        status: status,
        desconto: Number(discount || 0),
        cupom: couponCode.trim() || null,
        criadoEm: saleDateTime ? new Date(saleDateTime).toISOString() : new Date().toISOString()
      };

      await adminService.createOrder(newOrder);

      // Reset Form State
      setCustomerName('');
      setWhatsapp('');
      setEmail('');
      setPaymentMethod('WhatsApp');
      setStatus('Pago');
      setDiscount(0);
      setShippingName('');
      setShippingValue(0);
      setShippingObservation('');
      setCouponCode('');
      setSaleDateTime(getLocalDateTimeString());
      setItems([{
        productId: '',
        productName: '',
        size: 'M',
        quantity: 1,
        price: 0,
        personalization: {
          type: 'Nenhum',
          name: '',
          number: '',
          phrase: '',
          observation: '',
          additionalPrice: 0
        }
      }]);
      setIsModalOpen(false);

      // Reload Sales
      loadSales();
      alert("Venda registrada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao cadastrar venda:", error);
      alert("Erro ao cadastrar venda: " + (error.message || error));
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
        <div className="flex gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gold hover:bg-gold-light text-black rounded-xl text-xs font-bold transition-all shadow-lg hover:shadow-gold/10"
          >
            <Plus size={16} />
            Nova Venda
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 rounded-xl text-xs font-semibold hover:bg-neutral-700 transition-colors">
            <Filter size={14} />
            Filtrar
          </button>
        </div>
      </div>

      {/* MODAL PARA NOVA VENDA MANUAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-3xl rounded-3xl p-6 md:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-850 hover:bg-neutral-800 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <ShoppingCart className="text-gold" size={24} />
                Registrar Nova Venda
              </h2>
              <p className="text-xs text-neutral-400 mt-1">Insira os dados da venda realizada por canais externos (WhatsApp, Instagram, Mercado Livre, etc.).</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seção Cliente */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-300 border-b border-neutral-850 pb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Nome do Cliente *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ex: João Silva"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">WhatsApp (Opcional)</label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={e => setWhatsapp(e.target.value)}
                      placeholder="Ex: (11) 99999-9999"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">E-mail (Opcional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ex: joao@gmail.com"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Seção Itens */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-neutral-850 pb-2">
                  <h3 className="text-sm font-bold text-neutral-300">Produtos do Pedido</h3>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-[11px] font-bold text-gold hover:text-gold-light transition-colors uppercase"
                  >
                    <Plus size={14} />
                    Adicionar Produto
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="bg-black/30 border border-neutral-800 rounded-2xl p-4 relative space-y-4">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 p-1.5 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Seletor Produto */}
                        <div className="md:col-span-5 space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Selecionar Produto</label>
                          <select
                            value={item.productId}
                            onChange={e => handleItemChange(index, 'productId', e.target.value)}
                            className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                          >
                            <option value="">-- Selecione um produto --</option>
                            {availableProducts.map(p => (
                              <option key={p.id} value={p.id}>{p.name} ({formatCurrency(p.price)})</option>
                            ))}
                            <option value="custom">-- Digitar produto manualmente --</option>
                          </select>
                        </div>

                        {/* Nome Manual (se "custom") */}
                        {item.productId === 'custom' && (
                          <div className="md:col-span-4 space-y-1">
                            <label className="text-[10px] font-bold text-neutral-400 uppercase">Nome do Produto</label>
                            <input
                              type="text"
                              value={item.productName}
                              onChange={e => handleItemChange(index, 'productName', e.target.value)}
                              placeholder="Digite o nome do produto"
                              className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                            />
                          </div>
                        )}

                        {/* Preço Unitário */}
                        <div className={`space-y-1 ${item.productId === 'custom' ? 'md:col-span-2' : 'md:col-span-3'}`}>
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Preço Unitário (R$)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={item.price || ''}
                            onChange={e => handleItemChange(index, 'price', Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                          />
                        </div>

                        {/* Tamanho */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Tamanho</label>
                          <input
                            type="text"
                            value={item.size}
                            onChange={e => handleItemChange(index, 'size', e.target.value)}
                            placeholder="M, G, GG..."
                            className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                          />
                        </div>

                        {/* Quantidade */}
                        <div className="md:col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Quant.</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))}
                            className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                          />
                        </div>
                      </div>

                      {/* Personalização */}
                      <div className="border-t border-neutral-850 pt-3 space-y-3">
                        <div className="flex items-center gap-4 flex-wrap">
                          <label className="text-[10px] font-bold text-neutral-400 uppercase">Personalização:</label>
                          <div className="flex gap-3">
                            {['Nenhum', 'Nome', 'Número', 'Nome e Número', 'Outro'].map(opt => (
                              <label key={opt} className="flex items-center gap-1 text-xs text-neutral-300 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`pers-type-${index}`}
                                  checked={item.personalization.type === opt}
                                  onChange={() => handleItemChange(index, 'personalization.type', opt)}
                                  className="accent-gold"
                                />
                                {opt}
                              </label>
                            ))}
                          </div>
                        </div>

                        {item.personalization.type !== 'Nenhum' && (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-neutral-500 uppercase">Nome</label>
                              <input
                                type="text"
                                value={item.personalization.name}
                                onChange={e => handleItemChange(index, 'personalization.name', e.target.value)}
                                className="w-full bg-black border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-neutral-500 uppercase">Número</label>
                              <input
                                type="text"
                                value={item.personalization.number}
                                onChange={e => handleItemChange(index, 'personalization.number', e.target.value)}
                                className="w-full bg-black border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-neutral-500 uppercase">Observação</label>
                              <input
                                type="text"
                                value={item.personalization.observation}
                                onChange={e => handleItemChange(index, 'personalization.observation', e.target.value)}
                                className="w-full bg-black border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-neutral-500 uppercase">Valor Adic. (R$)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={item.personalization.additionalPrice || ''}
                                onChange={e => handleItemChange(index, 'personalization.additionalPrice', Number(e.target.value))}
                                className="w-full bg-black border border-neutral-800 rounded-lg py-1.5 px-2.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção Logística & Pagamento */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-300 border-b border-neutral-850 pb-2">Detalhes de Logística e Pagamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Canal / Método de Pagamento</label>
                    <select
                      value={paymentMethod}
                      onChange={e => setPaymentMethod(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Mercado Livre">Mercado Livre</option>
                      <option value="Mercado Pago">Mercado Pago</option>
                      <option value="Pix">Pix / Transferência</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Status do Pedido</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    >
                      <option value="Pago">Pago</option>
                      <option value="Pendente">Pendente</option>
                      <option value="Aguardando pagamento">Aguardando pagamento</option>
                      <option value="Cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Código do Cupom (Opcional)</label>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="Ex: PARCEIRO10"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Data e Hora da Venda</label>
                    <input
                      type="datetime-local"
                      value={saleDateTime}
                      onChange={e => setSaleDateTime(e.target.value)}
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Desconto (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={discount || ''}
                      onChange={e => setDiscount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Entrega / Nome do Frete</label>
                    <input
                      type="text"
                      value={shippingName}
                      onChange={e => setShippingName(e.target.value)}
                      placeholder="Ex: Sedex, Motoboy, Retirada"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-400 uppercase">Valor do Frete (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={shippingValue || ''}
                      onChange={e => setShippingValue(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-400 uppercase">Observações do Frete/Pedido</label>
                  <textarea
                    rows={2}
                    value={shippingObservation}
                    onChange={e => setShippingObservation(e.target.value)}
                    placeholder="Ex: Enviar após as 14h, endereço alternativo..."
                    className="w-full bg-black border border-neutral-800 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-gold transition-colors text-white resize-none"
                  />
                </div>
              </div>

              {/* Totalizador */}
              <div className="bg-black border border-neutral-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-xs text-neutral-400 uppercase font-bold tracking-wider">Valor Total Calculado</span>
                  <div className="text-3xl font-black text-gold mt-1">{formatCurrency(calculatedTotal)}</div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 md:flex-initial px-5 py-2.5 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 md:flex-initial px-6 py-2.5 bg-gold hover:bg-gold-light text-black rounded-xl text-sm font-bold transition-all shadow-lg shadow-gold/10"
                  >
                    Salvar Venda
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
