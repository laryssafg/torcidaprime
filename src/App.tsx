/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPortal } from './components/admin/AdminPortal';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Trash2, 
  Truck,
  Package,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Plus,
  Minus,
  Check
} from 'lucide-react';
import { 
  Category, 
  Product, 
  CartItem, 
  PersonalizationType, 
  OrderData,
} from './types';
import { 
  PRODUCTS, 
  COUPON_CODE, 
  COUPON_DISCOUNT, 
  PERSONALIZATION_OPTIONS,
  COLORS
} from './constants';
import { adminService } from './services/adminService';
import { 
  formatCurrency, 
  generateWhatsAppLink, 
  getAutoDescription,
  safeText,
  safeLower,
  normalizeProduct,
  getProductMedia,
  getProductSizes
} from './utils';

// Main App Component with Router
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminRoute />} />
        <Route path="/*" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  );
}

function AdminRoute() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div></div>;

  return user ? <AdminPortal /> : <AdminLogin />;
}

function Storefront() {
  // --- State ---
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [dbCoupons, setDbCoupons] = useState<any[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('torcida-prime-cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'any' | 'lte100' | '100to200' | 'gte200'>('any');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- External Data Sync (Real-time) ---
  useEffect(() => {
    // Products Listener
    const unsubscribeProducts = onSnapshot(collection(db, 'produtos'), (snapshot) => {
      const rawProds = snapshot.docs.map(doc => normalizeProduct(doc.id, doc.data()));
      
      const prods = rawProds.filter(p => {
        const isValid = p.name && !Number.isNaN(p.price) && p.price > 0 && p.active !== false;
        if (!isValid) {
          console.warn("Produto inválido ignorado:", p);
        }
        return isValid;
      });

      setDbProducts(prods);
    }, (error) => {
      console.error("Error fetching real-time products:", error);
    });

    // Coupons Listener
    const unsubscribeCoupons = onSnapshot(collection(db, 'cupons'), (snapshot) => {
      const cups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDbCoupons(cups);
    }, (error) => {
      console.error("Error fetching real-time coupons:", error);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCoupons();
    };
  }, []);

  // Prioritize dynamic products from Firebase
  const allProducts = useMemo(() => [...dbProducts, ...PRODUCTS], [dbProducts]);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('torcida-prime-cart', JSON.stringify(cart));
  }, [cart]);

  // --- Computed ---
  const filteredProducts = useMemo(() => {
    return allProducts.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = safeLower(p.name).includes(safeLower(searchQuery));
      let matchesPrice = true;
      if (priceFilter === 'lte100') matchesPrice = p.price <= 100;
      else if (priceFilter === '100to200') matchesPrice = p.price > 100 && p.price <= 200;
      else if (priceFilter === 'gte200') matchesPrice = p.price > 200;

      return matchesCategory && matchesSearch && matchesPrice;
    });
  }, [allProducts, selectedCategory, searchQuery, priceFilter]);

  const cartSubtotal = cart.reduce((acc, item) => {
    const perUnit = (item.product?.price || 0) + (item.personalization?.additionalPrice || 0);
    return acc + (perUnit * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon ? cartSubtotal * (appliedCoupon.discountPercent / 100) : 0;
  const cartTotal = cartSubtotal - discountAmount;

  // --- Handlers ---
  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
  };

  const applyCoupon = () => {
    const coupon = dbCoupons.find(c => c.code.toUpperCase() === couponInput.toUpperCase()) || 
                   (couponInput.toUpperCase() === COUPON_CODE ? { code: COUPON_CODE, discountPercent: COUPON_DISCOUNT * 100 } : null);
    
    if (coupon) {
      setAppliedCoupon(coupon);
      alert(`Cupom aplicado: ${coupon.discountPercent}% de desconto.`);
    } else {
      alert('Cupom inválido.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-900 text-white font-sans overflow-x-hidden selection:bg-[#fedf00] selection:text-black">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full h-16 bg-black border-b border-neutral-800 z-[60] px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSelectedCategory('Todos'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center border-2 border-gold shadow-lg shadow-gold/20 flex-shrink-0">
              <img 
                src="https://i.imgur.com/UFZMD9V.png" 
                alt="Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xl md:text-2xl font-black italic tracking-tighter flex items-center gap-1 uppercase">
              <span>TORCIDA</span>
              <span className="text-[#fedf00]">PRIME</span>
            </div>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-white/70">
          {[
            { label: 'Brasil', cat: Category.BRASIL },
            { label: 'Produtos', cat: 'Todos' },
            { label: 'Clubes', cat: Category.CLUBES_BR },
            { label: 'Infantil', cat: Category.INFANTIL },
            { label: 'NBA', cat: Category.NBA },
            { label: 'Bonés', cat: Category.BONES }
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => setSelectedCategory(item.cat as any)}
              className={`hover:text-[#fedf00] transition-colors ${selectedCategory === item.cat ? 'text-[#fedf00]' : ''}`}
            >
              {item.label}
            </button>
          ))}
          <a 
            href="/admin" 
            className="hover:text-gold transition-colors text-gold font-bold px-4 py-2 border border-gold/20 rounded-lg hover:bg-gold/10"
          >
            Portal do Vendedor
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div 
            onClick={() => setIsCartOpen(true)}
            className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full relative cursor-pointer group transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-white group-hover:text-[#fedf00]" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#002776] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </div>
          <a 
            href={`https://wa.me/11948626304`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#25D366] text-black px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center gap-2"
          >
            WhatsApp
          </a>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden pt-16 h-full">
        {/* ASIDE FILTERS (LEFT) */}
        <aside className="hidden lg:flex w-64 bg-[#0a0a0a] flex-col p-6 border-r border-neutral-800 sticky top-16 h-[calc(100vh-64px)] shrink-0">
          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#fedf00] font-black mb-6 italic flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Filtrar por Tipo
          </h3>
          <div className="flex flex-col gap-1 mb-10">
            {['Todos', ...Object.values(Category)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat as any)}
                className={`flex items-center justify-between text-[11px] font-bold uppercase tracking-wider py-2 px-3 rounded-lg transition-all ${selectedCategory === cat ? 'bg-neutral-800 text-[#fedf00]' : 'text-white/60 hover:text-white hover:bg-neutral-900'}`}
              >
                <span>{cat}</span>
                <span className="opacity-30 text-[9px]">{PRODUCTS.filter(p => cat === 'Todos' || p.category === cat).length}</span>
              </button>
            ))}
          </div>

          <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#fedf00] font-black mb-6 italic flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Faixa de Preço
          </h3>
          <div className="space-y-2">
            {[
              { id: 'any', label: 'Todos os preços' },
              { id: 'lte100', label: 'Até R$ 100' },
              { id: '100to200', label: 'R$ 100 - R$ 200' },
              { id: 'gte200', label: 'Acima de R$ 200' },
            ].map(range => (
              <button
                key={range.id}
                onClick={() => setPriceFilter(range.id as any)}
                className={`flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest w-full text-left transition-colors ${priceFilter === range.id ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-sm border ${priceFilter === range.id ? 'bg-[#fedf00] border-[#fedf00]' : 'border-neutral-700'}`}></div>
                {range.label}
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN SECTION (CENTER) */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden h-[calc(100vh-64px)] scrollbar-hide">
          {/* HERO BANNER */}
          <section className="relative h-64 md:h-80 bg-neutral-950 flex items-center shrink-0 border-b border-neutral-800 overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img 
                 src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1920" 
                 alt="Hero" 
                 className="w-full h-full object-cover opacity-20"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#002776]/60 to-black/80"></div>
            </div>
            
            <div className="container mx-auto px-8 relative z-10">
              <span className="inline-block px-2 py-1 bg-[#fedf00] text-black text-[9px] font-black uppercase italic mb-3 tracking-widest">Oferta Especial</span>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9] mb-3 tracking-tighter">
                VISTA SUA TORCIDA<br/>
                COM <span className="text-[#009b3a]">ESTILO</span> <span className="text-[#fedf00]">PRIME</span>
              </h2>
              <p className="text-xs text-white/60 mb-6 max-w-sm uppercase font-bold tracking-wider">
                Camisas do Brasil, clubes nacionais e internacionais com personalização oficial premium.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
                  className="bg-white text-black px-8 h-10 rounded-full text-xs font-black uppercase italic hover:bg-[#fedf00] transition-colors"
                >
                  Ver Produtos
                </button>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="border border-white/20 text-white px-8 h-10 rounded-full text-xs font-black uppercase italic hover:bg-white/10 transition-colors"
                >
                  Ofertas
                </button>
              </div>
            </div>
            <div className="absolute -right-12 bottom-0 opacity-10 text-[180px] font-black italic tracking-tighter select-none leading-none pointer-events-none whitespace-nowrap">
              {selectedCategory === 'Todos' ? 'PRIME' : selectedCategory.toUpperCase()}
            </div>
          </section>

          {/* SEARCH BAR (MOBILE) */}
          <div className="lg:hidden p-6 bg-neutral-900 border-b border-neutral-800">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="text" 
                placeholder="BUSCAR PRODUTO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:outline-none focus:border-[#fedf00] transition-all text-xs font-black uppercase tracking-widest"
              />
            </div>
          </div>

          {/* PRODUCTS LISTING */}
          <div className="p-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
                  {selectedCategory === 'Todos' ? 'LANÇAMENTOS' : selectedCategory}
                </h2>
                <div className="h-1 w-12 bg-[#fedf00] rounded-full"></div>
              </div>
              <p className="text-[10px] font-bold text-white/40 tracking-[0.2em]">{filteredProducts.length} ITENS</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p) => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onView={() => setSelectedProduct(p)} 
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="py-32 text-center">
                <Package className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white/80">Nada por aqui...</h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-2">Tente outros filtros ou termos.</p>
                <button 
                  onClick={() => { setSelectedCategory('Todos'); setPriceFilter('any'); setSearchQuery(''); }}
                  className="mt-6 text-[#fedf00] font-black uppercase text-[10px] tracking-widest italic hover:underline"
                >
                  LIMPAR FILTROS
                </button>
              </div>
            )}
          </div>
          
          {/* FOOTER */}
          <footer className="mt-auto h-12 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between px-8 text-[9px] uppercase tracking-[0.2em] text-white/40 font-medium shrink-0">
            <div className="flex items-center gap-4">
              <span>&copy; 2024 TORCIDA PRIME - OFICIAL SPORTSWEAR</span>
              <a href="/admin" className="text-neutral-700 hover:text-gold transition-colors">Portal do Vendedor</a>
            </div>
            <div className="hidden md:flex gap-6">
              <span>ENVIOS PARA TODO BRASIL</span>
              <span>PERSONALIZAÇÃO PREMIUM</span>
              <span>PAGAMENTO SEGURO</span>
            </div>
          </footer>
        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 bg-black lg:hidden pt-8 p-6 flex flex-col"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center border-2 border-gold shadow-lg shadow-gold/20 flex-shrink-0 bg-gold">
                  <img 
                    src="https://i.imgur.com/UFZMD9V.png" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-2xl font-black italic tracking-tighter flex items-center gap-1 uppercase">
                  <span>TORCIDA</span>
                  <span className="text-[#fedf00]">PRIME</span>
                </div>
              </div>
              <h3 className="text-[10px] uppercase font-black text-[#fedf00] mb-4 italic">Categorias</h3>
              {['Todos', ...Object.values(Category)].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat as any); setIsMenuOpen(false); }}
                  className={`flex items-center justify-between text-base font-black uppercase tracking-tighter py-4 border-b border-neutral-800 transition-all ${selectedCategory === cat ? 'text-[#fedf00]' : 'text-white/60'}`}
                >
                  <span>{cat}</span>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
              ))}
              <a
                href="/admin"
                className="flex items-center justify-between text-base font-black uppercase tracking-tighter py-6 text-gold border-b border-neutral-800"
              >
                <span>Portal do Vendedor</span>
                <ShieldCheck className="w-5 h-5 text-gold" />
              </a>
            </div>
            
            <div className="mt-auto space-y-4">
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                <p className="text-[10px] font-black uppercase text-white/30 mb-2">Suporte Prime</p>
                <a href={`https://wa.me/11948626304`} className="text-sm font-black text-white italic">+55 11 94862-6304</a>
              </div>
            </div>
          </motion.div>
        )}
        {selectedProduct && (
          <ProductModal 
            key="product-modal"
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        )}
        {isCartOpen && (
          <CartModal 
            key="cart-modal"
            cart={cart}
            subtotal={cartSubtotal}
            total={cartTotal}
            onClose={() => setIsCartOpen(false)}
            onRemove={removeFromCart}
            onCheckout={() => setIsCheckoutOpen(true)}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            applyCoupon={applyCoupon}
            discount={discountAmount}
          />
        )}
        {isCheckoutOpen && (
          <CheckoutModal 
            key="checkout-modal"
            cart={cart}
            total={cartTotal}
            discount={discountAmount}
            coupon={appliedCoupon}
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={clearCart}
          />
        )}
      </AnimatePresence>

      <a 
        href={`https://wa.me/11948626304`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-full shadow-2xl z-40 hover:scale-110 active:scale-95 transition-all"
      >
        <MessageCircle className="w-8 h-8" />
      </a>
    </div>
  );
}

// --- Subcomponents ---

function ProductCard({ product, onView }: { product: Product, onView: () => void, key?: string | number }) {
  const images = getProductMedia(product);
  const sizes = getProductSizes(product);
  const isSoldOut = product.soldOut || (sizes.length > 0 && sizes.every(s => s === 'ESG'));
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-[#151515] border border-neutral-800 p-4 rounded-xl flex flex-col group hover:border-[#009b3a] transition-all relative overflow-hidden"
    >
      <div className="relative aspect-[4/5] bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center">
        <img 
          src={images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        {isSoldOut ? (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600/20 text-red-500 border border-red-600/30 px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest italic">ESGOTADO</span>
          </div>
        ) : (
          <>
            {product.isPopular && (
              <span className="absolute top-2 left-2 bg-[#fedf00] text-black text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter italic shadow-lg z-10">Mais Querido</span>
            )}
            {product.personalizable && (
              <span className="absolute top-2 right-2 bg-[#009b3a] text-white text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter italic z-10">Personalizável</span>
            )}
          </>
        )}
      </div>
      
      <div className="mt-4 flex-grow flex flex-col">
        <h4 className="font-bold text-sm truncate uppercase tracking-tight text-white/90 mb-1">{product.name}</h4>
        <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-4 italic">{product.category}</p>
        
        <div className="mt-auto flex justify-between items-end">
          <div>
            <span className="text-[#fedf00] font-black text-lg italic tracking-tighter">{formatCurrency(product.price)}</span>
            <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-none mt-1">{sizes.length > 0 ? sizes.join(', ') : 'Consulte disponibilidade'}</p>
          </div>
          <button 
            onClick={onView}
            className="bg-white/5 hover:bg-[#fedf00] hover:text-black p-2 rounded-lg transition-colors group/btn"
          >
            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function ProductModal({ 
  product, 
  onClose, 
  onAddToCart
}: { 
  product: Product, 
  onClose: () => void, 
  onAddToCart: (item: CartItem) => void,
  key?: string | number
}) {
  if (!product || !product.name) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-2xl text-center">
          <p className="text-white font-bold mb-4">Dados do produto incompletos.</p>
          <button onClick={onClose} className="px-6 py-2 bg-[#fedf00] text-black font-black rounded-lg">Voltar</button>
        </div>
      </div>
    );
  }

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [persType, setPersType] = useState<PersonalizationType>(PersonalizationType.NONE);
  const [persName, setPersName] = useState('');
  const [persNumber, setPersNumber] = useState('');
  const [persPhrase, setPersPhrase] = useState('');
  const [persObs, setPersObs] = useState('');

  const images = getProductMedia(product);
  const sizes = getProductSizes(product);

  const persCost = PERSONALIZATION_OPTIONS[persType].price;
  const isSoldOutSize = (size: string) => size === 'ESG';

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Por favor, selecione um tamanho.');
      return;
    }
    
    if (persType === PersonalizationType.NAME_NUMBER || persType === PersonalizationType.NAME_OR_NUMBER) {
      if (persName.length > 12) return alert('O nome excede o limite de 12 letras.');
      if (persNumber.length > 2) return alert('O número excede o limite de 2 dígitos.');
    } else if (persType === PersonalizationType.PHRASE) {
      const lines = persPhrase.split('\n');
      if (lines.length > 5) return alert('A frase excede o limite de 5 linhas.');
      if (lines.some(l => l.length > 12)) return alert('Uma das linhas excede o limite de 12 letras.');
    }

    const cartItem: CartItem = {
      cartId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      product,
      selectedSize,
      quantity,
      personalization: {
        type: persType,
        name: persName,
        number: persNumber,
        phrase: persPhrase,
        observation: persObs,
        additionalPrice: persCost
      }
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-neutral-900 w-full max-w-5xl rounded-[2rem] border border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full z-10 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery */}
        <div className="md:w-1/2 bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#002776]/20 to-transparent"></div>
          
          <div className="relative w-full aspect-square flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                src={images[activeImage] || images[0]} 
                alt={`${product.name} - ${activeImage + 1}`} 
                className="max-h-[60vh] w-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              />
            </AnimatePresence>

            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-0 z-20 p-2 bg-black/50 hover:bg-[#fedf00] hover:text-black rounded-full text-white transition-all backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 z-20 p-2 bg-black/50 hover:bg-[#fedf00] hover:text-black rounded-full text-white transition-all backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-8 relative z-20">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`w-12 h-16 rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#fedf00] scale-110' : 'border-neutral-800 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info & Options */}
        <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto scrollbar-hide text-white">
          <div className="mb-8">
            <span className="text-[10px] font-black text-[#fedf00] uppercase tracking-[0.2em] block mb-2 italic">OFICIAL {product.category}</span>
            <h2 className="text-3xl font-black text-white leading-tight mb-4 uppercase italic tracking-tighter">{product.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-black text-[#fedf00] italic">{formatCurrency(product.price)}</span>
              {persCost > 0 && (
                <span className="text-[10px] font-black text-[#009b3a] bg-[#009b3a]/10 px-3 py-1 rounded-full uppercase italic">+ {formatCurrency(persCost)} Personalização</span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-3 italic">Descrição Técnica</h4>
            <p className="text-white/60 leading-relaxed text-xs font-medium uppercase tracking-wide">
              {product.description || getAutoDescription(product.name, product.category)}
            </p>
          </div>

          <div className="mb-8">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 italic">Selecione o Tamanho</h4>
            <div className="flex flex-wrap gap-2">
              {sizes.length > 0 ? (
                sizes.map(size => (
                  <button
                    key={size}
                    disabled={isSoldOutSize(size)}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[50px] h-[50px] rounded-xl flex items-center justify-center font-black text-xs border-2 transition-all italic ${isSoldOutSize(size) ? 'bg-neutral-800 border-neutral-800 text-white/10 cursor-not-allowed' : selectedSize === size ? 'bg-[#fedf00] border-[#fedf00] text-black shadow-lg shadow-[#fedf00]/10' : 'bg-neutral-950 border-neutral-800 text-white/60 hover:border-white/20'}`}
                  >
                    {isSoldOutSize(size) ? 'ESG' : size}
                  </button>
                ))
              ) : (
                <p className="text-[10px] text-[#fedf00] font-black bg-[#fedf00]/10 px-4 py-3 rounded-xl italic text-center w-full uppercase tracking-widest">Consulte disponibilidade no WhatsApp</p>
              )}
            </div>
          </div>

          {/* Personalization Section */}
          <div className="mb-10 p-6 bg-neutral-950 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-white italic">Personalização Premium</h4>
              {!product.personalizable && (
                <div className="text-[9px] bg-neutral-800 text-white/30 px-3 py-1 rounded-full uppercase font-black italic">Indisponível</div>
              )}
            </div>

            {product.personalizable ? (
              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3 block italic">Tipo de Adicional</label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.values(PersonalizationType).map(type => (
                      <button
                        key={type}
                        onClick={() => setPersType(type)}
                        className={`text-[9px] font-black p-3 rounded-xl border text-center transition-all min-h-[50px] flex flex-col justify-center uppercase italic tracking-tighter ${persType === type ? 'bg-[#009b3a] text-white border-[#009b3a] shadow-lg shadow-[#009b3a]/10' : 'bg-neutral-900 text-white/40 border-neutral-800 hover:border-neutral-700'}`}
                      >
                        {type}
                        {PERSONALIZATION_OPTIONS[type].price > 0 && <span className="block opacity-60 mt-1">+{formatCurrency(PERSONALIZATION_OPTIONS[type].price)}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {persType !== PersonalizationType.NONE && (
                    <motion.div 
                      key={persType}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="bg-[#fedf00]/10 border border-[#fedf00]/20 p-2 rounded-lg text-center">
                        <p className="text-[9px] text-[#fedf00] font-black uppercase tracking-widest italic">
                          LIMITES: {PERSONALIZATION_OPTIONS[persType].limits}
                        </p>
                      </div>

                      {(persType === PersonalizationType.NAME_NUMBER || persType === PersonalizationType.NAME_OR_NUMBER) && (
                        <div className="flex gap-4">
                          <div className="flex-grow">
                            <input 
                              type="text" 
                              placeholder="NOME NAS COSTAS"
                              maxLength={12}
                              value={persName}
                              onChange={(e) => setPersName(e.target.value.toUpperCase())}
                              className="w-full bg-black border border-neutral-800 p-3 rounded-xl uppercase text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors"
                            />
                            <div className="flex justify-between mt-1 px-1">
                              <span className="text-[8px] text-white/20 font-black uppercase tracking-widest italic font-bold">NOME</span>
                              <span className={`text-[8px] font-black ${persName.length > 12 ? 'text-red-500' : 'text-white/20'}`}>{persName.length}/12</span>
                            </div>
                          </div>
                          <div className="w-20">
                            <input 
                              type="text" 
                              placeholder="Nº"
                              maxLength={2}
                              value={persNumber}
                              onChange={(e) => setPersNumber(e.target.value.replace(/\D/g,''))}
                              className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-center text-xs font-black focus:outline-none focus:border-[#fedf00] transition-colors italic"
                            />
                            <div className="text-center mt-1">
                              <span className={`text-[8px] font-black ${persNumber.length > 2 ? 'text-red-500' : 'text-white/20'}`}>{persNumber.length}/2</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {persType === PersonalizationType.PHRASE && (
                        <div>
                          <textarea 
                            placeholder="SUA FRASE PERSONALIZADA"
                            rows={3}
                            value={persPhrase}
                            onChange={(e) => setPersPhrase(e.target.value)}
                            className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-xs font-black focus:outline-none focus:border-[#fedf00] transition-colors italic uppercase tracking-widest"
                          />
                          <div className="flex justify-between mt-1 px-1">
                            <span className="text-[8px] text-white/20 font-black uppercase tracking-widest italic">MÁX 5 LINHAS</span>
                            <span className="text-[8px] text-white/20 font-black tracking-widest italic">{persPhrase.split('\n').length}/5</span>
                          </div>
                        </div>
                      )}

                      <textarea 
                        placeholder="OBSERVAÇÕES ADICIONAIS"
                        value={persObs}
                        onChange={(e) => setPersObs(e.target.value)}
                        className="w-full bg-black border border-neutral-800 p-3 rounded-xl text-[10px] font-bold focus:outline-none focus:border-[#fedf00] transition-colors uppercase tracking-wider"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-[10px] font-black text-white/20 text-center py-6 bg-black rounded-xl border border-neutral-800/50 flex flex-col items-center justify-center gap-2 uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5 opacity-20" /> 
                Personalização indisponível para este item.
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 sticky bottom-0 bg-neutral-900 pt-4 md:pt-0">
            <div className="flex items-center gap-1 bg-black p-1 rounded-xl h-14 border border-neutral-800">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg transition-colors text-white/40 hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-black italic">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-neutral-800 rounded-lg transition-colors text-white/40 hover:text-white"
                >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-grow bg-[#fedf00] text-black h-14 rounded-xl font-black uppercase tracking-tighter italic hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#fedf00]/5 flex items-center justify-center gap-2 text-sm"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CartModal({ 
  cart, 
  subtotal, 
  total, 
  onClose, 
  onRemove, 
  onCheckout,
  couponInput,
  setCouponInput,
  applyCoupon,
  discount
}: { 
  cart: CartItem[], 
  subtotal: number, 
  total: number, 
  onClose: () => void, 
  onRemove: (id: string) => void,
  onCheckout: () => void,
  couponInput: string,
  setCouponInput: (v: string) => void,
  applyCoupon: () => void,
  discount: number,
  key?: string | number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex justify-end"
    >
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" onClick={onClose}></div>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="bg-black w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl border-l border-neutral-800 text-white"
      >
        <div className="p-8 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <h3 className="text-xl font-black tracking-tighter uppercase italic">Seu Carrinho ({cart.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5 text-white" /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-6 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <p className="font-black uppercase tracking-widest text-[10px]">Vazio</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.cartId} className="flex gap-4 group bg-neutral-900 border border-neutral-800 p-4 rounded-xl">
                <div className="w-20 h-24 bg-neutral-950 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={getProductMedia(item.product)[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h5 className="text-[9px] font-black text-[#009b3a] uppercase tracking-widest italic">{item.product.category}</h5>
                    <button onClick={() => onRemove(item.cartId)} className="text-white/20 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <h4 className="font-bold text-xs leading-tight mb-2 uppercase truncate text-white/90">{item.product.name}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[8px] bg-neutral-950 text-white/40 font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-neutral-800">TAM: {item.selectedSize}</span>
                    <span className="text-[8px] bg-neutral-950 text-white/40 font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-neutral-800">QTD: {item.quantity}</span>
                  </div>
                  <p className="text-sm font-black text-[#fedf00] italic">{formatCurrency((Number(item.product.price || 0) + (item.personalization?.additionalPrice || 0)) * item.quantity)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-8 bg-neutral-950 border-t border-neutral-800 space-y-6">
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden focus-within:border-[#fedf00] transition-colors">
              <input 
                type="text" 
                placeholder="CUPOM DE DESCONTO"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                className="flex-grow bg-transparent px-4 py-3 text-[10px] font-black tracking-widest focus:outline-none uppercase"
              />
              <button 
                onClick={applyCoupon}
                className="bg-[#fedf00] text-black px-6 py-3 text-[10px] font-black uppercase italic hover:brightness-110"
              >
                OK
              </button>
            </div>

            <div className="space-y-4 py-4 border-t border-neutral-800">
              <div className="flex justify-between text-[11px] font-bold text-white/40 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[11px] text-[#009b3a] font-black uppercase tracking-widest italic">
                  <span>Cupom (25%)</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-black border-t border-neutral-800 pt-4 mt-2 italic tracking-tighter">
                <span className="uppercase">Total</span>
                <span className="text-[#fedf00]">{formatCurrency(total)}</span>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-[#fedf00] text-black font-black py-5 rounded-xl uppercase tracking-tighter italic text-sm shadow-xl shadow-[#fedf00]/5 hover:translate-y-[-1px] transition-all flex items-center justify-center gap-3"
            >
              Finalizar Pedido <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function CheckoutModal({ 
  cart, 
  total, 
  discount, 
  coupon, 
  onClose, 
  onSuccess 
}: { 
  cart: CartItem[], 
  total: number, 
  discount: number, 
  coupon: string | null, 
  onClose: () => void, 
  onSuccess: () => void,
  key?: string | number
}) {
  const [formData, setFormData] = useState<OrderData>({
    customer: { name: '', whatsapp: '', email: '' },
    address: { cep: '', street: '', number: '', neighborhood: '', city: '', state: '' },
    shipping: 'Correios',
    payment: 'Pix',
    coupon: coupon || undefined,
    discountAmount: discount
  });

  const handleFinalize = async () => {
    if (!formData.customer.name || !formData.customer.whatsapp) {
      alert('Por favor, preencha nome e WhatsApp.');
      return;
    }
    if (!formData.address.cep || !formData.address.street) {
      alert('Por favor, preencha o endereço completo.');
      return;
    }

    try {
      // Prepare full order data
      const orderToSave = {
        cliente: {
          nome: formData.customer.name,
          whatsapp: formData.customer.whatsapp,
          email: formData.customer.email
        },
        endereco: {
          cep: formData.address.cep,
          rua: formData.address.street,
          numero: formData.address.number,
          complemento: formData.address.complement || '',
          bairro: formData.address.neighborhood,
          cidade: formData.address.city,
          estado: formData.address.state
        },
        entrega: formData.shipping,
        formaPagamento: formData.payment,
        itens: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selectedSize: item.selectedSize,
          personalization: item.personalization
        })),
        subtotal: total + discount,
        desconto: discount,
        cupom: coupon || null,
        total: total
      };

      // Create Order in Firestore
      await adminService.createOrder(orderToSave);

      // Record item-level sales for dashboard as well (optional but good for compatibility with existing dashboard)
      await adminService.recordSale(cart, coupon || null, discount);

      const orderDataWithCoupon: OrderData = {
        ...formData,
        coupon: coupon || undefined,
        discountAmount: discount
      };

      const link = generateWhatsAppLink(cart, orderDataWithCoupon, total);
      window.open(link, '_blank');
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Não foi possível finalizar seu pedido. Tente novamente ou finalize seu pedido pelo WhatsApp (11) 94862-6304');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-xl" onClick={onClose}></div>
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 50, scale: 0.95 }}
        className="bg-neutral-900 w-full max-w-2xl rounded-[2rem] border border-neutral-800 shadow-2xl relative z-10 flex flex-col h-auto max-h-[95vh] text-white"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-neutral-800 rounded-full text-white transition-colors z-20"><X className="w-5 h-5" /></button>
        
        <div className="p-8 border-b border-neutral-800 bg-neutral-950 text-center">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Confirmar Pedido</h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Insira seus dados para finalizar</p>
        </div>

        <div className="p-8 overflow-y-auto scrollbar-hide space-y-10">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fedf00] mb-6 italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Dados de Contato
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input 
                  type="text" 
                  placeholder="NOME COMPLETO"
                  value={formData.customer.name}
                  onChange={(e) => setFormData({...formData, customer: {...formData.customer, name: e.target.value}})}
                  className="w-full bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
                />
              </div>
              <input 
                type="text" 
                placeholder="WHATSAPP (DDD)"
                value={formData.customer.whatsapp}
                onChange={(e) => setFormData({...formData, customer: {...formData.customer, whatsapp: e.target.value.replace(/\D/g,'')}})}
                className="bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
              <input 
                type="email" 
                placeholder="E-MAIL"
                value={formData.customer.email}
                onChange={(e) => setFormData({...formData, customer: {...formData.customer, email: e.target.value}})}
                className="bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
            </div>
          </div>

          <div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fedf00] mb-6 italic flex items-center gap-2">
               <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Endereço de Entrega
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <input 
                placeholder="CEP"
                value={formData.address.cep}
                onChange={(e) => setFormData({...formData, address: {...formData.address, cep: e.target.value.replace(/\D/g,'')}})}
                className="md:col-span-2 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors"
                maxLength={8}
              />
              <input 
                placeholder="RUA / LOGRADOURO"
                value={formData.address.street}
                onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                className="md:col-span-4 col-span-2 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
              <input 
                placeholder="Nº"
                value={formData.address.number}
                onChange={(e) => setFormData({...formData, address: {...formData.address, number: e.target.value}})}
                className="md:col-span-1 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
              <input 
                placeholder="BAIRRO"
                value={formData.address.neighborhood}
                onChange={(e) => setFormData({...formData, address: {...formData.address, neighborhood: e.target.value}})}
                className="md:col-span-2 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
              <input 
                placeholder="CIDADE"
                value={formData.address.city}
                onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                className="md:col-span-2 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
              <input 
                placeholder="UF"
                maxLength={2}
                value={formData.address.state}
                onChange={(e) => setFormData({...formData, address: {...formData.address, state: e.target.value.toUpperCase()}})}
                className="md:col-span-1 bg-black border border-neutral-800 p-4 rounded-xl text-xs font-black italic tracking-widest focus:outline-none focus:border-[#fedf00] transition-colors uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fedf00] mb-4 italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Pagamento
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {['Pix', 'Cartão', 'Boleto'].map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({...formData, payment: method as any})}
                    className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase italic tracking-widest transition-all flex items-center justify-between ${formData.payment === method ? 'bg-[#009b3a] border-[#009b3a] text-white shadow-lg shadow-[#009b3a]/10' : 'bg-black border-neutral-800 text-white/40 hover:border-neutral-700'}`}
                  >
                    {method}
                    {formData.payment === method && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#fedf00] mb-4 italic flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#fedf00] rotate-45"></span> Entrega
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {['Correios', 'Transportadora'].map(ship => (
                  <button
                    key={ship}
                    type="button"
                    onClick={() => setFormData({...formData, shipping: ship as any})}
                    className={`py-3 px-4 rounded-xl border text-[10px] font-black uppercase italic tracking-widest transition-all flex items-center justify-between ${formData.shipping === ship ? 'bg-[#002776] border-[#002776] text-white shadow-lg shadow-[#002776]/10' : 'bg-black border-neutral-800 text-white/40 hover:border-neutral-700'}`}
                  >
                    {ship}
                    {formData.shipping === ship && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 bg-neutral-900 sticky bottom-0">
             <div className="bg-black border border-neutral-800 rounded-2xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Total do Pedido</span>
                  {formData.coupon && <span className="bg-[#009b3a] text-[8px] px-2 py-1 rounded font-black text-white italic">CUPOM ATIVO</span>}
                </div>
                <div className="text-3xl font-black italic tracking-tighter text-[#fedf00]">{formatCurrency(total)}</div>
             </div>

            <button 
              onClick={handleFinalize}
              className="w-full bg-[#fedf00] text-black font-black py-5 rounded-xl uppercase tracking-tighter italic shadow-xl shadow-[#fedf00]/5 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-3 text-sm"
            >
              FINALIZAR E ABRIR WHATSAPP
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[8px] text-white/20 mt-4 uppercase font-black tracking-[0.3em]">Redirecionando para atendimento</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
