export enum Category {
  BRASIL = 'Brasil Copa',
  CLUBES_BR = 'Clubes Brasileiros',
  CLUBES_INT = 'Clubes Internacionais',
  INFANTIL = 'Infantil',
  NBA = 'NBA',
  BONES = 'Bonés',
  CROPPEDS = 'Croppeds',
  FEMININO = 'Feminino',
  RETRO = 'Retrô',
  CONJUNTO = 'Conjunto',
  CORTA_VENTO = 'Corta Vento'
}

export enum PersonalizationType {
  NONE = 'Nenhum',
  NAME_NUMBER = 'Nome e número',
  NAME_OR_NUMBER = 'Só nome ou só número',
  PHRASE = 'Frase'
}

export interface PersonalizationOption {
  type: PersonalizationType;
  price: number;
  limits: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  imagens?: string[]; // Suporte para Firestore em PT
  category: Category;
  sizes: string[]; // e.g. ['P', 'M', 'G', 'GG', 'ESG'] for sold out size
  tamanhos?: string[]; // Suporte para Firestore em PT
  personalizable: boolean;
  description?: string;
  soldOut?: boolean;
  active?: boolean;
  isPopular?: boolean;
  salesCount?: number;
  totalRevenue?: number;
  updatedAt?: any;
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedSize: string;
  quantity: number;
  personalization?: {
    type: PersonalizationType;
    name?: string;
    number?: string;
    phrase?: string;
    observation?: string;
    additionalPrice: number;
  };
}

export interface OrderData {
  customer: {
    name: string;
    whatsapp: string;
    email: string;
  };
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  shipping: 'Retirada' | 'Entrega local' | 'Correios';
  payment: 'Pix' | 'Cartão' | 'Dinheiro' | 'WhatsApp';
  observations?: string;
  coupon?: string;
  discountAmount: number;
}
