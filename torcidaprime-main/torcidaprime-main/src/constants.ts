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

export const PRODUCTS: Product[] = [
  {
    id: 'brazil-23',
    name: 'nacional premium Brasil amarela copa 2026',
    price: 120.00,
    images: ['https://i.imgur.com/Let6X6q.png', 'https://i.imgur.com/Rr0x993.png', 'https://i.imgur.com/Vde7Agh.png', 'https://i.imgur.com/WLKVSKk.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG'],
    personalizable: true,
    isPopular: true
  },
  {
    id: 'brazil-24',
    name: 'nacional premium Brasil azul copa',
    price: 120.00,
    images: ['https://i.imgur.com/s0Zsxqj.png', 'https://i.imgur.com/6emFB63.png', 'https://i.imgur.com/8KmuhkD.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG', 'P'],
    personalizable: true,
    isPopular: true
  },
  {
    id: 'brazil-1',
    name: 'Dri- Fit Brasil amarela UNISSEX',
    price: 70.00,
    images: ['https://i.imgur.com/8PYQH8v.png', 'https://i.imgur.com/8CDWK7M.png', 'https://i.imgur.com/OyvXlOE.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG'],
    personalizable: false
  },
  {
    id: 'brazil-2',
    name: 'Dri- Fit Brasil azul UNISSEX',
    price: 70.00,
    images: ['https://i.imgur.com/VFYDitN.png', 'https://i.imgur.com/vkSgZvZ.png', 'https://i.imgur.com/X2EuB1r.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG'],
    personalizable: false
  },
  {
    id: 'brazil-3',
    name: 'Dri- Fit Brasil vermelha UNISSEX',
    price: 70.00,
    images: ['https://i.imgur.com/Qs3FZy5.png', 'https://i.imgur.com/Dda6yk4.png', 'https://i.imgur.com/siqofpE.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG'],
    personalizable: false
  },
  {
    id: 'brazil-4',
    name: 'Modelo jogador 1.1 Brasil amarela Copa 2026',
    price: 340.00,
    images: ['https://i.imgur.com/uwixNvT.png', 'https://i.imgur.com/kFLxxQm.png', 'https://i.imgur.com/amfqto5.png'],
    category: Category.BRASIL,
    sizes: ['P', 'M', 'G', 'GG', '2XL(G1-XXL)'],
    personalizable: true
  },
  {
    id: 'brazil-5',
    name: 'Modelo jogador 1.1 Brasil azul jordan',
    price: 340.00,
    images: ['https://i.imgur.com/zrzGXEQ.png', 'https://i.imgur.com/QLQqCa0.png', 'https://i.imgur.com/AZYq11e.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G', 'GG', '2XL(G1-XXL)'],
    personalizable: true
  },
  {
    id: 'brazil-14',
    name: 'Tailandesa torcedor Brasil guaraná branca',
    price: 180.00,
    images: ['https://i.imgur.com/Fer5sc3.png', 'https://i.imgur.com/2SY835k.png', 'https://i.imgur.com/XdfNDNL.png', 'https://i.imgur.com/2EQXkeL.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G'],
    personalizable: true
  },
  {
    id: 'brazil-15',
    name: 'Tailandesa torcedor Brasil guaraná AMARELA',
    price: 180.00,
    images: ['https://i.imgur.com/B5stuxI.png', 'https://i.imgur.com/1V6i4ZX.png', 'https://i.imgur.com/vq4fMk1.png', 'https://i.imgur.com/5kJMH8G.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G'],
    personalizable: true
  },
  {
    id: 'brazil-16',
    name: 'Tailandesa torcedor Brasil guaraná preta',
    price: 180.00,
    images: ['https://i.imgur.com/pzPT2MH.png', 'https://i.imgur.com/PPVN1fN.png', 'https://i.imgur.com/spqD985.png', 'https://i.imgur.com/D3LQc7O.png'],
    category: Category.BRASIL,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'brazil-17',
    name: 'Tailandesa torcedor Brasil guaraná verde',
    price: 180.00,
    images: ['https://i.imgur.com/MTZGX0C.png', 'https://i.imgur.com/Tyi8Zzk.png', 'https://i.imgur.com/Rv0MVzQ.png', 'https://i.imgur.com/8gKE3OM.png'],
    category: Category.BRASIL,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'brazil-18',
    name: 'Tailandesa torcedor Brasil guaranás azul',
    price: 180.00,
    images: ['https://i.imgur.com/BXOSjlx.png', 'https://i.imgur.com/NIktmbt.png', 'https://i.imgur.com/mAaev3F.png', 'https://i.imgur.com/Sx76Zo1.png'],
    category: Category.BRASIL,
    sizes: ['M', 'G'],
    personalizable: false
  },
  {
    id: 'brazil-19',
    name: 'Tailandesa torcedor Brasil amarela',
    price: 240.00,
    images: ['https://i.imgur.com/5V9yvhH.png', 'https://i.imgur.com/geXMipe.png', 'https://i.imgur.com/YFOjGNN.png', 'https://i.imgur.com/EPhvfdB.png'],
    category: Category.BRASIL,
    sizes: ['GG', '2XL(G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'brazil-20',
    name: 'Tailandesa torcedor Brasil azul jordan',
    price: 240.00,
    images: ['https://i.imgur.com/rOqmzXs.png', 'https://i.imgur.com/hNygJhI.png', 'https://i.imgur.com/Rdj0Xdy.png'],
    category: Category.BRASIL,
    sizes: ['P', 'M', 'G', 'GG', '2XL(G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'brazil-21',
    name: 'infantil/feminina nacional premium Brasil branca polo',
    price: 90.00,
    images: ['https://i.imgur.com/LYv6uBG.png', 'https://i.imgur.com/05ICpeA.png', 'https://i.imgur.com/4aud78G.png'],
    category: Category.BRASIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'brazil-22',
    name: 'nacional premium Brasil amarela Ronaldo 1998',
    price: 90.00,
    images: ['https://i.imgur.com/9zbYTJ1.png', 'https://i.imgur.com/r5a7psd.png', 'https://i.imgur.com/s7wieye.png'],
    category: Category.BRASIL,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'brazil-25',
    name: 'nacional premium Brasil preta',
    price: 66.00,
    images: ['https://i.imgur.com/UB01S7E.png', 'https://i.imgur.com/jvBA4fQ.png', 'https://i.imgur.com/hmSNkNk.png'],
    category: Category.BRASIL,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'kid-1',
    name: 'Kit infantil tailandesa- vasco preto 2024',
    price: 140.00,
    images: ['https://i.imgur.com/XiXfQj4.png', 'https://i.imgur.com/tfjzwwO.png', 'https://i.imgur.com/a0ZBis5.png'],
    category: Category.INFANTIL,
    sizes: ['22 - (6-7 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-2',
    name: 'infantil nacional premium Al Hilal branca',
    price: 70.00,
    images: ['https://i.imgur.com/FHKoidc.png', 'https://i.imgur.com/dAR8ll2.png', 'https://i.imgur.com/10amDL2.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'M', 'G'],
    personalizable: false
  },
  {
    id: 'kid-3',
    name: 'infantil nacional premium All hilal azul',
    price: 70.00,
    images: ['https://i.imgur.com/aBsREbc.png', 'https://i.imgur.com/R0O8VWF.png', 'https://i.imgur.com/OshKrsq.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'M'],
    personalizable: false
  },
  {
    id: 'kid-4',
    name: 'infantil nacional premium Brasil polo preta',
    price: 70.00,
    images: ['https://i.imgur.com/QHdEQal.png', 'https://i.imgur.com/8JerC8v.png', 'https://i.imgur.com/Pm9KVsm.png'],
    category: Category.INFANTIL,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'kid-5',
    name: 'infantil nacional premium Brasil preta',
    price: 80.00,
    images: ['https://i.imgur.com/qSWplte.png', 'https://i.imgur.com/vU6a9Tt.png', 'https://i.imgur.com/rUFL9ao.png'],
    category: Category.INFANTIL,
    sizes: ['M', 'G'],
    personalizable: true
  },
  {
    id: 'kid-6',
    name: 'infantil nacional premium Flamengo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/VonRPPE.png', 'https://i.imgur.com/YbEhTyc.png', 'https://i.imgur.com/uFgXCiS.png'],
    category: Category.INFANTIL,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'kid-7',
    name: 'infantil nacional premium Palmeiras neon',
    price: 70.00,
    images: ['https://i.imgur.com/UkOlPVP.png', 'https://i.imgur.com/Hw6liH0.png', 'https://i.imgur.com/F2HfK6w.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'kid-8',
    name: 'infantil nacional premium Santos azul carpa',
    price: 70.00,
    images: ['https://i.imgur.com/BTChYHm.png', 'https://i.imgur.com/Df0BVEZ.png', 'https://i.imgur.com/MmWJbxo.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-9',
    name: 'infantil nacional premium São Paulo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/O8iLKhw.png', 'https://i.imgur.com/UxL59q9.png', 'https://i.imgur.com/UoIkbGd.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-10',
    name: 'infantil nacional premium São Paulo listrada adidas',
    price: 70.00,
    images: ['https://i.imgur.com/M8B3nyv.png', 'https://i.imgur.com/DFffBXV.png', 'https://i.imgur.com/BF7pe3u.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-11',
    name: 'Kit infantil tailandesa Brasil azul jordan',
    price: 260.00,
    images: ['https://i.imgur.com/LzcJ02a.png', 'https://i.imgur.com/WhIms03.png', 'https://i.imgur.com/jpezQyE.png', 'https://i.imgur.com/za32m3l.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)', '20 (5-6 ANOS)', '22 (6-7 ANOS)', '26 (9-10 ANOS)', '28 (11-12 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-12',
    name: 'infantil nacional premium Brasil branca polo',
    price: 90.00,
    images: ['https://i.imgur.com/LYv6uBG.png', 'https://i.imgur.com/05ICpeA.png', 'https://i.imgur.com/4aud78G.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-13',
    name: 'infantil nacional premium Brasil amarela copa',
    price: 120.00,
    images: ['https://i.imgur.com/SSkfYuk.png', 'https://i.imgur.com/DP1ICPF.png', 'https://i.imgur.com/P16RQdd.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'M', 'G'],
    personalizable: true
  },
  {
    id: 'kid-14',
    name: 'infantil nacional premium Corinthians branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/uo0pqEW.png', 'https://i.imgur.com/bOjDM7W.png', 'https://i.imgur.com/ZcErZSD.png'],
    category: Category.INFANTIL,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'kid-15',
    name: 'infantil nacional premium Flamengo 2023',
    price: 80.00,
    images: ['https://i.imgur.com/w7mmMzW.png', 'https://i.imgur.com/rzlW6aX.png', 'https://i.imgur.com/4TwjrC6.png'],
    category: Category.INFANTIL,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'kid-17',
    name: 'infantil nacional premium Flamengo listrada 2022',
    price: 80.00,
    images: ['https://i.imgur.com/qSXDVBT.png', 'https://i.imgur.com/JVrqSVP.png', 'https://i.imgur.com/3izfIBS.png'],
    category: Category.INFANTIL,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'kid-18',
    name: 'infantil nacional premium Inter miami preta',
    price: 80.00,
    images: ['https://i.imgur.com/eQldClX.png', 'https://i.imgur.com/Cwo2cuF.png', 'https://i.imgur.com/E3j8fMB.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'kid-19',
    name: 'infantil nacional premium Inter miami rosa',
    price: 80.00,
    images: ['https://i.imgur.com/sLfn7yv.png', 'https://i.imgur.com/1wGLUSO.png', 'https://i.imgur.com/tyiSL4C.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'kid-20',
    name: 'infantil nacional premium Manchester united',
    price: 80.00,
    images: ['https://i.imgur.com/aIzLeIY.png', 'https://i.imgur.com/Jr6AWMF.png', 'https://i.imgur.com/P4wl8k3.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-21',
    name: 'infantil nacional premium Palmeiras amarela',
    price: 80.00,
    images: ['https://i.imgur.com/ZAYSR2E.png'],
    category: Category.INFANTIL,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'kid-22',
    name: 'infantil nacional premium Palmeiras branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/a9uvd6q.png', 'https://i.imgur.com/DzsGZGM.png', 'https://i.imgur.com/gmyY6tp.png'],
    category: Category.INFANTIL,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'kid-23',
    name: 'infantil nacional premium Palmeiras verde 2026',
    price: 80.00,
    images: ['https://i.imgur.com/7p8vaHV.png', 'https://i.imgur.com/E33ga0P.png', 'https://i.imgur.com/JfJjTsM.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'M', 'G'],
    personalizable: true
  },
  {
    id: 'kid-24',
    name: 'infantil nacional premium Psg',
    price: 80.00,
    images: ['https://i.imgur.com/OMR6A8D.png', 'https://i.imgur.com/h2dT8M2.png', 'https://i.imgur.com/lyS9cIA.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'G'],
    personalizable: true
  },
  {
    id: 'kid-25',
    name: 'infantil nacional premium Real Madrid bellingham',
    price: 80.00,
    images: ['https://i.imgur.com/VdzUtqg.png', 'https://i.imgur.com/tjTWDim.png', 'https://i.imgur.com/GeAR2gO.png'],
    category: Category.INFANTIL,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'kid-26',
    name: 'infantil nacional premium Real Madrid mbappé',
    price: 80.00,
    images: ['https://i.imgur.com/FYq8ZBn.png', 'https://i.imgur.com/gdXtX9p.png', 'https://i.imgur.com/UdwAOmO.png'],
    category: Category.INFANTIL,
    sizes: ['M', 'G (ESGOTADO)'],
    personalizable: false
  },
  {
    id: 'kid-27',
    name: 'infantil nacional premium Santos branca',
    price: 40.00,
    images: ['https://i.imgur.com/60IKN6D.png', 'https://i.imgur.com/fh1T0Kp.png', 'https://i.imgur.com/9nDEpmX.png'],
    category: Category.INFANTIL,
    sizes: ['P (ESGOTADO)', 'M (ESGOTADO)'],
    personalizable: false,
    soldOut: true
  },
  {
    id: 'kid-28',
    name: 'infantil nacional premium São Paulo branco 2026',
    price: 80.00,
    images: ['https://i.imgur.com/44Vlqlc.png', 'https://i.imgur.com/mzSnYKR.png', 'https://i.imgur.com/BzPsNCy.png'],
    category: Category.INFANTIL,
    sizes: ['P', 'M', 'G'],
    personalizable: true
  },
  {
    id: 'kid-29',
    name: 'Kit infantil tailandesa- Mexico',
    price: 180.00,
    images: ['https://i.imgur.com/G5HH8Te.png', 'https://i.imgur.com/MRADJMl.png', 'https://i.imgur.com/HZzyqDV.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)', '20 (5-6 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-30',
    name: 'Kit infantil tailandesa- inter miami polo messi rosa',
    price: 180.00,
    images: ['https://i.imgur.com/udV9KWa.png', 'https://i.imgur.com/7FxsbFY.png', 'https://i.imgur.com/rDCIypP.png'],
    category: Category.INFANTIL,
    sizes: ['22 - (6-7 anos)'],
    personalizable: false
  },
  {
    id: 'kid-31',
    name: 'Kit infantil tailandesa- Argentina',
    price: 200.00,
    images: ['https://i.imgur.com/NGafLgf.png', 'https://i.imgur.com/1rTgUEO.png', 'https://i.imgur.com/9HkyZhd.png'],
    category: Category.INFANTIL,
    sizes: ['20 (5-6 ANOS)', '22 (6-7 ANOS)', '26 (9-10 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-32',
    name: 'Kit infantil tailandesa- Flamengo branca 2025',
    price: 180.00,
    images: ['https://i.imgur.com/d1pYEmM.png', 'https://i.imgur.com/doeultV.png', 'https://i.imgur.com/iIlvwhE.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)'],
    personalizable: false
  },
  {
    id: 'kid-33',
    name: 'Kit infantil tailandesa- Portugal copa',
    price: 200.00,
    images: ['https://i.imgur.com/uSDXMqE.png', 'https://i.imgur.com/mnx5JUI.png', 'https://i.imgur.com/QA1NLkH.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)', '20 (5-6 ANOS)', '26 (9-10 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-34',
    name: 'Kit infantil tailandesa- cruzeiro azul',
    price: 180.00,
    images: ['https://i.imgur.com/XqgLzU3.png', 'https://i.imgur.com/jENm54i.png', 'https://i.imgur.com/3XMINHp.png'],
    category: Category.INFANTIL,
    sizes: ['22 (6-7 ANOS)', '28 (11-12 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-35',
    name: 'Kit infantil tailandesa- flamengo bege',
    price: 180.00,
    images: ['https://i.imgur.com/M0E4XfG.png', 'https://i.imgur.com/KmBiE4J.png', 'https://i.imgur.com/haqBA1R.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-36',
    name: 'Kit infantil tailandesa- santos branca',
    price: 180.00,
    images: ['https://i.imgur.com/eyjqmvh.png', 'https://i.imgur.com/4ude9xQ.png', 'https://i.imgur.com/bZKNgYl.png'],
    category: Category.INFANTIL,
    sizes: ['18 (3-4 ANOS)'],
    personalizable: true
  },
  {
    id: 'kid-37',
    name: 'Kit infantil tailandesa- sao paulo branca 2025',
    price: 180.00,
    images: ['https://i.imgur.com/jMlil4n.png', 'https://i.imgur.com/EZYk4VZ.png', 'https://i.imgur.com/684fb33.png'],
    category: Category.INFANTIL,
    sizes: ['22 (6-7 ANOS)'],
    personalizable: false
  },
  {
    id: 'retro-1',
    name: 'Retro tailandesa Brasil 1998 amarela sem nome',
    price: 260.00,
    images: ['https://i.imgur.com/PFNVbZP.png', 'https://i.imgur.com/PR3gqGm.png', 'https://i.imgur.com/fvaqOaW.png'],
    category: Category.RETRO,
    sizes: ['G', 'GG', '2XL(G1-XXL)'],
    personalizable: true
  },
  {
    id: 'retro-2',
    name: 'Retro tailandesa Brasil 1998 azul sem nome',
    price: 260.00,
    images: ['https://i.imgur.com/WVsSSKm.png', 'https://i.imgur.com/JOeuXM9.png', 'https://i.imgur.com/1FhIYMK.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1-XXL)'],
    personalizable: true
  },
  {
    id: 'retro-3',
    name: 'Retro tailandesa Brasil 2006 azul Ronaldinho',
    price: 300.00,
    images: ['https://i.imgur.com/6stNMGh.png', 'https://i.imgur.com/jVaiw6L.png', 'https://i.imgur.com/Bnvp6n2.png'],
    category: Category.RETRO,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'retro-4',
    name: 'Retrô tailandesa Brasil 2006 azul sem nome',
    price: 260.00,
    images: ['https://i.imgur.com/yGS5u8u.png', 'https://i.imgur.com/ya4iUwk.png', 'https://i.imgur.com/yN1IzyL.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', 'GG', '2XL(G1-XXL)'],
    personalizable: true
  },
  {
    id: 'retro-5',
    name: 'Retrô tailandesa brasil 94 sem nome',
    price: 260.00,
    images: ['https://i.imgur.com/DQHm6ub.png', 'https://i.imgur.com/ez0Clxy.png', 'https://i.imgur.com/7eD6iS2.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'retro-6',
    name: 'Retrô tailandesa brasil azul ronaldo 98',
    price: 300.00,
    images: ['https://i.imgur.com/rnHCDg0.png', 'https://i.imgur.com/ZL1QkBM.png', 'https://i.imgur.com/RfwGPMZ.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1-XXL)'],
    personalizable: false
  },
  {
    id: 'retro-7',
    name: 'Retrô tailandesa brasil ronaldo 2002 amarela',
    price: 300.00,
    images: ['https://i.imgur.com/j6Bd8Kv.png', 'https://i.imgur.com/ckYWEbB.png', 'https://i.imgur.com/UAU5qOM.png'],
    category: Category.RETRO,
    sizes: ['GG', '2XL(G1-XXL)'],
    personalizable: false
  },
  {
    id: 'retro-8',
    name: 'Retrô tailandesa brasil ronaldo 98 amarela',
    price: 300.00,
    images: ['https://i.imgur.com/BlaD8xS.png', 'https://i.imgur.com/YSiJWIv.png', 'https://i.imgur.com/5hGiyFd.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', 'GG', '2XL(G1-XXL)'],
    personalizable: false
  },
  {
    id: 'retro-9',
    name: 'Retrô tailandesa Barcelona Ronaldinho listrada',
    price: 300.00,
    images: ['https://i.imgur.com/tY8XeHY.png', 'https://i.imgur.com/WIzsJtC.png', 'https://i.imgur.com/tJNkzCK.png'],
    category: Category.RETRO,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'retro-10',
    name: 'Retrô tailandesa Barcelona listrada azul messi',
    price: 300.00,
    images: ['https://i.imgur.com/jVvGjdp.png', 'https://i.imgur.com/uFNdsBZ.png', 'https://i.imgur.com/sKZNG8x.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'retro-11',
    name: 'Retrô tailandesa Flamengo listrada adriano',
    price: 300.00,
    images: ['https://i.imgur.com/9glcpeh.png', 'https://i.imgur.com/xHSZFHb.png', 'https://i.imgur.com/JOyrSKq.png'],
    category: Category.RETRO,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'retro-12',
    name: 'Retrô tailandesa França 2006 zidane branca',
    price: 300.00,
    images: ['https://i.imgur.com/2OUsvF3.png', 'https://i.imgur.com/bDwJeG8.png', 'https://i.imgur.com/UJntVT3.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG'],
    personalizable: false
  },
  {
    id: 'retro-13',
    name: 'Retrô tailandesa França 98 zidane azul',
    price: 300.00,
    images: ['https://i.imgur.com/NovBF1Z.png', 'https://i.imgur.com/kd31ZvZ.png', 'https://i.imgur.com/NlxXuAy.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG'],
    personalizable: false
  },
  {
    id: 'retro-14',
    name: 'Retrô tailandesa Milan Kaká listrada',
    price: 300.00,
    images: ['https://i.imgur.com/PBJGxDQ.png', 'https://i.imgur.com/6KgnOvq.png', 'https://i.imgur.com/lorbcYL.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-15',
    name: 'Retrô tailandesa Real Madrid 9 Ronaldo',
    price: 300.00,
    images: ['https://i.imgur.com/LhY2zef.png', 'https://i.imgur.com/Py9DNRt.png', 'https://i.imgur.com/bEpTUIM.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-16',
    name: 'Retrô tailandesa Real Madrid Branca com azul ronaldo',
    price: 300.00,
    images: ['https://i.imgur.com/bdBWZ5s.png', 'https://i.imgur.com/c9tLFLH.png', 'https://i.imgur.com/4qbyOD0.png'],
    category: Category.RETRO,
    sizes: ['GG', '2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-17',
    name: 'Retrô tailandesa inter de Milão ronaldo',
    price: 300.00,
    images: ['https://i.imgur.com/OXYdO6T.png', 'https://i.imgur.com/54G3PdY.png', 'https://i.imgur.com/oNLKwY7.png'],
    category: Category.RETRO,
    sizes: ['GG', '2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-18',
    name: 'Retrô tailandesa real Madrid preta Kaká',
    price: 300.00,
    images: ['https://i.imgur.com/qqTQAkZ.png', 'https://i.imgur.com/T4Tiuoc.png', 'https://i.imgur.com/kQYsHnd.png'],
    category: Category.RETRO,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'retro-19',
    name: 'Retrô tailandesa santos neymar azul',
    price: 300.00,
    images: ['https://i.imgur.com/j2vM26S.png', 'https://i.imgur.com/7NBCCSH.png', 'https://i.imgur.com/1w4aDXv.png'],
    category: Category.RETRO,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'retro-20',
    name: 'Retrô tailandesa santos neymar branca',
    price: 300.00,
    images: ['https://i.imgur.com/7dGK5hA.png', 'https://i.imgur.com/uiFVYVv.png', 'https://i.imgur.com/EjyYYQ5.png'],
    category: Category.RETRO,
    sizes: ['2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-21',
    name: 'Retrô tailandesa santos neymar preta',
    price: 300.00,
    images: ['https://i.imgur.com/6yPLJNe.png', 'https://i.imgur.com/RBe1i1q.png', 'https://i.imgur.com/xfZpCIg.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG', '2XL(G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'retro-22',
    name: 'Retrô tailandesa Corinthians listrada japao',
    price: 300.00,
    images: ['https://i.imgur.com/WLkn1ww.png', 'https://i.imgur.com/rvSYtKh.png', 'https://i.imgur.com/rXUALHH.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'retro-23',
    name: 'Retrô tailandesa Corinthians vermelha São jorge',
    price: 260.00,
    images: ['https://i.imgur.com/cLYmLR5.png', 'https://i.imgur.com/skG91wU.png', 'https://i.imgur.com/Frg3RYG.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', '2XL (G1 - XXL )'],
    personalizable: false
  },
  {
    id: 'retro-24',
    name: 'Retrô tailandesa Flamengo azul',
    price: 260.00,
    images: ['https://i.imgur.com/ZXcLpFx.png', 'https://i.imgur.com/dFPt5GT.png', 'https://i.imgur.com/yZnY9Zr.png'],
    category: Category.RETRO,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'retro-25',
    name: 'Retrô tailandesa Inglaterra beckham',
    price: 300.00,
    images: ['https://i.imgur.com/NJU2jls.png', 'https://i.imgur.com/175f7H1.png', 'https://i.imgur.com/fiNGZrh.png'],
    category: Category.RETRO,
    sizes: ['M', '2XL (G1 - XXL )'],
    personalizable: false
  },
  {
    id: 'retro-26',
    name: 'Retrô tailandesa Manchester united cordão polo vermelha',
    price: 260.00,
    images: ['https://i.imgur.com/t0mqyVq.png', 'https://i.imgur.com/WSL2QHl.png', 'https://i.imgur.com/YxR9LEI.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'retro-27',
    name: 'Retrô tailandesa Manchester united vermelha ronaldo 2008',
    price: 300.00,
    images: ['https://i.imgur.com/czFTbr5.png', 'https://i.imgur.com/SSLR79w.png', 'https://i.imgur.com/hJBWOSO.png'],
    category: Category.RETRO,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'retro-28',
    name: 'Retrô tailandesa PSG cinza',
    price: 260.00,
    images: ['https://i.imgur.com/Nhg9AwT.png', 'https://i.imgur.com/FHeMzzt.png', 'https://i.imgur.com/j98eX09.png'],
    category: Category.RETRO,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'retro-29',
    name: 'Retrô tailandesa São Paulo branca motorola',
    price: 260.00,
    images: ['https://i.imgur.com/sjAkjYc.png', 'https://i.imgur.com/MIcQE8W.png', 'https://i.imgur.com/9RUQmHM.png'],
    category: Category.RETRO,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'retro-30',
    name: 'Retrô tailandesa São Paulo listrada motorola',
    price: 260.00,
    images: ['https://i.imgur.com/AEMLeyE.png', 'https://i.imgur.com/6i1AIsr.png', 'https://i.imgur.com/tPv3ntH.png'],
    category: Category.RETRO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'retro-31',
    name: 'Retrô tailandesa atletico mineiro',
    price: 260.00,
    images: ['https://i.imgur.com/G5PwZAS.png', 'https://i.imgur.com/fDoF0j3.png', 'https://i.imgur.com/dnd9f66.png'],
    category: Category.RETRO,
    sizes: ['GG', '2XL (G1-XXL)'],
    personalizable: true
  },
  {
    id: 'nba-2',
    name: 'Celtics preta nba',
    price: 200.00,
    images: ['https://i.imgur.com/t69sheN.png', 'https://i.imgur.com/V8dohin.png'],
    category: Category.NBA,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'nba-3',
    name: 'Miami colorida nba',
    price: 200.00,
    images: ['https://i.imgur.com/K7ogeNr.png', 'https://i.imgur.com/DxDbzd2.png', 'https://i.imgur.com/HvzTwB3.png'],
    category: Category.NBA,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'nba-4',
    name: 'Miami preta nba',
    price: 200.00,
    images: ['https://i.imgur.com/ES0qTLl.png', 'https://i.imgur.com/xyLStJS.png', 'https://i.imgur.com/uLP4RTx.png'],
    category: Category.NBA,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'nba-5',
    name: 'Regata nba golden state preta',
    price: 200.00,
    images: ['https://i.imgur.com/5xv8hC6.png', 'https://i.imgur.com/mCktl52.png', 'https://i.imgur.com/orHkUDx.png'],
    category: Category.NBA,
    sizes: ['M (ESGOTADO)', '2XL (G1 - XXL) (ESGOTADO)'],
    personalizable: false,
    soldOut: true
  },
  {
    id: 'nba-6',
    name: 'Laker roxa 23',
    price: 260.00,
    images: ['https://i.imgur.com/vQvbmAh.png', 'https://i.imgur.com/NvqCrUj.png', 'https://i.imgur.com/8UJRrOv.png'],
    category: Category.NBA,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'nba-7',
    name: 'Regata Nba Philadelphia',
    price: 260.00,
    images: ['https://i.imgur.com/Cdy0G6r.png', 'https://i.imgur.com/hXgHaLx.png', 'https://i.imgur.com/jGBlzRR.png'],
    category: Category.NBA,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'nba-8',
    name: 'Regata Nba lakers amarela 77',
    price: 260.00,
    images: ['https://i.imgur.com/daokbdy.png', 'https://i.imgur.com/VVJRe2V.png', 'https://i.imgur.com/1rDHjgB.png'],
    category: Category.NBA,
    sizes: ['2XL (G1 - XXL) (ESGOTADO)'],
    personalizable: false,
    soldOut: true
  },
  {
    id: 'nba-9',
    name: 'Regata nba lakers amarela 23',
    price: 260.00,
    images: ['https://i.imgur.com/v1Vt5zN.png', 'https://i.imgur.com/BCw1MmD.png', 'https://i.imgur.com/U5pHcP8.png'],
    category: Category.NBA,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'nba-10',
    name: 'Regata nba lakers branca',
    price: 260.00,
    images: ['https://i.imgur.com/0cKFvGO.png', 'https://i.imgur.com/zdWCQX9.png', 'https://i.imgur.com/txEyoM3.png'],
    category: Category.NBA,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'bone-1',
    name: 'BONÉ ARSENAL PRETO',
    price: 60.00,
    images: ['https://i.imgur.com/xOMC2CR.png', 'https://i.imgur.com/B9DiaGG.png', 'https://i.imgur.com/cNYNAIv.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-2',
    name: 'BONÉ ALL HILAL AZUL CLARO',
    price: 60.00,
    images: ['https://i.imgur.com/RUUZWcj.png', 'https://i.imgur.com/QLtlqjy.png', 'https://i.imgur.com/g09PZPy.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-3',
    name: 'BONÉ ALL NASSR AMARELO',
    price: 60.00,
    images: ['https://i.imgur.com/HkQMLIM.png', 'https://i.imgur.com/Hka8c1N.png', 'https://i.imgur.com/RCxRM1k.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-4',
    name: 'BONÉ ALL NASSR PRETO',
    price: 60.00,
    images: ['https://i.imgur.com/Bw4Gh4A.png', 'https://i.imgur.com/kZNPV24.png', 'https://i.imgur.com/uVIevOW.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-5',
    name: 'BONÉ INTER MIAMI',
    price: 60.00,
    images: ['https://i.imgur.com/56EK8SY.png', 'https://i.imgur.com/PcAjYMY.png', 'https://i.imgur.com/KxYVoT4.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-6',
    name: 'BONÉ INTERNACIONAL VERMELHO',
    price: 60.00,
    images: ['https://i.imgur.com/sfzAiJY.png', 'https://i.imgur.com/zxh9OfG.png', 'https://i.imgur.com/VQ8e2wd.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-7',
    name: 'Boné Brasil amarelo',
    price: 60.00,
    images: ['https://i.imgur.com/ghY4heF.png', 'https://i.imgur.com/xqjgSE3.png', 'https://i.imgur.com/2eLuCLQ.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-8',
    name: 'Boné Brasil azul',
    price: 60.00,
    images: ['https://i.imgur.com/zDLnrTf.png', 'https://i.imgur.com/Kag2m9h.png', 'https://i.imgur.com/L0K6hL9.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-9',
    name: 'Boné Brasil branco',
    price: 60.00,
    images: ['https://i.imgur.com/D6Gx3MF.png', 'https://i.imgur.com/9Ykzijb.png', 'https://i.imgur.com/bGNShhd.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'bone-10',
    name: 'Boné Brasil preto',
    price: 60.00,
    images: ['https://i.imgur.com/nk69MWF.png', 'https://i.imgur.com/MTW6zIc.png', 'https://i.imgur.com/9DRebsJ.png'],
    category: Category.BONES,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'cropped-1',
    name: 'CROPPED AZUL BORDADO',
    price: 60.00,
    images: ['https://i.imgur.com/j8aJnyr.png', 'https://i.imgur.com/L6MNN5i.png', 'https://i.imgur.com/OYLDh9i.png'],
    category: Category.CROPPEDS,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'cropped-2',
    name: 'CROPPED BRASIL AMARELO BORDADO',
    price: 60.00,
    images: ['https://i.imgur.com/mCAznLp.png', 'https://i.imgur.com/wwUYPrB.png', 'https://i.imgur.com/94ugDm3.png'],
    category: Category.CROPPEDS,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'cropped-3',
    name: 'CROPPED BRASIL BRANCO BORDADO',
    price: 60.00,
    images: ['https://i.imgur.com/x32QVbZ.png', 'https://i.imgur.com/zPgVSmr.png', 'https://i.imgur.com/oKfbfW9.png'],
    category: Category.CROPPEDS,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'cropped-4',
    name: 'CROPPED BRASIL VERDE BORDADO',
    price: 60.00,
    images: ['https://i.imgur.com/leeUe3V.png', 'https://i.imgur.com/YRqRg6G.png', 'https://i.imgur.com/OOpZunh.png'],
    category: Category.CROPPEDS,
    sizes: ['TAMANHO UNICO'],
    personalizable: false
  },
  {
    id: 'cropped-5',
    name: 'CROPPED AMARELO DTF',
    price: 40.00,
    images: ['https://i.imgur.com/q6gK3yr.jpeg', 'https://i.imgur.com/Zce6wu1.jpeg'],
    category: Category.CROPPEDS,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'cropped-6',
    name: 'CROPPED AZUL DTF',
    price: 40.00,
    images: ['https://i.imgur.com/8ulSjLV.jpeg', 'https://i.imgur.com/uv8rps1.jpeg'],
    category: Category.CROPPEDS,
    sizes: ['M', 'GG'],
    personalizable: false
  },
  {
    id: 'cropped-7',
    name: 'CROPPED BRANCO DTF',
    price: 40.00,
    images: ['https://i.imgur.com/7x9XDnD.jpeg', 'https://i.imgur.com/I8NEceY.jpeg'],
    category: Category.CROPPEDS,
    sizes: ['P', 'M', 'G'],
    personalizable: false
  },
  {
    id: 'cropped-8',
    name: 'CROPPED VERDE DTF',
    price: 40.00,
    images: ['https://i.imgur.com/f78VbUL.jpeg', 'https://i.imgur.com/Lzo8AMg.jpeg'],
    category: Category.CROPPEDS,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'conjunto-1',
    name: 'CONJUNTO AGASALHO FLAMENGO AZUL CLARO',
    price: 400.00,
    images: ['https://i.imgur.com/n84X7tF.png'],
    category: Category.CONJUNTO,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'conjunto-2',
    name: 'CONJUNTO AGASALHO MANCHESTER UNITED',
    price: 400.00,
    images: ['https://i.imgur.com/SevAIAj.png'],
    category: Category.CONJUNTO,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'treino-1',
    name: 'KIT TREINO FLAMENGO CINZA',
    price: 200.00,
    images: ['https://i.imgur.com/JkFDYku.png'],
    category: Category.CONJUNTO,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'treino-2',
    name: 'KIT TREINO TOTTENHAM',
    price: 260.00,
    images: ['https://i.imgur.com/qshU8N0.png', 'https://i.imgur.com/noWWnNt.png', 'https://i.imgur.com/H8bZZsX.png'],
    category: Category.CONJUNTO,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'treino-3',
    name: 'KIT TREINO internacionale',
    price: 260.00,
    images: ['https://i.imgur.com/WePorgb.png', 'https://i.imgur.com/GvRPPY3.png', 'https://i.imgur.com/e1u6V4u.png'],
    category: Category.CONJUNTO,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'corta-vento-1',
    name: 'CORTA VENTO VASCO',
    price: 200.00,
    images: ['https://i.imgur.com/AiuZUPM.png'],
    category: Category.CORTA_VENTO,
    sizes: ['M', '2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'fem-1',
    name: 'Feminina nacional premium Al Hilal branca',
    price: 70.00,
    images: ['https://i.imgur.com/FHKoidc.png', 'https://i.imgur.com/dAR8ll2.png', 'https://i.imgur.com/10amDL2.png'],
    category: Category.FEMININO,
    sizes: ['M', 'G', 'P'],
    personalizable: false
  },
  {
    id: 'fem-2',
    name: 'Feminina nacional premium All hilal azul',
    price: 70.00,
    images: ['https://i.imgur.com/aBsREbc.png', 'https://i.imgur.com/R0O8VWF.png', 'https://i.imgur.com/OshKrsq.png'],
    category: Category.FEMININO,
    sizes: ['P', 'M'],
    personalizable: false
  },
  {
    id: 'fem-3',
    name: 'Feminina nacional premium Brasil polo preta',
    price: 70.00,
    images: ['https://i.imgur.com/QHdEQal.png', 'https://i.imgur.com/8JerC8v.png', 'https://i.imgur.com/Pm9KVsm.png'],
    category: Category.FEMININO,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'fem-4',
    name: 'Feminina nacional premium Brasil preta',
    price: 80.00,
    images: ['https://i.imgur.com/qSWplte.png', 'https://i.imgur.com/vU6a9Tt.png', 'https://i.imgur.com/rUFL9ao.png'],
    category: Category.FEMININO,
    sizes: ['M', 'G'],
    personalizable: true
  },
  {
    id: 'fem-5',
    name: 'Feminina nacional premium Flamengo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/VonRPPE.png', 'https://i.imgur.com/YbEhTyc.png', 'https://i.imgur.com/uFgXCiS.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'fem-6',
    name: 'Feminina nacional premium Palmeiras neon',
    price: 70.00,
    images: ['https://i.imgur.com/UkOlPVP.png', 'https://i.imgur.com/Hw6liH0.png', 'https://i.imgur.com/F2HfK6w.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'fem-7',
    name: 'Feminina nacional premium Santos azul carpa',
    price: 70.00,
    images: ['https://i.imgur.com/BTChYHm.png', 'https://i.imgur.com/Df0BVEZ.png', 'https://i.imgur.com/MmWJbxo.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-8',
    name: 'Feminina nacional premium São Paulo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/O8iLKhw.png', 'https://i.imgur.com/UxL59q9.png', 'https://i.imgur.com/UoIkbGd.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-9',
    name: 'Feminina nacional premium São Paulo listrada adidas',
    price: 70.00,
    images: ['https://i.imgur.com/M8B3nyv.png', 'https://i.imgur.com/DFffBXV.png', 'https://i.imgur.com/BF7pe3u.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-10',
    name: 'Feminina nacional premium Brasil amarela copa',
    price: 120.00,
    images: ['https://i.imgur.com/SSkfYuk.png', 'https://i.imgur.com/DP1ICPF.png', 'https://i.imgur.com/P16RQdd.png'],
    category: Category.FEMININO,
    sizes: ['P', 'M', 'G'],
    personalizable: true
  },
  {
    id: 'fem-11',
    name: 'feminina nacional premium Brasil branca polo',
    price: 90.00,
    images: ['https://i.imgur.com/LYv6uBG.png', 'https://i.imgur.com/05ICpeA.png', 'https://i.imgur.com/4aud78G.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-12',
    name: 'Feminina tailandesa Botafogo listrada',
    price: 180.00,
    images: ['https://i.imgur.com/DfFI34s.png', 'https://i.imgur.com/CAK7KLn.png', 'https://i.imgur.com/Ot9uGVV.png'],
    category: Category.FEMININO,
    sizes: ['P', 'G'],
    personalizable: true
  },
  {
    id: 'fem-13',
    name: 'Feminina tailandesa Brasil azul 2026',
    price: 240.00,
    images: ['https://i.imgur.com/4n5Fc4E.png', 'https://i.imgur.com/4iSTxO9.png', 'https://i.imgur.com/Qn8ZfXf.png'],
    category: Category.FEMININO,
    sizes: ['M', 'G'],
    personalizable: true
  },
  {
    id: 'fem-14',
    name: 'Feminina tailandesa palmeiras amarela',
    price: 200.00,
    images: ['https://i.imgur.com/0cEXGQM.png', 'https://i.imgur.com/B23ck9o.png', 'https://i.imgur.com/l0MsjJO.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'fem-15',
    name: 'Feminina tailandesa palmeiras branca',
    price: 180.00,
    images: ['https://i.imgur.com/OR6uWiu.png', 'https://i.imgur.com/C33K6kC.png', 'https://i.imgur.com/PpVr4tC.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'fem-16',
    name: 'feminina nacional premium Corinthians branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/uo0pqEW.png', 'https://i.imgur.com/bOjDM7W.png', 'https://i.imgur.com/ZcErZSD.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'fem-17',
    name: 'feminina nacional premium Flamengo 2023',
    price: 80.00,
    images: ['https://i.imgur.com/w7mmMzW.png', 'https://i.imgur.com/rzlW6aX.png', 'https://i.imgur.com/4TwjrC6.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'fem-18',
    name: 'feminina nacional premium Flamengo listrada 2022',
    price: 80.00,
    images: ['https://i.imgur.com/qSXDVBT.png', 'https://i.imgur.com/JVrqSVP.png', 'https://i.imgur.com/3izfIBS.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'fem-19',
    name: 'feminina nacional premium Inter miami preta',
    price: 80.00,
    images: ['https://i.imgur.com/eQldClX.png', 'https://i.imgur.com/Cwo2cuF.png', 'https://i.imgur.com/E3j8fMB.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'fem-20',
    name: 'feminina nacional premium Inter miami rosa',
    price: 80.00,
    images: ['https://i.imgur.com/sLfn7yv.png', 'https://i.imgur.com/1wGLUSO.png', 'https://i.imgur.com/tyiSL4C.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'fem-21',
    name: 'feminina nacional premium Manchester united',
    price: 80.00,
    images: ['https://i.imgur.com/aIzLeIY.png', 'https://i.imgur.com/Jr6AWMF.png', 'https://i.imgur.com/P4wl8k3.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-22',
    name: 'feminina nacional premium Palmeiras amarela',
    price: 80.00,
    images: ['https://i.imgur.com/ZAYSR2E.png'],
    category: Category.FEMININO,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'fem-23',
    name: 'feminina nacional premium Palmeiras branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/a9uvd6q.png', 'https://i.imgur.com/DzsGZGM.png', 'https://i.imgur.com/gmyY6tp.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'fem-24',
    name: 'feminina nacional premium Palmeiras verde 2026',
    price: 80.00,
    images: ['https://i.imgur.com/7p8vaHV.png', 'https://i.imgur.com/E33ga0P.png', 'https://i.imgur.com/JfJjTsM.png'],
    category: Category.FEMININO,
    sizes: [],
    personalizable: true
  },
  {
    id: 'fem-25',
    name: 'feminina nacional premium Psg',
    price: 80.00,
    images: ['https://i.imgur.com/OMR6A8D.png', 'https://i.imgur.com/h2dT8M2.png', 'https://i.imgur.com/lyS9cIA.png'],
    category: Category.FEMININO,
    sizes: ['P', 'G'],
    personalizable: true
  },
  {
    id: 'fem-26',
    name: 'feminina nacional premium Real Madrid bellingham',
    price: 80.00,
    images: ['https://i.imgur.com/VdzUtqg.png', 'https://i.imgur.com/tjTWDim.png', 'https://i.imgur.com/GeAR2gO.png'],
    category: Category.FEMININO,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'fem-27',
    name: 'feminina nacional premium Real Madrid mbappé',
    price: 80.00,
    images: ['https://i.imgur.com/FYq8ZBn.png', 'https://i.imgur.com/gdXtX9p.png', 'https://i.imgur.com/UdwAOmO.png'],
    category: Category.FEMININO,
    sizes: ['M', 'G (ESGOTADO)'],
    personalizable: false
  },
  {
    id: 'fem-28',
    name: 'feminina nacional premium Santos branca',
    price: 40.00,
    images: ['https://i.imgur.com/60IKN6D.png', 'https://i.imgur.com/fh1T0Kp.png', 'https://i.imgur.com/9nDEpmX.png'],
    category: Category.FEMININO,
    sizes: ['P (ESGOTADO)', 'M (ESGOTADO)'],
    personalizable: false,
    soldOut: true
  },
  {
    id: 'fem-29',
    name: 'feminina nacional premium São Paulo branco 2026',
    price: 80.00,
    images: ['https://i.imgur.com/44Vlqlc.png', 'https://i.imgur.com/mzSnYKR.png', 'https://i.imgur.com/BzPsNCy.png'],
    category: Category.FEMININO,
    sizes: [],
    personalizable: true
  },
  {
    id: 'fem-30',
    name: 'Feminina torcedor flamengo cinza 2024',
    price: 180.00,
    images: ['https://i.imgur.com/tsSyN7j.png', 'https://i.imgur.com/O4V6DrA.png', 'https://i.imgur.com/5EM7YSo.png'],
    category: Category.FEMININO,
    sizes: ['P'],
    personalizable: false
  },
  {
    id: 'int-1',
    name: 'Tailandesa torcedor Argentina 2022',
    price: 180.00,
    images: ['https://i.imgur.com/8FulW0d.png', 'https://i.imgur.com/Ootpxyu.png', 'https://i.imgur.com/x4MRp8a.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-2',
    name: 'nacional premium Argentina Maradona',
    price: 70.00,
    images: ['https://i.imgur.com/gIptJ2X.png', 'https://i.imgur.com/8ULWh5Y.png', 'https://i.imgur.com/DR1OB1s.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-3',
    name: 'nacional premium Equador',
    price: 70.00,
    images: ['https://i.imgur.com/tl2FVKP.png', 'https://i.imgur.com/F8fROvt.png', 'https://i.imgur.com/42bc7pd.png'],
    category: Category.CLUBES_INT,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'int-4',
    name: 'nacional premium Alemanha 2026',
    price: 80.00,
    images: ['https://i.imgur.com/ywaNTGz.png', 'https://i.imgur.com/X3pBVI4.png', 'https://i.imgur.com/s0rXFzC.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-5',
    name: 'nacional premium Portugal vermelha',
    price: 80.00,
    images: ['https://i.imgur.com/PUAcMJX.png', 'https://i.imgur.com/Sa7OfHS.png', 'https://i.imgur.com/KOc8Ehk.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'int-6',
    name: 'Tailandesa torcedor Japão',
    price: 180.00,
    images: ['https://i.imgur.com/h67UVu6.png', 'https://i.imgur.com/KgpOqbC.png', 'https://i.imgur.com/t0Kp92X.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-7',
    name: 'Tailandesa torcedor Mexico verde',
    price: 180.00,
    images: ['https://i.imgur.com/9pBmJX8.png', 'https://i.imgur.com/EwPmdFf.png', 'https://i.imgur.com/QPTZyfs.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-8',
    name: 'Tailandesa torcedor alemanha azul',
    price: 180.00,
    images: ['https://i.imgur.com/rF6pszA.png', 'https://i.imgur.com/j7nqOc8.png', 'https://i.imgur.com/EcatrZn.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-9',
    name: 'Tailandesa torcedor Alemanha Branca',
    price: 200.00,
    images: ['https://i.imgur.com/BIyi7CR.png', 'https://i.imgur.com/ozHWR0N.png', 'https://i.imgur.com/BrAJwuY.png'],
    category: Category.CLUBES_INT,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-10',
    name: 'Tailandesa torcedor Argentina',
    price: 200.00,
    images: ['https://i.imgur.com/yiAAdfN.png', 'https://i.imgur.com/P3HMd6C.png', 'https://i.imgur.com/dm6DPqP.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'int-11',
    name: 'Tailandesa torcedor Belgica vermelha',
    price: 180.00,
    images: ['https://i.imgur.com/ObopNr2.png', 'https://i.imgur.com/RbQCbMC.png', 'https://i.imgur.com/YM7pzP3.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-12',
    name: 'Tailandesa torcedor Itália azul',
    price: 200.00,
    images: ['https://i.imgur.com/7bgszu3.png', 'https://i.imgur.com/lomXhcm.png', 'https://i.imgur.com/jm8yP8e.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-13',
    name: 'Tailandesa torcedor Itália branca',
    price: 200.00,
    images: ['https://i.imgur.com/pkX4ilt.png', 'https://i.imgur.com/EBDVU3Q.png', 'https://i.imgur.com/ZisTRqc.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-14',
    name: 'Tailandesa torcedor Portugal vermelha',
    price: 180.00,
    images: ['https://i.imgur.com/1n8dRvA.png', 'https://i.imgur.com/7CCLi4V.png', 'https://i.imgur.com/kEYdoAA.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-15',
    name: 'Bassebal real Madrid',
    price: 220.00,
    images: ['https://i.imgur.com/7n2jZef.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'GG'],
    personalizable: false
  },
  {
    id: 'int-16',
    name: 'Tailandesa torcedor man city listrada',
    price: 220.00,
    images: ['https://i.imgur.com/QwAo4UE.png', 'https://i.imgur.com/DguZgef.png', 'https://i.imgur.com/rJwFpp3.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-17',
    name: 'Jogador tailandesa Newcastle',
    price: 260.00,
    images: ['https://i.imgur.com/GOvDmiC.png', 'https://i.imgur.com/zg1hVrF.png', 'https://i.imgur.com/QfQXKbc.png'],
    category: Category.CLUBES_INT,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'int-18',
    name: 'Modelo Jogador Barcelona 2024',
    price: 260.00,
    images: ['https://i.imgur.com/C2oCm0P.png', 'https://i.imgur.com/yxycjOn.png', 'https://i.imgur.com/6aIVGOk.png'],
    category: Category.CLUBES_INT,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-19',
    name: 'nacional premium al hilal',
    price: 70.00,
    images: ['https://i.imgur.com/MXBJwY8.png', 'https://i.imgur.com/nesLIha.png', 'https://i.imgur.com/Y5cKXwl.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-20',
    name: 'nacional premium Bayer vinho',
    price: 80.00,
    images: ['https://i.imgur.com/Bh9Ghou.png', 'https://i.imgur.com/Az5zhuJ.png', 'https://i.imgur.com/TrjIFVY.png'],
    category: Category.CLUBES_INT,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'int-21',
    name: 'nacional premium Inter de Milão branca',
    price: 80.00,
    images: ['https://i.imgur.com/9kqhqCz.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-22',
    name: 'nacional premium Liverpool vermelha',
    price: 80.00,
    images: ['https://i.imgur.com/HGIwmDq.png', 'https://i.imgur.com/UGe61be.png', 'https://i.imgur.com/v7aD8ce.png'],
    category: Category.CLUBES_INT,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'int-23',
    name: 'nacional premium Manchester united vermelha',
    price: 80.00,
    images: ['https://i.imgur.com/Og5WeUP.png', 'https://i.imgur.com/Jgrz8Wp.png', 'https://i.imgur.com/tPcdLc6.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'int-24',
    name: 'nacional premium Real branca detalhe amarelo',
    price: 70.00,
    images: ['https://i.imgur.com/r0lanA3.png', 'https://i.imgur.com/MrcgcML.png', 'https://i.imgur.com/i8PxbJH.png'],
    category: Category.CLUBES_INT,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'int-25',
    name: 'nacional premium Retro Chelsea preta',
    price: 80.00,
    images: ['https://i.imgur.com/CLF7JsO.png', 'https://i.imgur.com/uqVbxCd.png', 'https://i.imgur.com/FBl12Rq.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'int-26',
    name: 'Tailandesa torcedor Bohemian Football Club preta',
    price: 180.00,
    images: ['https://i.imgur.com/dLbyVEx.png', 'https://i.imgur.com/H17YNhc.png', 'https://i.imgur.com/J8sH8ZO.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-27',
    name: 'Tailandesa torcedor Man city vinho',
    price: 180.00,
    images: ['https://i.imgur.com/sxcPLjG.png', 'https://i.imgur.com/UOqETYW.png', 'https://i.imgur.com/WXpP5fc.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-28',
    name: 'Tailandesa torcedor PSG Total 90 vermelha',
    price: 200.00,
    images: ['https://i.imgur.com/ngWMQcg.png', 'https://i.imgur.com/xOaBEDt.png', 'https://i.imgur.com/889NVit.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-29',
    name: 'Tailandesa torcedor River plate',
    price: 200.00,
    images: ['https://i.imgur.com/knak5uS.png', 'https://i.imgur.com/wqJ4RzE.png', 'https://i.imgur.com/YahhVaI.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-30',
    name: 'Tailandesa torcedor Roma branca',
    price: 180.00,
    images: ['https://i.imgur.com/vS8KcJ4.png', 'https://i.imgur.com/RbYvAhb.png', 'https://i.imgur.com/mxRyN4l.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-31',
    name: 'Tailandesa torcedor bayer munch',
    price: 180.00,
    images: ['https://i.imgur.com/l026db0.png', 'https://i.imgur.com/kkz2vZ8.png', 'https://i.imgur.com/1k7ahUo.png'],
    category: Category.CLUBES_INT,
    sizes: ['G', 'GG'],
    personalizable: true
  },
  {
    id: 'int-32',
    name: 'Tailandesa torcedor liverpool preta',
    price: 180.00,
    images: ['https://i.imgur.com/aPtB4vY.png', 'https://i.imgur.com/mWkWkcF.png', 'https://i.imgur.com/ytZHOet.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-33',
    name: 'Tailandesa torcedor 1.1 Porto',
    price: 180.00,
    images: ['https://i.imgur.com/MF1vuqn.png', 'https://i.imgur.com/YA0cbnb.png', 'https://i.imgur.com/d8LGbEt.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-34',
    name: 'Tailandesa torcedor 1.1 new castle',
    price: 180.00,
    images: ['https://i.imgur.com/hGBhPTq.png', 'https://i.imgur.com/blO4Gs5.png', 'https://i.imgur.com/6RkEOAP.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-35',
    name: 'Tailandesa torcedor Fulham braca',
    price: 180.00,
    images: ['https://i.imgur.com/NkH7WOe.png', 'https://i.imgur.com/K5Xkcbw.png', 'https://i.imgur.com/sCw1nAF.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-36',
    name: 'Tailandesa torcedor Lazio azul',
    price: 180.00,
    images: ['https://i.imgur.com/12XhmBj.png', 'https://i.imgur.com/MIMBIj6.png', 'https://i.imgur.com/7YGlcyp.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-37',
    name: 'Tailandesa torcedor Manchester United roxa',
    price: 180.00,
    images: ['https://i.imgur.com/9XjzeCP.png', 'https://i.imgur.com/fchZca1.png', 'https://i.imgur.com/JTynDXQ.png'],
    category: Category.CLUBES_INT,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'int-38',
    name: 'Tailandesa torcedor ajax',
    price: 180.00,
    images: ['https://i.imgur.com/hMJRi5E.png', 'https://i.imgur.com/HfWVi4l.png', 'https://i.imgur.com/IQZBh5Q.png'],
    category: Category.CLUBES_INT,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-39',
    name: 'Tailandesa torcedor arsenal branca',
    price: 200.00,
    images: ['https://i.imgur.com/HUmhwtd.png', 'https://i.imgur.com/hKS3rj4.png', 'https://i.imgur.com/weUY5iE.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-40',
    name: 'Tailandesa torcedor chelsea preta',
    price: 180.00,
    images: ['https://i.imgur.com/HyX22oM.png', 'https://i.imgur.com/lgSflAV.png', 'https://i.imgur.com/dm2lanq.png'],
    category: Category.CLUBES_INT,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'int-41',
    name: 'Tailandesa torcedor napoli branca',
    price: 180.00,
    images: ['https://i.imgur.com/VIUCLBJ.png', 'https://i.imgur.com/TkWlX4o.png', 'https://i.imgur.com/T1kyYPw.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'int-42',
    name: 'Tailandesa torcedor real Madrid',
    price: 180.00,
    images: ['https://i.imgur.com/ARPdEpX.png', 'https://i.imgur.com/443NCQN.png', 'https://i.imgur.com/2mSbpwT.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'int-43',
    name: 'Tailandesa torcedor sport portugal',
    price: 180.00,
    images: ['https://i.imgur.com/saHoJ56.png', 'https://i.imgur.com/exIhyiH.png', 'https://i.imgur.com/uhytze9.png'],
    category: Category.CLUBES_INT,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'br-1',
    name: 'Flamengo manga longa',
    price: 200.00,
    images: ['https://i.imgur.com/tkSD56P.png', 'https://i.imgur.com/pOvAXGu.png', 'https://i.imgur.com/Y2JTftK.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'br-2',
    name: 'Jogador tailandesa Flamengo preta 2024',
    price: 200.00,
    images: ['https://i.imgur.com/66E6Owt.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-3',
    name: 'Jogador tailandesa verde crefisa 2024',
    price: 200.00,
    images: ['https://i.imgur.com/II9UOSn.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'br-4',
    name: 'KIT TREINO FLAMENGO CINZA',
    price: 200.00,
    images: ['https://i.imgur.com/JkFDYku.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'br-5',
    name: 'Kit infantil tailandesa- vasco preto 2024',
    price: 140.00,
    images: ['https://i.imgur.com/XiXfQj4.png', 'https://i.imgur.com/tfjzwwO.png', 'https://i.imgur.com/a0ZBis5.png'],
    category: Category.CLUBES_BR,
    sizes: ['22 - (6-7 ANOS)'],
    personalizable: true
  },
  {
    id: 'br-6',
    name: 'Nacional premium Corinthians all black',
    price: 70.00,
    images: ['https://i.imgur.com/BDIX01k.png', 'https://i.imgur.com/tSB3GI0.png', 'https://i.imgur.com/ct0jeew.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: false
  },
  {
    id: 'br-7',
    name: 'Nacional premium do flamengo branca',
    price: 70.00,
    images: ['https://i.imgur.com/CW0bdyQ.png', 'https://i.imgur.com/KBoUJSY.png', 'https://i.imgur.com/IVmE8do.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-8',
    name: 'Nacional premium do gremio listrada',
    price: 70.00,
    images: ['https://i.imgur.com/jDjdpOw.png', 'https://i.imgur.com/mmwliJ9.png', 'https://i.imgur.com/O8aSAok.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-9',
    name: 'Palmeiras verde manga longa',
    price: 200.00,
    images: ['https://i.imgur.com/Ka9vYPU.png', 'https://i.imgur.com/jgN3fGF.png', 'https://i.imgur.com/zVshSZV.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'br-10',
    name: 'Tailandesa torcedor Atlético Mineiro preto e dourado',
    price: 180.00,
    images: ['https://i.imgur.com/LpmFFf2.png', 'https://i.imgur.com/8GvQmvo.png', 'https://i.imgur.com/JHQWM2J.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-11',
    name: 'Tailandesa torcedor Atlético Mineiro bege',
    price: 140.00,
    images: ['https://i.imgur.com/9Hlh9pS.png', 'https://i.imgur.com/vR4247F.png', 'https://i.imgur.com/QAY23AO.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-12',
    name: 'Tailandesa torcedor Atlético Mineiro listrada betano',
    price: 140.00,
    images: ['https://i.imgur.com/t0aHPH4.png', 'https://i.imgur.com/0sII43f.png', 'https://i.imgur.com/g0nabkb.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'br-13',
    name: 'Tailandesa torcedor Atlético mineiro listrada 2025',
    price: 140.00,
    images: ['https://i.imgur.com/N9WJbs4.png', 'https://i.imgur.com/JUKrk2Q.png', 'https://i.imgur.com/D5RkHZb.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-14',
    name: 'infantil nacional premium Flamengo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/VonRPPE.png', 'https://i.imgur.com/YbEhTyc.png', 'https://i.imgur.com/uFgXCiS.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-15',
    name: 'infantil nacional premium Palmeiras neon',
    price: 70.00,
    images: ['https://i.imgur.com/UkOlPVP.png', 'https://i.imgur.com/Hw6liH0.png', 'https://i.imgur.com/F2HfK6w.png'],
    category: Category.CLUBES_BR,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'br-16',
    name: 'infantil nacional premium Santos azul carpa',
    price: 70.00,
    images: ['https://i.imgur.com/BTChYHm.png', 'https://i.imgur.com/Df0BVEZ.png', 'https://i.imgur.com/MmWJbxo.png'],
    category: Category.CLUBES_BR,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'br-17',
    name: 'infantil nacional premium São Paulo branca 2023',
    price: 70.00,
    images: ['https://i.imgur.com/O8iLKhw.png', 'https://i.imgur.com/UxL59q9.png', 'https://i.imgur.com/UoIkbGd.png'],
    category: Category.CLUBES_BR,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'br-18',
    name: 'infantil nacional premium São Paulo listrada adidas',
    price: 70.00,
    images: ['https://i.imgur.com/M8B3nyv.png', 'https://i.imgur.com/DFffBXV.png', 'https://i.imgur.com/BF7pe3u.png'],
    category: Category.CLUBES_BR,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'br-19',
    name: 'nacional premium Flamengo branca 2024',
    price: 66.00,
    images: ['https://i.imgur.com/5w93DkA.png', 'https://i.imgur.com/Ck6W0e3.png', 'https://i.imgur.com/pngXGBo.png'],
    category: Category.CLUBES_BR,
    sizes: ['G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-20',
    name: 'nacional premium Flamengo listrada 2024',
    price: 66.00,
    images: ['https://i.imgur.com/jhgj2xF.png', 'https://i.imgur.com/L2UENE7.png', 'https://i.imgur.com/B0Rqfg9.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-21',
    name: 'nacional premium Palmeiras branca 2024',
    price: 66.00,
    images: ['https://i.imgur.com/wc1ET29.png', 'https://i.imgur.com/yCgkcv4.png', 'https://i.imgur.com/kCzEeQA.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'br-22',
    name: 'nacional premium Palmeiras verde 2025',
    price: 66.00,
    images: ['https://i.imgur.com/k0MQpjo.png', 'https://i.imgur.com/GYyhKUs.png', 'https://i.imgur.com/P4S1kxK.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-23',
    name: 'nacional premium Palmeiras verde neon',
    price: 66.00,
    images: ['https://i.imgur.com/1sJBryj.png', 'https://i.imgur.com/XhHV0FM.png', 'https://i.imgur.com/cB73FuH.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-24',
    name: 'nacional premium Sport Recife',
    price: 66.00,
    images: ['https://i.imgur.com/Yxipa6T.png', 'https://i.imgur.com/It5iueP.png', 'https://i.imgur.com/hT3AzDB.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-25',
    name: 'Tailandesa torcedor são paulo listrada 2024',
    price: 300.00,
    images: ['https://i.imgur.com/BWQ450L.png', 'https://i.imgur.com/seGefQU.png', 'https://i.imgur.com/AGLCoDP.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'br-26',
    name: 'Feminina tailandesa Botafogo listrada',
    price: 180.00,
    images: ['https://i.imgur.com/DfFI34s.png', 'https://i.imgur.com/CAK7KLn.png', 'https://i.imgur.com/Ot9uGVV.png'],
    category: Category.CLUBES_BR,
    sizes: ['P', 'G'],
    personalizable: true
  },
  {
    id: 'br-27',
    name: 'Feminina tailandesa palmeiras amarela',
    price: 200.00,
    images: ['https://i.imgur.com/0cEXGQM.png', 'https://i.imgur.com/B23ck9o.png', 'https://i.imgur.com/l0MsjJO.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-28',
    name: 'Feminina tailandesa palmeiras branca',
    price: 180.00,
    images: ['https://i.imgur.com/OR6uWiu.png', 'https://i.imgur.com/C33K6kC.png', 'https://i.imgur.com/PpVr4tC.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-29',
    name: 'Jogador tailandesa Corinthians branca 2025',
    price: 300.00,
    images: ['https://i.imgur.com/U0izcTt.png', 'https://i.imgur.com/xzyKMgI.png', 'https://i.imgur.com/EOpDlnv.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-30',
    name: 'Jogador tailandesa Corinthians preta 2025',
    price: 300.00,
    images: ['https://i.imgur.com/wL2TZgA.png', 'https://i.imgur.com/udvPiRR.png', 'https://i.imgur.com/cxn8upT.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'br-31',
    name: 'Jogador tailandesa Flamengo branca 2025',
    price: 260.00,
    images: ['https://i.imgur.com/bhRP9ct.png', 'https://i.imgur.com/0zqOFqA.png', 'https://i.imgur.com/W7EPpk5.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-32',
    name: 'Jogador tailandesa Flamengo listrada 2025',
    price: 260.00,
    images: ['https://i.imgur.com/9tOt4N9.png', 'https://i.imgur.com/3WlJZdM.png', 'https://i.imgur.com/dcvxMgs.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-33',
    name: 'Jogador tailandesa São Paulo branca 2025',
    price: 260.00,
    images: ['https://i.imgur.com/GISls94.png', 'https://i.imgur.com/FHvXzpM.jpeg', 'https://i.imgur.com/c8OEJc4.jpeg'],
    category: Category.CLUBES_BR,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-34',
    name: 'Jogador tailandesa São Paulo preta',
    price: 300.00,
    images: ['https://i.imgur.com/oZj3c6E.png', 'https://i.imgur.com/qPYjE5Z.png', 'https://i.imgur.com/J0aU7e2.png'],
    category: Category.CLUBES_BR,
    sizes: ['G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-35',
    name: 'Jogador tailandesa flamengo bege',
    price: 300.00,
    images: ['https://i.imgur.com/FFV1YCw.png', 'https://i.imgur.com/ei0dE0g.png', 'https://i.imgur.com/Ly8qUMG.png'],
    category: Category.CLUBES_BR,
    sizes: ['G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-36',
    name: 'Jogador tailandesa palmeiras amarela',
    price: 300.00,
    images: ['https://i.imgur.com/bMDp5MZ.png', 'https://i.imgur.com/AIk2CZY.png', 'https://i.imgur.com/eG6DmMV.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-37',
    name: 'Jogador tailandesa palmeiras branca 2025',
    price: 260.00,
    images: ['https://i.imgur.com/cRbQgKD.png', 'https://i.imgur.com/IiRO7iq.png', 'https://i.imgur.com/NmWEzqT.png'],
    category: Category.CLUBES_BR,
    sizes: ['G', 'GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-38',
    name: 'Nacional premium do flamengo listrada',
    price: 80.00,
    images: ['https://i.imgur.com/GwHHrOK.png', 'https://i.imgur.com/bvcW5Od.png', 'https://i.imgur.com/VPGwYvS.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: false
  },
  {
    id: 'br-39',
    name: 'nacional premium Cruzeiro azul claro',
    price: 70.00,
    images: ['https://i.imgur.com/IJzo6Wj.png', 'https://i.imgur.com/B5j2EW8.png', 'https://i.imgur.com/im2f2bD.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-40',
    name: 'nacional premium fluminense',
    price: 70.00,
    images: ['https://i.imgur.com/zCRJo1Y.png', 'https://i.imgur.com/erJAXS2.png', 'https://i.imgur.com/PuNoL1h.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-41',
    name: 'nacional premium fluminense cartola verde',
    price: 70.00,
    images: ['https://i.imgur.com/yw0hLCF.png', 'https://i.imgur.com/15AXlF8.png', 'https://i.imgur.com/8neDlo8.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-42',
    name: 'nacional premium Bahia gola polo',
    price: 70.00,
    images: ['https://i.imgur.com/BFzLMbR.png', 'https://i.imgur.com/zkix6yX.png', 'https://i.imgur.com/bmlBMWb.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'br-43',
    name: 'nacional premium Bahia listras',
    price: 70.00,
    images: ['https://i.imgur.com/JsqCL5m.png', 'https://i.imgur.com/NozVzr7.png', 'https://i.imgur.com/KtY5vdX.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-44',
    name: 'nacional premium Corinthians preta',
    price: 70.00,
    images: ['https://i.imgur.com/1EkJfY1.png', 'https://i.imgur.com/tyi3IxS.png', 'https://i.imgur.com/lticWyG.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-45',
    name: 'nacional premium Flamengo listrada 2025',
    price: 70.00,
    images: ['https://i.imgur.com/nBwSwGC.png', 'https://i.imgur.com/RYbVMpk.png', 'https://i.imgur.com/bMJpxXY.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG (ESGOTADO)'],
    personalizable: false,
    soldOut: true
  },
  {
    id: 'br-46',
    name: 'nacional premium Palmeiras branca 2024',
    price: 70.00,
    images: ['https://i.imgur.com/zxkqJby.png', 'https://i.imgur.com/qNLFenV.png', 'https://i.imgur.com/OYXgQp7.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'GG'],
    personalizable: true
  },
  {
    id: 'br-47',
    name: 'nacional premium Santos listrada',
    price: 70.00,
    images: ['https://i.imgur.com/DQ0jmaM.png', 'https://i.imgur.com/gInsIye.png', 'https://i.imgur.com/PeKeXr0.png'],
    category: Category.CLUBES_BR,
    sizes: ['M'],
    personalizable: true
  },
  {
    id: 'br-48',
    name: 'nacional premium São Paulo 3 2024',
    price: 70.00,
    images: ['https://i.imgur.com/4BjKbql.png', 'https://i.imgur.com/RT52ITY.png', 'https://i.imgur.com/dLhUAbJ.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-49',
    name: 'nacional premium São Paulo branca 2026',
    price: 80.00,
    images: ['https://i.imgur.com/g2jACov.png', 'https://i.imgur.com/VKEkctB.png', 'https://i.imgur.com/2FDByUC.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-50',
    name: 'nacional premium Vasco Branco 2026',
    price: 80.00,
    images: ['https://i.imgur.com/FsgxIhj.png', 'https://i.imgur.com/BnBFnmz.png', 'https://i.imgur.com/ksBFIhx.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-51',
    name: 'nacional premium Vasco gola polo',
    price: 70.00,
    images: ['https://i.imgur.com/U3JqcHw.png', 'https://i.imgur.com/PIHsBos.png', 'https://i.imgur.com/QMDpO4T.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-52',
    name: 'nacional premium Vasco preta 2026',
    price: 80.00,
    images: ['https://i.imgur.com/WT3swhv.png', 'https://i.imgur.com/KeMfNhP.png', 'https://i.imgur.com/pbgqEWj.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-53',
    name: 'nacional premium Vitoria',
    price: 70.00,
    images: ['https://i.imgur.com/Txzmeia.png', 'https://i.imgur.com/9S8n54H.png', 'https://i.imgur.com/MMCwHDx.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-54',
    name: 'nacional premium palmeiras verde 2026',
    price: 80.00,
    images: ['https://i.imgur.com/izwMEz0.png', 'https://i.imgur.com/EJXxenC.png', 'https://i.imgur.com/iFmFuAP.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-55',
    name: 'nacional premium sao paulo preta listrada',
    price: 70.00,
    images: ['https://i.imgur.com/j9aaE9L.png', 'https://i.imgur.com/nTrb1fj.png', 'https://i.imgur.com/tTNWZGD.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-56',
    name: 'infantil/feminina nacional premium Corinthians branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/uo0pqEW.png', 'https://i.imgur.com/bOjDM7W.png', 'https://i.imgur.com/ZcErZSD.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-57',
    name: 'infantil/feminina nacional premium Flamengo 2023',
    price: 80.00,
    images: ['https://i.imgur.com/w7mmMzW.png', 'https://i.imgur.com/rzlW6aX.png', 'https://i.imgur.com/4TwjrC6.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-58',
    name: 'infantil/feminina nacional premium Flamengo listrada 2022',
    price: 80.00,
    images: ['https://i.imgur.com/qSXDVBT.png', 'https://i.imgur.com/JVrqSVP.png', 'https://i.imgur.com/3izfIBS.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: false
  },
  {
    id: 'br-59',
    name: 'infantil/feminina nacional premium Palmeiras amarela',
    price: 80.00,
    images: ['https://i.imgur.com/ZAYSR2E.png'],
    category: Category.CLUBES_BR,
    sizes: ['G'],
    personalizable: true
  },
  {
    id: 'br-60',
    name: 'infantil/feminina nacional premium Palmeiras branca 2025',
    price: 80.00,
    images: ['https://i.imgur.com/a9uvd6q.png', 'https://i.imgur.com/DzsGZGM.png', 'https://i.imgur.com/gmyY6tp.png'],
    category: Category.CLUBES_BR,
    sizes: ['P'],
    personalizable: true
  },
  {
    id: 'br-61',
    name: 'infantil/feminina nacional premium Palmeiras verde 2026',
    price: 80.00,
    images: ['https://i.imgur.com/7p8vaHV.png', 'https://i.imgur.com/E33ga0P.png', 'https://i.imgur.com/JfJjTsM.png'],
    category: Category.CLUBES_BR,
    sizes: [],
    personalizable: true
  },
  {
    id: 'br-62',
    name: 'infantil/feminina nacional premium São Paulo branco 2026',
    price: 80.00,
    images: ['https://i.imgur.com/44Vlqlc.png', 'https://i.imgur.com/mzSnYKR.png', 'https://i.imgur.com/BzPsNCy.png'],
    category: Category.CLUBES_BR,
    sizes: [],
    personalizable: true
  },
  {
    id: 'br-63',
    name: 'Tailandesa torcedor flamengo branca',
    price: 140.00,
    images: ['https://i.imgur.com/cuwMDGd.png', 'https://i.imgur.com/e2IWhWj.png', 'https://i.imgur.com/aMmquVj.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-64',
    name: 'Tailandesa torcedor 1.1 Corinthianos III preta e laranja total 90',
    price: 200.00,
    images: ['https://i.imgur.com/SeHTzUQ.png', 'https://i.imgur.com/RrJwduB.png', 'https://i.imgur.com/Jv1z2mK.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: false
  },
  {
    id: 'br-65',
    name: 'Tailandesa torcedor Corinthians branca',
    price: 180.00,
    images: ['https://i.imgur.com/jidWb7W.png', 'https://i.imgur.com/9VdxwiS.png', 'https://i.imgur.com/NiR7Ck5.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-66',
    name: 'Tailandesa torcedor Cruzeiro azul',
    price: 180.00,
    images: ['https://i.imgur.com/buSGDGO.png', 'https://i.imgur.com/4yHRMoL.png', 'https://i.imgur.com/jSfEmPN.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-67',
    name: 'Tailandesa torcedor Flamengo preta',
    price: 200.00,
    images: ['https://i.imgur.com/ezc9ALZ.png', 'https://i.imgur.com/XzmAtVg.png', 'https://i.imgur.com/R5jS9Oq.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-68',
    name: 'Tailandesa torcedor Palmeiras amarela',
    price: 200.00,
    images: ['https://i.imgur.com/RiQKgl4.png', 'https://i.imgur.com/dxYjaeY.png', 'https://i.imgur.com/lKVU1e5.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-69',
    name: 'Tailandesa torcedor Palmeiras branca',
    price: 180.00,
    images: ['https://i.imgur.com/aNA6IyY.png', 'https://i.imgur.com/KHYK3Pq.png', 'https://i.imgur.com/rOV69ML.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-70',
    name: 'Tailandesa torcedor Palmeiras branca 2025',
    price: 200.00,
    images: ['https://i.imgur.com/WewYOO8.png', 'https://i.imgur.com/tImI4pg.png', 'https://i.imgur.com/Rr5NLxb.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', 'G', 'GG'],
    personalizable: true
  },
  {
    id: 'br-71',
    name: 'Tailandesa torcedor Palmeiras verde',
    price: 180.00,
    images: ['https://i.imgur.com/eIBR17i.png', 'https://i.imgur.com/AVdynMy.png', 'https://i.imgur.com/iFCNYsZ.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG', '2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-72',
    name: 'Tailandesa torcedor flamengo bege',
    price: 200.00,
    images: ['https://i.imgur.com/6U8J7Z9.png', 'https://i.imgur.com/6tQeS2v.png', 'https://i.imgur.com/TXjxQ7X.png'],
    category: Category.CLUBES_BR,
    sizes: ['GG'],
    personalizable: true
  },
  {
    id: 'br-73',
    name: 'Tailandesa torcedor santos azul com patrocínio 7k',
    price: 180.00,
    images: ['https://i.imgur.com/KYdevsm.png', 'https://i.imgur.com/FvXc6ly.png', 'https://i.imgur.com/AlPYJRV.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: true
  },
  {
    id: 'br-74',
    name: 'Tailandesa torcedor são paulo listrada 2024',
    price: 300.00,
    images: ['https://i.imgur.com/oIp0KvL.png', 'https://i.imgur.com/sP5NGzb.png', 'https://i.imgur.com/eecVPsL.png'],
    category: Category.CLUBES_BR,
    sizes: ['2XL (G1 - XXL)'],
    personalizable: false
  },
  {
    id: 'br-75',
    name: 'Jogador tailandesa Flamengo listrada 2026',
    price: 300.00,
    images: ['https://i.imgur.com/ByYA8Dv.png', 'https://i.imgur.com/JjUw0vR.png', 'https://i.imgur.com/y5OVLQ9.png', 'https://i.imgur.com/T7lBHJL.png'],
    category: Category.CLUBES_BR,
    sizes: ['M', '2XL (G1 - XXL)'],
    personalizable: true
  }
];
