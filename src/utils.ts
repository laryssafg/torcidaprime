import { CartItem, OrderData, PersonalizationType, Product } from './types';
import { WHATSAPP_NUMBER } from './constants';

export const formatCurrency = (value: number) => {
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(num);
};

export const safeText = (value: any): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    // Handle coupon objects
    if (value.codigo) return String(value.codigo);
    if (value.code) return String(value.code);
    // General string representation if not special object
    try {
      return String(value);
    } catch {
      return "";
    }
  }
  return "";
};

export const safeLower = (value: any): string => {
  return safeText(value).toLowerCase();
};

export const normalizeName = (name: any): string => {
  return safeText(name)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

export const normalizeProduct = (docId: string, data: any): Product => {
  const nome = safeText(data.nome || data.name);
  const price = Number(data.preco || data.price || 0);

  const images = Array.isArray(data.imagens)
    ? data.imagens
    : Array.isArray(data.images)
      ? data.images
      : [];

  const sizes = Array.isArray(data.tamanhos)
    ? data.tamanhos
    : Array.isArray(data.sizes)
      ? data.sizes
      : [];

  return {
    ...data,
    id: docId,
    name: nome,
    price: price,
    images: images,
    sizes: sizes,
    category: safeText(data.categoria || data.category || "Sem categoria"),
    description: safeText(data.descricao || data.description || ""),
    personalizable: Boolean(data.personalizacao || data.personalizable),
    soldOut: Boolean(data.soldOut || data.esgotado),
    active: data.ativo !== false && data.active !== false
  };
};

export const getProductMedia = (product: Product | any): string[] => {
  if (!product) return ["https://placehold.co/600x800/262626/white?text=Sem+Imagem"];
  
  const imgs = Array.isArray(product.imagens) && product.imagens.length > 0 
    ? product.imagens 
    : Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [];
  
  if (imgs.length === 0) return ["https://placehold.co/600x800/262626/white?text=Sem+Imagem"];
  return imgs;
};

export const getProductSizes = (product: Product | any): string[] => {
  if (!product) return [];
  
  return Array.isArray(product.tamanhos) 
    ? product.tamanhos 
    : Array.isArray(product.sizes) 
      ? product.sizes 
      : [];
};

export const generateWhatsAppLink = (cart: CartItem[], order: OrderData, total: number) => {
  let message = `🚀 *NOVO PEDIDO - TORCIDA PRIME*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `👤 *CLIENTE*\n`;
  message += `▪️ Nome: ${order.customer.name}\n`;
  message += `▪️ WhatsApp: ${order.customer.whatsapp}\n`;
  message += `▪️ E-mail: ${order.customer.email}\n\n`;

  message += `📍 *ENDEREÇO DE ENTREGA*\n`;
  message += `▪️ Rua: ${order.address.street}, ${order.address.number}${order.address.complement ? ` (${order.address.complement})` : ''}\n`;
  message += `▪️ Bairro: ${order.address.neighborhood}\n`;
  message += `▪️ Cidade: ${order.address.city} - ${order.address.state}\n`;
  message += `▪️ CEP: ${order.address.cep}\n\n`;

  message += `🚚 *LOGÍSTICA E PAGAMENTO*\n`;
  message += `▪️ Envio: ${order.shipping}\n`;
  message += `▪️ Pagamento: ${order.payment}\n\n`;

  message += `👕 *ITENS DO PEDIDO*\n`;
  cart.forEach((item, index) => {
    message += `*${index + 1}. ${item.product.name.toUpperCase()}*\n`;
    message += `   🔸 Tamanho: ${item.selectedSize}\n`;
    message += `   🔸 Quantidade: ${item.quantity}\n`;
    
    if (item.personalization && item.personalization.type !== PersonalizationType.NONE) {
      message += `   ✨ *Personalização:*\n`;
      if (item.personalization.name) message += `     ▫️ Nome: ${item.personalization.name.toUpperCase()}\n`;
      if (item.personalization.number) message += `     ▫️ Número: ${item.personalization.number}\n`;
      if (item.personalization.phrase) message += `     ▫️ Frase: ${item.personalization.phrase}\n`;
      if (item.personalization.observation) message += `     ▫️ Obs: ${item.personalization.observation}\n`;
    }
    const unitPrice = item.product.price + (item.personalization?.additionalPrice || 0);
    message += `   💸 Valor: ${formatCurrency(unitPrice * item.quantity)}\n\n`;
  });

  if (order.coupon) {
    message += `🎫 *CUPOM APLICADO:* ${order.coupon}\n`;
    message += `📉 Desconto: ${formatCurrency(order.discountAmount)}\n\n`;
  }
  
  if (order.observations) {
    message += `📝 *OBSERVAÇÕES:*\n${order.observations}\n\n`;
  }

  message += `💰 *TOTAL FINAL: ${formatCurrency(total)}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Olá! Acabei de fazer esse pedido pelo site e gostaria de prosseguir com o pagamento.`;

  const phone = "5511948626304";
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};

export const getAutoDescription = (_productName: string, category: string) => {
  const cat = safeLower(category);
  const base = "Produto selecionado para quem busca estilo, conforto e paixão pelo esporte. Ideal para torcer, colecionar ou usar no dia a dia.";
  
  if (cat.includes('brasil')) return `Mostre seu amor pela seleção! ${base} Design autêntico com a energia do futebol brasileiro.`;
  if (cat.includes('infantil')) return `Conforto e estilo para os pequenos torcedores! ${base} Feito com tecidos leves para garantir a diversão em todos os lances.`;
  if (cat.includes('nba')) return `Das quadras para o seu estilo! ${base} Regata premium com detalhes bordados e máxima respirabilidade.`;
  if (cat.includes('retro')) return `Reviva grandes momentos! ${base} Edição especial nostálgica para reviver a história do seu time de coração.`;
  if (cat.includes('boné') || cat.includes('bone')) return `O toque final para o seu visual! ${base} Acessório de alta qualidade com ajuste perfeito e bordado premium.`;
  if (cat.includes('cropped')) return `Estilo e frescor em um só look! ${base} Modelagem moderna que combina moda e paixão pelo esporte.`;
  
  return base;
};
