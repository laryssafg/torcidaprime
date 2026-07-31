import { Category, Product, PersonalizationType, PersonalizationOption } from './types';

export const WHATSAPP_NUMBER = '11948626304';
export const COUPON_CODE = 'TECHNOVA01';
export const COUPON_DISCOUNT = 0.25;

export const PERSONALIZATION_OPTIONS: Record<PersonalizationType, PersonalizationOption> = {
  [PersonalizationType.NONE]: { type: PersonalizationType.NONE, price: 0, limits: '' },
  [PersonalizationType.NAME_NUMBER]: { type: PersonalizationType.NAME_NUMBER, price: 50, limits: 'Até 12 letras e 2 números' },
  [PersonalizationType.NAME_OR_NUMBER]: { type: PersonalizationType.NAME_OR_NUMBER, price: 30, limits: 'Até 12 letras OU 2 números' },
  [PersonalizationType.PHRASE]: { type: PersonalizationType.PHRASE, price: 80, limits: 'Até 5 linhas, 12 letras/linha' }
};

export const COLORS = {
  green: '#009b3a',
  gold: '#fedf00',
  darkBlue: '#002776',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#151515',
  neutral: '#0a0a0a'
};

export const PRODUCTS: Product[] = [];
